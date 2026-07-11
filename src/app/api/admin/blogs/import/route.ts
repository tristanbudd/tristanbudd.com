import { BLOG_CATEGORIES } from "@/data/blog";
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
    const { posts, overwrite } = body;

    if (!posts || !Array.isArray(posts)) {
      return NextResponse.json(
        { error: "Invalid payload: 'posts' must be an array." },
        { status: 400 }
      );
    }

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const post of posts) {
      const { slug, title, excerpt, content, publishedAt, category, readingTime, tags, preview } =
        post;

      if (!slug || !title || !content) {
        skipped++;
        continue;
      }

      // Check if slug already exists
      const existing = await prisma.blogPost.findUnique({
        where: { slug },
      });

      if (existing) {
        if (overwrite) {
          await prisma.blogPost.update({
            where: { slug },
            data: {
              title,
              excerpt: excerpt || "",
              content,
              publishedAt: publishedAt || new Date().toISOString().split("T")[0],
              category: category || BLOG_CATEGORIES[0],
              readingTime: readingTime || "5 min read",
              tags: tags || [],
              preview: preview !== undefined ? !!preview : false,
            },
          });
          updated++;
        } else {
          skipped++;
        }
      } else {
        await prisma.blogPost.create({
          data: {
            slug,
            title,
            excerpt: excerpt || "",
            content,
            publishedAt: publishedAt || new Date().toISOString().split("T")[0],
            category: category || BLOG_CATEGORIES[0],
            readingTime: readingTime || "5 min read",
            tags: tags || [],
            preview: preview !== undefined ? !!preview : false,
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
    console.error("POST /api/admin/blogs/import error:", error);
    return NextResponse.json({ error: "Failed to import blog posts." }, { status: 500 });
  }
}
