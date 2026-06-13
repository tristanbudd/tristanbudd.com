import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET all blogs
export async function GET() {
  try {
    const blogs = await prisma.blogPost.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("GET /api/admin/blogs error:", error);
    return NextResponse.json({ error: "Failed to fetch blogs." }, { status: 500 });
  }
}

// POST create a blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, title, excerpt, content, publishedAt, category, readingTime, tags } = body;

    if (!slug || !title || !content) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Check if slug already exists
    const existing = await prisma.blogPost.findUnique({
      where: { slug },
    });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists." }, { status: 400 });
    }

    const blog = await prisma.blogPost.create({
      data: {
        slug,
        title,
        excerpt: excerpt || "",
        content,
        publishedAt: publishedAt || new Date().toISOString().split("T")[0],
        category: category || "Tech",
        readingTime: readingTime || "5 min read",
        tags: tags || [],
      },
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error("POST /api/admin/blogs error:", error);
    return NextResponse.json({ error: "Failed to create blog post." }, { status: 500 });
  }
}

// PUT update a blog post
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      slug,
      title,
      excerpt,
      content,
      publishedAt,
      category,
      readingTime,
      tags,
      _originalSlug,
    } = body;

    const targetSlug = _originalSlug || slug;

    if (!targetSlug) {
      return NextResponse.json({ error: "Target slug is required for update." }, { status: 400 });
    }

    // Check if target exists
    const existing = await prisma.blogPost.findUnique({
      where: { slug: targetSlug },
    });

    if (!existing) {
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }

    // Check if new slug is taken
    if (slug !== targetSlug) {
      const slugTaken = await prisma.blogPost.findUnique({
        where: { slug },
      });
      if (slugTaken) {
        return NextResponse.json({ error: "New slug already exists." }, { status: 400 });
      }
    }

    const updated = await prisma.blogPost.update({
      where: { slug: targetSlug },
      data: {
        slug,
        title,
        excerpt,
        content,
        publishedAt,
        category,
        readingTime,
        tags,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/admin/blogs error:", error);
    return NextResponse.json({ error: "Failed to update blog post." }, { status: 500 });
  }
}

// DELETE a blog post
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required for deletion." }, { status: 400 });
    }

    await prisma.blogPost.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/blogs error:", error);
    return NextResponse.json({ error: "Failed to delete blog post." }, { status: 500 });
  }
}
