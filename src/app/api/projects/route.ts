import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const adminSession = request.cookies.get("admin_session")?.value;
    const ownerAccount = process.env.ADMIN_OWNER_ACCOUNT || "tristanbudd";
    const isAdmin = adminSession === ownerAccount;

    const projects = await prisma.project.findMany({
      where: isAdmin ? {} : { preview: false },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects." }, { status: 500 });
  }
}
