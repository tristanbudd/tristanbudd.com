import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    console.error("Missing GITHUB_CLIENT_ID in env configuration.");
    return NextResponse.redirect(
      new URL("/admin/login?error=missing_oauth_config", "https://tristanbudd.com")
    );
  }

  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=read:user`;
  return NextResponse.redirect(githubUrl);
}
