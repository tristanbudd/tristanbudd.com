import { NextRequest, NextResponse } from "next/server";
import { getGitHubContributions } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "tristanbudd";

  try {
    const count = await getGitHubContributions(username);
    return NextResponse.json({ count });
  } catch (error) {
    console.error("GET /api/github error:", error);
    return NextResponse.json({ error: "Failed to fetch GitHub contributions." }, { status: 500 });
  }
}
