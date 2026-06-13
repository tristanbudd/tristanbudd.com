import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/admin/projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects." }, { status: 500 });
  }
}

// POST create a project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      slug,
      title,
      description,
      extendedDescription,
      tags,
      githubUrl,
      projectUrl,
      customFields,
      publishedAt,
    } = body;

    if (!slug || !title || !description) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Check if slug already exists
    const existing = await prisma.project.findUnique({
      where: { slug },
    });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists." }, { status: 400 });
    }

    const createData: unknown = {
      slug,
      title,
      description,
      extendedDescription: extendedDescription || "",
      tags: tags || [],
      githubUrl: githubUrl || null,
      projectUrl: projectUrl || null,
      customFields: customFields || [],
      publishedAt: publishedAt || null,
    };

    const project = await prisma.project.create({
      data: createData as Parameters<typeof prisma.project.create>[0]["data"],
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("POST /api/admin/projects error:", error);
    return NextResponse.json({ error: "Failed to create project." }, { status: 500 });
  }
}

// PUT update a project
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      slug,
      title,
      description,
      extendedDescription,
      tags,
      githubUrl,
      projectUrl,
      customFields,
      publishedAt,
      _originalSlug,
    } = body;

    const targetSlug = _originalSlug || slug;

    if (!targetSlug) {
      return NextResponse.json({ error: "Target slug is required for update." }, { status: 400 });
    }

    // Check if target exists
    const existing = await prisma.project.findUnique({
      where: { slug: targetSlug },
    });

    if (!existing) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    // Check if new slug is taken
    if (slug !== targetSlug) {
      const slugTaken = await prisma.project.findUnique({
        where: { slug },
      });
      if (slugTaken) {
        return NextResponse.json({ error: "New slug already exists." }, { status: 400 });
      }
    }

    const updateData: unknown = {
      slug,
      title,
      description,
      extendedDescription,
      tags,
      githubUrl,
      projectUrl,
      customFields: customFields || [],
      publishedAt,
    };

    const updated = await prisma.project.update({
      where: { slug: targetSlug },
      data: updateData as Parameters<typeof prisma.project.update>[0]["data"],
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/admin/projects error:", error);
    return NextResponse.json({ error: "Failed to update project." }, { status: 500 });
  }
}

// DELETE a project
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required for deletion." }, { status: 400 });
    }

    await prisma.project.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/projects error:", error);
    return NextResponse.json({ error: "Failed to delete project." }, { status: 500 });
  }
}
