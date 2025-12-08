import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const includeAll = request.nextUrl.searchParams.get("includeAll") === "true";
  const articles = await prisma.newsArticle.findMany({
    where: includeAll ? {} : { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });
  return NextResponse.json(articles);
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await requireAdmin();
    const { title, summary, content, category, coverImage, isPublished, publishedAt } =
      await request.json();

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Please enter a title." }, { status: 400 });
    }
    if (!content || content.replace(/<[^>]*>/g, "").trim().length === 0) {
      return NextResponse.json({ error: "Please enter content." }, { status: 400 });
    }

    const article = await prisma.newsArticle.create({
      data: {
        title: title.trim(),
        summary: summary?.trim() || null,
        content,
        category: category?.trim() || null,
        coverImage: coverImage?.trim() || null,
        isPublished: typeof isPublished === "boolean" ? isPublished : true,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        authorId: userId,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/news]", error);
    if (error.message?.includes("Forbidden") || error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }
    return NextResponse.json({ error: "An error occurred while saving news." }, { status: 500 });
  }
}

