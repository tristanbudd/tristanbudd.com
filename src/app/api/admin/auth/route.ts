import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();
    const ownerAccount = process.env.ADMIN_OWNER_ACCOUNT || "tristanbudd";

    if (username !== ownerAccount) {
      return NextResponse.json(
        { error: `Access Denied: Only ${ownerAccount} is permitted to enter.` },
        { status: 403 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_session", ownerAccount, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request data." }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0), // expire immediately
  });
  return response;
}
