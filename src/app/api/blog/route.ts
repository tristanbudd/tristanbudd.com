import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const adminSession = request.cookies.get("admin_session")?.value;
    const ownerAccount = process.env.ADMIN_OWNER_ACCOUNT || "tristanbudd";
    const isAdmin = adminSession === ownerAccount;

    const blogs = await prisma.blogPost.findMany({
      where: isAdmin ? {} : { preview: false },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("GET /api/blog error:", error);
    return NextResponse.json({ error: "Failed to fetch blogs." }, { status: 500 });
  }
}
