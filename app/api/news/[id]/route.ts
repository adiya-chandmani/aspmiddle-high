import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const article = await prisma.newsArticle.findUnique({
    where: { id: params.id },
  });
  if (!article) {
    return NextResponse.json({ error: "News article not found." }, { status: 404 });
  }
  return NextResponse.json(article);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const { title, summary, content, category, coverImage, isPublished, publishedAt } =
      await request.json();

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Please enter a title." }, { status: 400 });
    }
    if (!content || content.replace(/<[^>]*>/g, "").trim().length === 0) {
      return NextResponse.json({ error: "Please enter content." }, { status: 400 });
    }

    const updated = await prisma.newsArticle.update({
      where: { id: params.id },
      data: {
        title: title.trim(),
        summary: summary?.trim() || null,
        content,
        category: category?.trim() || null,
        coverImage: coverImage?.trim() || null,
        isPublished: typeof isPublished === "boolean" ? isPublished : true,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("[PUT /api/news/:id]", error);
    if (error.message?.includes("Forbidden") || error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }
    return NextResponse.json({ error: "An error occurred while updating news." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    await prisma.newsArticle.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[DELETE /api/news/:id]", error);
    if (error.message?.includes("Forbidden") || error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }
    return NextResponse.json({ error: "An error occurred while deleting news." }, { status: 500 });
  }
}

