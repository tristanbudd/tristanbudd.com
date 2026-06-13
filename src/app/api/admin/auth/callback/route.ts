import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // Construct standard base URL for redirecting using forwarding headers to handle reverse proxy setups correctly
  const proto = request.headers.get("x-forwarded-proto") || "http";
  const host = request.headers.get("x-forwarded-host") || request.nextUrl.host;
  const baseUrl = `${proto}://${host}`;

  if (error) {
    return NextResponse.redirect(
      new URL(`/admin/login?error=${encodeURIComponent(error)}`, baseUrl)
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL("/admin/login?error=no_code", baseUrl));
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const ownerAccount = process.env.ADMIN_OWNER_ACCOUNT || "tristanbudd";

  if (!clientId || !clientSecret) {
    console.error("Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET environment variables.");
    return NextResponse.redirect(new URL("/admin/login?error=missing_oauth_config", baseUrl));
  }

  try {
    // Exchange OAuth code for an access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || tokenData.error) {
      console.error("Token exchange failed:", tokenData);
      return NextResponse.redirect(
        new URL(
          `/admin/login?error=${encodeURIComponent(tokenData.error_description || "token_exchange_failed")}`,
          baseUrl
        )
      );
    }

    const accessToken = tokenData.access_token;

    // Fetch authenticated user profile from GitHub API
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "Tristan-Budd-Portfolio-App",
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok || !userData.login) {
      console.error("Failed to fetch user profile from GitHub API.");
      return NextResponse.redirect(new URL("/admin/login?error=user_fetch_failed", baseUrl));
    }

    const githubUsername = userData.login;

    // Verify user matches configured owner account
    if (githubUsername.toLowerCase() !== ownerAccount.toLowerCase()) {
      console.warn(
        `Access Denied: Attempt by user "${githubUsername}" (Expected owner: "${ownerAccount}").`
      );
      return NextResponse.redirect(new URL("/admin/login?error=denied", baseUrl));
    }

    // Authenticated successfully. Set httpOnly cookie.
    const response = NextResponse.redirect(new URL("/admin", baseUrl));
    response.cookies.set("admin_session", ownerAccount, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days session duration
    });

    return response;
  } catch (err) {
    console.error("GitHub OAuth Callback Error:", err);
    return NextResponse.redirect(new URL("/admin/login?error=server_error", baseUrl));
  }
}
