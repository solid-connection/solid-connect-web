import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const required = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const runGit = (args, options = {}) => {
  execFileSync("git", args, {
    stdio: "pipe",
    encoding: "utf8",
    ...options,
  });
};

const runGitOutput = (args, options = {}) =>
  execFileSync("git", args, {
    stdio: "pipe",
    encoding: "utf8",
    ...options,
  });

const escapeMarkdown = (value) => String(value ?? "").replace(/`/g, "\\`");

const toIso = () => new Date().toISOString();

const buildTaskMarkdown = (taskId, task) => {
  const selector = task.selector ?? task.element?.selector ?? "";
  const pageUrl = task.pageUrl ?? "";
  const instruction = task.instruction ?? "";
  const requestedBy = task.requestedBy?.userId ?? "unknown";
  const role = task.requestedBy?.role ?? "unknown";
  const textSnippet = task.element?.textSnippet ?? "";

  return `# AI Inspector Task ${taskId}

- createdAt: ${task.createdAt?.toDate?.()?.toISOString?.() ?? "unknown"}
- requestedBy: ${escapeMarkdown(requestedBy)} (${escapeMarkdown(role)})
- pageUrl: ${escapeMarkdown(pageUrl)}
- selector: \`${escapeMarkdown(selector)}\`
- textSnippet: ${escapeMarkdown(textSnippet)}

## Instruction
${escapeMarkdown(instruction)}
`;
};

const getPreviewUrl = (branchName) => {
  const template = process.env.AI_INSPECTOR_PREVIEW_URL_TEMPLATE;
  if (!template) {
    return "";
  }

  return template.replaceAll("{branch}", branchName.replaceAll("/", "-"));
};

const githubRequest = async (method, pathName, body) => {
  const token = required("GITHUB_TOKEN");
  const response = await fetch(`https://api.github.com${pathName}`, {
    method,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API error (${response.status}): ${text}`);
  }

  return response.json();
};

const findOpenPrByHead = async (owner, repo, branchName) => {
  const token = required("GITHUB_TOKEN");
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls?state=open&head=${owner}:${encodeURIComponent(branchName)}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
};

const sendDiscordNotification = async ({ taskId, prUrl, previewUrl, instruction }) => {
  const webhook = process.env.AI_INSPECTOR_DISCORD_WEBHOOK_URL;
  if (!webhook) {
    return;
  }

  const timestamp = toIso();
  const response = await fetch(webhook, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "AI Inspector Bot",
      content: "AI 인스펙터 작업이 완료되었습니다.",
      embeds: [
        {
          title: `Task ${taskId}`,
          description: String(instruction ?? "").slice(0, 400),
          color: 5763719,
          fields: [
            {
              name: "PR",
              value: prUrl || "없음",
              inline: false,
            },
            {
              name: "Preview",
              value: previewUrl || "설정 없음",
              inline: false,
            },
          ],
          timestamp,
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Discord webhook failed (${response.status}): ${body}`);
  }
};

const requestPatchFromAiEndpoint = async ({ taskId, task, branchName }) => {
  const endpoint = process.env.AI_INSPECTOR_PATCH_ENDPOINT;
  if (!endpoint) {
    return {
      patch: "",
      summary: "AI_INSPECTOR_PATCH_ENDPOINT 미설정: 작업 파일만 커밋했습니다.",
    };
  }

  const apiKey = process.env.AI_INSPECTOR_PATCH_API_KEY;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({
      taskId,
      task,
      repository: process.env.GITHUB_REPOSITORY,
      branchName,
      baseBranch: process.env.AI_INSPECTOR_BASE_BRANCH || "main",
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`AI patch endpoint failed (${response.status}): ${body}`);
  }

  const data = await response.json();
  return {
    patch: typeof data.patch === "string" ? data.patch : "",
    summary: typeof data.summary === "string" ? data.summary : "AI patch applied",
    title: typeof data.title === "string" ? data.title : "",
  };
};

const applyPatch = (patch) => {
  if (!patch.trim()) {
    return false;
  }

  const patchPath = path.resolve(".ai-inspector", "tmp.patch");
  fs.mkdirSync(path.dirname(patchPath), { recursive: true });
  fs.writeFileSync(patchPath, patch, "utf8");
  runGit(["apply", "--index", "--3way", patchPath]);
  fs.rmSync(patchPath, { force: true });
  return true;
};

const markTaskFailed = async (taskRef, error) => {
  await taskRef.update({
    status: "failed",
    errorMessage: String(error instanceof Error ? error.message : error),
    updatedAt: FieldValue.serverTimestamp(),
    failedAt: FieldValue.serverTimestamp(),
  });
};

const main = async () => {
  const repo = required("GITHUB_REPOSITORY");
  const [owner, repoName] = repo.split("/");
  const baseBranch = process.env.AI_INSPECTOR_BASE_BRANCH || "main";
  const collectionName = process.env.AI_INSPECTOR_FIRESTORE_COLLECTION || "aiInspectorTasks";

  if (!owner || !repoName) {
    throw new Error(`Invalid GITHUB_REPOSITORY: ${repo}`);
  }

  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: required("AI_INSPECTOR_FIREBASE_PROJECT_ID"),
        clientEmail: required("AI_INSPECTOR_FIREBASE_CLIENT_EMAIL"),
        privateKey: required("AI_INSPECTOR_FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
      }),
    });
  }

  const db = getFirestore();
  const pending = await db
    .collection(collectionName)
    .where("status", "==", "pending")
    .orderBy("createdAt", "asc")
    .limit(1)
    .get();

  if (pending.empty) {
    console.log("No pending inspector tasks.");
    return;
  }

  const taskDoc = pending.docs[0];
  const taskRef = taskDoc.ref;
  const task = taskDoc.data();
  const taskId = taskDoc.id;

  await taskRef.update({
    status: "processing",
    startedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  try {
    const branchName = `ai-inspector/${taskId}`;
    const filePath = `.ai-inspector/tasks/${taskId}.md`;

    runGit(["fetch", "origin", baseBranch]);
    runGit(["checkout", "-B", branchName, `origin/${baseBranch}`]);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, buildTaskMarkdown(taskId, task), "utf8");
    runGit(["add", filePath]);

    const aiResult = await requestPatchFromAiEndpoint({ taskId, task, branchName });
    const patchApplied = applyPatch(aiResult.patch);

    const hasChanges = runGitOutput(["status", "--porcelain"]).trim().length > 0;
    if (!hasChanges) {
      throw new Error("No changes to commit after AI inspector processing.");
    }

    const commitMessage = patchApplied
      ? `[ai-inspector] apply task ${taskId}`
      : `[ai-inspector] capture task ${taskId}`;
    runGit(["commit", "-m", commitMessage]);
    runGit(["push", "-u", "origin", branchName]);

    const existingPr = await findOpenPrByHead(owner, repoName, branchName);
    const title =
      aiResult.title ||
      `[AI Inspector] ${String(task.instruction ?? "UI update request").slice(0, 72)}`.trim();
    const body = [
      `## Inspector Task`,
      `- taskId: ${taskId}`,
      `- pageUrl: ${task.pageUrl ?? "unknown"}`,
      `- selector: \`${task.selector ?? task.element?.selector ?? "unknown"}\``,
      "",
      `## Instruction`,
      `${task.instruction ?? ""}`,
      "",
      `## Worker Summary`,
      `${aiResult.summary ?? "N/A"}`,
    ].join("\n");

    const pr =
      existingPr ??
      (await githubRequest("POST", `/repos/${owner}/${repoName}/pulls`, {
        title,
        head: branchName,
        base: baseBranch,
        body,
      }));

    const prUrl = pr.html_url;
    const previewUrl = getPreviewUrl(branchName);

    await taskRef.update({
      status: "done",
      branchName,
      prUrl,
      previewUrl,
      completedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    await sendDiscordNotification({
      taskId,
      prUrl,
      previewUrl,
      instruction: task.instruction,
    });

    console.log(`Task ${taskId} completed: ${prUrl}`);
  } catch (error) {
    await markTaskFailed(taskRef, error);
    throw error;
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
