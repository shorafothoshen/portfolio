import { NextResponse } from "next/server";
import { getGithubData } from "@/lib/github/service";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getGithubData();

  const nothingLoaded =
    !data.contributions && !data.repos && data.publicRepos === null;
  const hasErrors = Object.keys(data.errors).length > 0;

  return NextResponse.json(data, {
    status: nothingLoaded ? 502 : 200,
    headers: {
      "Cache-Control":
        nothingLoaded || hasErrors
          ? "no-store"
          : "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
