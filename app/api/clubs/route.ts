import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const includeAll = request.nextUrl.searchParams.get("includeAll") === "true";
  const articles = await prisma.clubArticle.findMany({
    where: includeAll ? {} : { isActive: true },
    orderBy: [{ section: "asc" }, { order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(articles);
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await requireAdmin();
    const { title, summary, content, section, coverImage, order, isActive } = await request.json();

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Please enter a title." }, { status: 400 });
    }
    if (!content || content.replace(/<[^>]*>/g, "").trim().length === 0) {
      return NextResponse.json({ error: "Please enter content." }, { status: 400 });
    }

    const article = await prisma.clubArticle.create({
      data: {
        title: title.trim(),
        summary: summary?.trim() || null,
        content,
        section: section?.trim() || "General",
        coverImage: coverImage?.trim() || null,
        order: Number(order) || 0,
        isActive: typeof isActive === "boolean" ? isActive : true,
        authorId: userId,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/clubs]", error);
    if (error.message?.includes("Forbidden") || error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }
    return NextResponse.json({ error: "An error occurred while saving club content." }, { status: 500 });
  }
}

