import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const article = await prisma.clubArticle.findUnique({
    where: { id: resolvedParams.id },
  });
  if (!article) {
    return NextResponse.json({ error: "Content not found." }, { status: 404 });
  }
  return NextResponse.json(article);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await requireAdmin();
    const resolvedParams = await Promise.resolve(params);
    const { title, summary, content, section, coverImage, order, isActive } = await request.json();

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Please enter a title." }, { status: 400 });
    }
    if (!content || content.replace(/<[^>]*>/g, "").trim().length === 0) {
      return NextResponse.json({ error: "Please enter content." }, { status: 400 });
    }

    const updated = await prisma.clubArticle.update({
      where: { id: resolvedParams.id },
      data: {
        title: title.trim(),
        summary: summary?.trim() || null,
        content,
        section: section?.trim() || "General",
        coverImage: coverImage?.trim() || null,
        order: Number(order) || 0,
        isActive: typeof isActive === "boolean" ? isActive : true,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("[PUT /api/clubs/:id]", error);
    if (error.message?.includes("Forbidden") || error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }
    return NextResponse.json({ error: "An error occurred while updating content." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await requireAdmin();
    const resolvedParams = await Promise.resolve(params);
    await prisma.clubArticle.delete({
      where: { id: resolvedParams.id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[DELETE /api/clubs/:id]", error);
    if (error.message?.includes("Forbidden") || error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }
    return NextResponse.json({ error: "An error occurred while deleting content." }, { status: 500 });
  }
}

