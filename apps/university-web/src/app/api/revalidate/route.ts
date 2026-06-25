import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getSearchUniversitiesAllRegions } from "@/apis/universities/server";
import { getHomeUniversityBySlug, HOME_UNIVERSITY_LIST, HOME_UNIVERSITY_SLUGS } from "@/constants/university";
import type { HomeUniversitySlug } from "@/types/university";

type RevalidateScope = "university" | "home-university" | "path";

type RevalidateRequestBody = {
  scope?: RevalidateScope;
  homeUniversity?: HomeUniversitySlug;
  path?: string;
  includeDetails?: boolean;
};

const getBearerToken = (authorizationHeader: string | null) => {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.slice("Bearer ".length).trim();
};

const isAuthorized = (request: Request) => {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    return false;
  }

  const requestSecret =
    getBearerToken(request.headers.get("authorization")) ?? request.headers.get("x-revalidate-secret");

  return requestSecret === secret;
};

const isAllowedUniversityPath = (path: string) => {
  if (!path.startsWith("/university")) {
    return false;
  }

  if (path.includes("://") || path.includes("..")) {
    return false;
  }

  return (
    path === "/university" || path === "/university/search" || /^\/university\/[a-z0-9-]+(\/search|\/\d+)?$/.test(path)
  );
};

const revalidateUniversityPath = (path: string, revalidatedPaths: Set<string>) => {
  revalidatePath(path);
  revalidatedPaths.add(path);
};

const revalidateHomeUniversityPaths = async (
  homeUniversity: HomeUniversitySlug,
  includeDetails: boolean,
  revalidatedPaths: Set<string>,
) => {
  const homeUniversityInfo = getHomeUniversityBySlug(homeUniversity);

  if (!homeUniversityInfo) {
    throw new Error(`Invalid homeUniversity: ${homeUniversity}`);
  }

  revalidateUniversityPath(`/university/${homeUniversity}`, revalidatedPaths);
  revalidateUniversityPath(`/university/${homeUniversity}/search`, revalidatedPaths);

  if (!includeDetails) {
    return;
  }

  const universities = await getSearchUniversitiesAllRegions({
    homeUniversityId: homeUniversityInfo.homeUniversityId,
  });

  for (const university of universities) {
    revalidateUniversityPath(`/university/${homeUniversity}/${university.id}`, revalidatedPaths);
  }
};

const parseRequestBody = async (request: Request): Promise<RevalidateRequestBody> => {
  try {
    return (await request.json()) as RevalidateRequestBody;
  } catch {
    return {};
  }
};

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await parseRequestBody(request);
  const scope = body.scope ?? "university";
  const includeDetails = body.includeDetails ?? true;
  const revalidatedPaths = new Set<string>();

  try {
    if (scope === "path") {
      if (!body.path || !isAllowedUniversityPath(body.path)) {
        return NextResponse.json({ message: "Invalid revalidation path" }, { status: 400 });
      }

      revalidateUniversityPath(body.path, revalidatedPaths);
    } else if (scope === "home-university") {
      if (!body.homeUniversity || !HOME_UNIVERSITY_SLUGS.includes(body.homeUniversity)) {
        return NextResponse.json({ message: "Invalid homeUniversity" }, { status: 400 });
      }

      await revalidateHomeUniversityPaths(body.homeUniversity, includeDetails, revalidatedPaths);
    } else if (scope === "university") {
      revalidateUniversityPath("/university", revalidatedPaths);
      revalidateUniversityPath("/university/search", revalidatedPaths);

      for (const homeUniversity of HOME_UNIVERSITY_LIST) {
        await revalidateHomeUniversityPaths(homeUniversity.slug, includeDetails, revalidatedPaths);
      }
    } else {
      return NextResponse.json({ message: "Invalid revalidation scope" }, { status: 400 });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({ message: "Failed to revalidate", error: errorMessage }, { status: 500 });
  }

  return NextResponse.json({
    revalidated: true,
    paths: Array.from(revalidatedPaths),
  });
}
