import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getCurrentUserRole } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        authorId: true,
        postId: true,
        isDeleted: true,
      },
    });

    if (!comment || comment.isDeleted) {
      return NextResponse.json(
        { error: "댓글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const role = await getCurrentUserRole();

    if (comment.authorId !== userId && role !== "ADMIN") {
      return NextResponse.json(
        { error: "삭제 권한이 없습니다." },
        { status: 403 }
      );
    }

    await prisma.comment.update({
      where: { id: params.id },
      data: {
        isDeleted: true,
      },
    });

    await prisma.post.update({
      where: { id: comment.postId },
      data: {
        commentCount: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      {
        error: error.message || "댓글 삭제 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

