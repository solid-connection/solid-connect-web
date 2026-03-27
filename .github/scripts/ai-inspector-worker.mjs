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

const runCommandOutput = (command, args, options = {}) =>
  execFileSync(command, args, {
    stdio: "pipe",
    encoding: "utf8",
    ...options,
  });

const runGit = (args, options = {}) => {
  execFileSync("git", args, {
    stdio: "pipe",
    encoding: "utf8",
    ...options,
  });
};

const runGitOutput = (args, options = {}) => runCommandOutput("git", args, options);

const runCommand = (command, args, options = {}) => {
  execFileSync(command, args, {
    stdio: "inherit",
    encoding: "utf8",
    ...options,
  });
};

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const resolveGitHubToken = () => {
  const envToken = process.env.GITHUB_TOKEN?.trim() || process.env.GH_TOKEN?.trim();
  if (envToken) {
    return envToken;
  }

  try {
    const ghToken = runCommandOutput("gh", ["auth", "token"]).trim();
    if (ghToken) {
      return ghToken;
    }
  } catch {
    // Ignore and throw with clear message below.
  }

  throw new Error("Missing GitHub token. Set GITHUB_TOKEN or GH_TOKEN, or run `gh auth login`.");
};

const resolveGitHubRepository = () => {
  const repository = process.env.GITHUB_REPOSITORY?.trim();
  if (repository) {
    return repository;
  }

  const remoteUrl = runGitOutput(["remote", "get-url", "origin"]).trim();
  const normalizedUrl = remoteUrl.startsWith("git@github.com:")
    ? remoteUrl.replace("git@github.com:", "https://github.com/")
    : remoteUrl;
  const parsedUrl = new URL(normalizedUrl);

  if (parsedUrl.hostname !== "github.com") {
    throw new Error(`Unsupported remote host for origin: ${parsedUrl.hostname}`);
  }

  const pathname = parsedUrl.pathname.replace(/^\/+/, "").replace(/\.git$/, "");
  const [owner, repoName] = pathname.split("/");
  if (!owner || !repoName) {
    throw new Error(`Failed to infer GITHUB_REPOSITORY from origin remote: ${remoteUrl}`);
  }

  return `${owner}/${repoName}`;
};

const escapeMarkdown = (value) => String(value ?? "").replace(/`/g, "\\`");

const toIso = () => new Date().toISOString();

const listChangedFiles = () =>
  runGitOutput(["status", "--porcelain"])
    .split("\n")
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .map((line) => {
      const rawPath = line.slice(3);
      const targetPath = rawPath.includes(" -> ") ? rawPath.split(" -> ").pop() : rawPath;
      return String(targetPath ?? "").replace(/^"/, "").replace(/"$/, "");
    });

const assertCleanWorkingTree = () => {
  const status = runGitOutput(["status", "--porcelain"]).trim();
  if (status) {
    throw new Error(
      "Working tree must be clean before running ai-inspector worker. Use a dedicated clean worktree.",
    );
  }
};

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

const githubRequest = async (token, method, pathName, body) => {
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

const findOpenPrByHead = async (token, owner, repo, branchName) => {
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

const requestPatchFromAiEndpoint = async ({ taskId, task, branchName, repository, baseBranch }) => {
  const endpoint = process.env.AI_INSPECTOR_PATCH_ENDPOINT;
  if (!endpoint) {
    return null;
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
      repository,
      branchName,
      baseBranch,
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
    appliedBy: "patch-endpoint",
  };
};

const buildCodexPrompt = ({ taskId, task, repository, baseBranch, branchName }) => {
  const selector = task.selector ?? task.element?.selector ?? "";
  const pageUrl = task.pageUrl ?? "";
  const textSnippet = task.element?.textSnippet ?? "";
  const instruction = task.instruction ?? "";

  return [
    "You are implementing one AI inspector UI task in this repository.",
    "Apply real code changes that satisfy the request, keeping edits minimal and scoped.",
    "Do not create commits, do not push, and do not modify environment files.",
    "",
    `Repository: ${repository}`,
    `Base branch: ${baseBranch}`,
    `Working branch: ${branchName}`,
    `Task ID: ${taskId}`,
    `Page URL: ${pageUrl}`,
    `Selector: ${selector}`,
    `Text snippet: ${textSnippet}`,
    "",
    "Instruction:",
    instruction,
    "",
    "After applying changes, ensure files are saved and leave the repo ready for git add/commit.",
  ].join("\n");
};

const runLocalCodexEdit = async ({ taskId, task, branchName, repository, baseBranch }) => {
  const codexEnabled = process.env.AI_INSPECTOR_LOCAL_CODEX_ENABLED?.trim() ?? "true";
  if (codexEnabled.toLowerCase() === "false") {
    return null;
  }

  const outputPath = path.resolve(".ai-inspector", `codex-last-message-${taskId}.txt`);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const args = [
    "exec",
    "--dangerously-bypass-approvals-and-sandbox",
    "--color",
    "never",
    "--output-last-message",
    outputPath,
  ];

  const model = process.env.AI_INSPECTOR_CODEX_MODEL?.trim();
  if (model) {
    args.push("--model", model);
  }

  args.push(buildCodexPrompt({ taskId, task, repository, baseBranch, branchName }));
  runCommand("codex", args, { env: process.env });

  const summary = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8").trim() : "";
  fs.rmSync(outputPath, { force: true });

  return {
    patch: "",
    summary: summary || "Local Codex edit applied.",
    title: "",
    appliedBy: "local-codex",
  };
};

const resolveAiResult = async (context) => {
  const endpointResult = await requestPatchFromAiEndpoint(context);
  if (endpointResult) {
    return endpointResult;
  }

  const localCodexResult = await runLocalCodexEdit(context);
  if (localCodexResult) {
    return localCodexResult;
  }

  throw new Error(
    "No AI edit backend available. Configure AI_INSPECTOR_PATCH_ENDPOINT or enable local Codex execution.",
  );
};

const getPreviewUrlFromVercel = async (branchName) => {
  const token = process.env.VERCEL_TOKEN?.trim();
  const projectId = process.env.VERCEL_PROJECT_ID?.trim();

  if (!token || !projectId) {
    return "";
  }

  const intervalMs = Number(process.env.AI_INSPECTOR_VERCEL_PREVIEW_INTERVAL_MS ?? "10000");
  const timeoutMs = Number(process.env.AI_INSPECTOR_VERCEL_PREVIEW_TIMEOUT_MS ?? "240000");
  const pollingIntervalMs = Number.isFinite(intervalMs) && intervalMs > 0 ? intervalMs : 10000;
  const pollingTimeoutMs = Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 240000;
  const deadline = Date.now() + pollingTimeoutMs;

  while (Date.now() < deadline) {
    const params = new URLSearchParams({
      projectId,
      limit: "20",
      target: "preview",
      "meta-githubCommitRef": branchName,
    });

    const teamId = process.env.VERCEL_TEAM_ID?.trim();
    if (teamId) {
      params.set("teamId", teamId);
    }

    const response = await fetch(`https://api.vercel.com/v6/deployments?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to fetch Vercel deployment (${response.status}): ${body}`);
    }

    const data = await response.json();
    const deployments = Array.isArray(data?.deployments) ? data.deployments : [];
    const deployment =
      deployments.find((item) => item?.meta?.githubCommitRef === branchName) ?? deployments[0] ?? null;

    if (deployment?.readyState === "READY" && deployment?.url) {
      return `https://${deployment.url}`;
    }

    if (deployment?.readyState === "ERROR" || deployment?.readyState === "CANCELED") {
      return "";
    }

    await sleep(pollingIntervalMs);
  }

  return "";
};

const getPreviewUrlFromGitHubCommitStatus = async (token, owner, repo, commitSha) => {
  const intervalMs = Number(process.env.AI_INSPECTOR_VERCEL_PREVIEW_INTERVAL_MS ?? "10000");
  const timeoutMs = Number(process.env.AI_INSPECTOR_VERCEL_PREVIEW_TIMEOUT_MS ?? "240000");
  const pollingIntervalMs = Number.isFinite(intervalMs) && intervalMs > 0 ? intervalMs : 10000;
  const pollingTimeoutMs = Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 240000;
  const deadline = Date.now() + pollingTimeoutMs;

  while (Date.now() < deadline) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${commitSha}/status`, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to fetch commit statuses from GitHub (${response.status}): ${body}`);
    }

    const data = await response.json();
    const statuses = Array.isArray(data?.statuses) ? data.statuses : [];
    const urlStatus =
      statuses.find((status) => typeof status?.target_url === "string" && status.target_url.includes("vercel.app")) ??
      statuses.find(
        (status) =>
          typeof status?.context === "string" &&
          status.context.toLowerCase().includes("vercel") &&
          typeof status?.target_url === "string",
      );

    if (urlStatus?.target_url) {
      return urlStatus.target_url;
    }

    await sleep(pollingIntervalMs);
  }

  return "";
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

const toErrorMessage = (error) => String(error instanceof Error ? error.message : error);

const markTaskFailed = async (taskRef, error) => {
  await taskRef.update({
    status: "failed",
    errorMessage: toErrorMessage(error),
    updatedAt: FieldValue.serverTimestamp(),
    failedAt: FieldValue.serverTimestamp(),
  });
};

const claimQueuedTask = async (db, collectionName) => {
  const queued = await db
    .collection(collectionName)
    .where("status", "==", "queued")
    .limit(10)
    .get();

  const orderedDocs = [...queued.docs].sort((a, b) => {
    const aMillis = a.get("createdAt")?.toMillis?.() ?? Number.MAX_SAFE_INTEGER;
    const bMillis = b.get("createdAt")?.toMillis?.() ?? Number.MAX_SAFE_INTEGER;
    return aMillis - bMillis;
  });

  for (const doc of orderedDocs) {
    const taskRef = doc.ref;
    const claimedTask = await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(taskRef);
      if (!snapshot.exists) {
        return null;
      }

      const task = snapshot.data();
      if (!task || task.status !== "queued") {
        return null;
      }

      transaction.update(taskRef, {
        status: "processing",
        startedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return {
        taskId: snapshot.id,
        task,
      };
    });

    if (claimedTask) {
      return { ...claimedTask, taskRef };
    }
  }

  return null;
};

const main = async () => {
  const githubToken = resolveGitHubToken();
  const repo = resolveGitHubRepository();
  const [owner, repoName] = repo.split("/");
  const baseBranch = process.env.AI_INSPECTOR_BASE_BRANCH || "main";
  const collectionName = process.env.AI_INSPECTOR_FIRESTORE_COLLECTION || "aiInspectorTasks";

  assertCleanWorkingTree();

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
  const claimed = await claimQueuedTask(db, collectionName);
  if (!claimed) {
    console.log("No queued inspector tasks.");
    return;
  }

  const { taskRef, task, taskId } = claimed;

  try {
    const branchName = `ai-inspector/${taskId}`;
    const filePath = `.ai-inspector/tasks/${taskId}.md`;

    runGit(["fetch", "origin", baseBranch]);
    runGit(["checkout", "-B", branchName, `origin/${baseBranch}`]);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, buildTaskMarkdown(taskId, task), "utf8");
    runGit(["add", filePath]);

    const aiResult = await resolveAiResult({
      taskId,
      task,
      branchName,
      repository: repo,
      baseBranch,
    });
    const patchApplied = applyPatch(aiResult.patch);

    runGit(["add", "-A"]);
    const changedFiles = listChangedFiles();
    if (changedFiles.length === 0) {
      throw new Error("No changes to commit after AI inspector processing.");
    }

    const hasRealCodeChange = changedFiles.some((file) => file !== filePath);
    if (!hasRealCodeChange) {
      throw new Error("AI result did not include real code changes outside the task metadata file.");
    }

    const isRealAiApply = patchApplied || aiResult.appliedBy === "local-codex";
    const commitMessage = isRealAiApply
      ? `feat(ai-inspector): apply task ${taskId}`
      : `chore(ai-inspector): capture task ${taskId}`;
    runGit(["commit", "-m", commitMessage]);
    runGit(["push", "-u", "origin", branchName]);

    const existingPr = await findOpenPrByHead(githubToken, owner, repoName, branchName);
    const title =
      aiResult.title || `[AI Inspector] ${String(task.instruction ?? "UI update request").slice(0, 72)}`.trim();
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
      (await githubRequest(githubToken, "POST", `/repos/${owner}/${repoName}/pulls`, {
        title,
        head: branchName,
        base: baseBranch,
        body,
      }));

    const prUrl = pr.html_url;
    const commitSha = runGitOutput(["rev-parse", "HEAD"]).trim();
    let previewUrl = getPreviewUrl(branchName);
    try {
      previewUrl =
        (await getPreviewUrlFromVercel(branchName)) ||
        (await getPreviewUrlFromGitHubCommitStatus(githubToken, owner, repoName, commitSha)) ||
        previewUrl;
    } catch (previewError) {
      console.error(`Task ${taskId} preview URL resolution failed`, previewError);
    }

    await taskRef.update({
      status: "completed",
      branchName,
      prUrl,
      previewUrl,
      completedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    try {
      await sendDiscordNotification({
        taskId,
        prUrl,
        previewUrl,
        instruction: task.instruction,
      });

      await taskRef.update({
        notificationSent: true,
        notificationError: FieldValue.delete(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    } catch (notificationError) {
      console.error(`Task ${taskId} notification failed`, notificationError);
      try {
        await taskRef.update({
          notificationSent: false,
          notificationError: toErrorMessage(notificationError),
          updatedAt: FieldValue.serverTimestamp(),
        });
      } catch (updateError) {
        console.error(`Task ${taskId} notification error update failed`, updateError);
      }
    }

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
