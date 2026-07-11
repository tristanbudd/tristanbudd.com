import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Helper to check admin session
function isAuthorized(request: NextRequest): boolean {
  const adminSession = request.cookies.get("admin_session")?.value;
  const ownerAccount = process.env.ADMIN_OWNER_ACCOUNT || "tristanbudd";
  return adminSession === ownerAccount;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { posts: projects, overwrite } = body; // Using posts field name to align with body structure

    if (!projects || !Array.isArray(projects)) {
      return NextResponse.json(
        { error: "Invalid payload: 'projects' must be an array." },
        { status: 400 }
      );
    }

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const project of projects) {
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
        featured,
        preview,
      } = project;

      if (!slug || !title || !description || !extendedDescription) {
        skipped++;
        continue;
      }

      // Check if slug already exists
      const existing = await prisma.project.findUnique({
        where: { slug },
      });

      const projectData: unknown = {
        title,
        description,
        extendedDescription,
        tags: tags || [],
        githubUrl: githubUrl || null,
        projectUrl: projectUrl || null,
        customFields: customFields || [],
        publishedAt: publishedAt || null,
        featured: !!featured,
        preview: preview !== undefined ? !!preview : false,
      };

      if (existing) {
        if (overwrite) {
          await prisma.project.update({
            where: { slug },
            data: projectData as Parameters<typeof prisma.project.update>[0]["data"],
          });
          updated++;
        } else {
          skipped++;
        }
      } else {
        await prisma.project.create({
          data: {
            slug,
            ...(projectData as Omit<Parameters<typeof prisma.project.create>[0]["data"], "slug">),
          },
        });
        created++;
      }
    }

    return NextResponse.json({
      success: true,
      created,
      updated,
      skipped,
    });
  } catch (error) {
    console.error("POST /api/admin/projects/import error:", error);
    return NextResponse.json({ error: "Failed to import projects." }, { status: 500 });
  }
}
