import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET: 댓글 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const comments = await prisma.comment.findMany({
      where: {
        postId: resolvedParams.id,
        isDeleted: false,
        isHidden: false,
      },
      include: {
        author: {
          select: {
            clerkUserId: true,
            nickname: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const commentsWithVisibility = comments.map((comment) => {
      const displayName =
        comment.visibilityName === "anonymous"
          ? "익명"
          : comment.author.nickname || comment.author.name || "익명";

      return {
        ...comment,
        author: {
          clerkUserId: comment.author.clerkUserId,
          displayName,
        },
      };
    });

    return NextResponse.json(commentsWithVisibility);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "댓글을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// POST: 댓글 작성
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content, visibilityName } = body;

    // 입력 검증
    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "댓글 내용을 입력해주세요." },
        { status: 400 }
      );
    }

    // 게시물 확인
    const post = await prisma.post.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!post || post.isDeleted || post.isHidden) {
      return NextResponse.json(
        { error: "게시물을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 사용자 확인 및 생성
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      const clerkUser = await currentUser();
      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          email: clerkUser?.emailAddresses[0]?.emailAddress || null,
          name: clerkUser?.firstName || null,
          nickname: clerkUser?.firstName || null,
        },
      });
    }

    // 댓글 작성
    const comment = await prisma.comment.create({
      data: {
        postId: resolvedParams.id,
        authorId: userId,
        content: content.trim(),
        visibilityName: visibilityName || "nickname",
      },
      include: {
        author: {
          select: {
            clerkUserId: true,
            nickname: true,
            name: true,
          },
        },
      },
    });

    // 게시물 댓글 수 업데이트
    await prisma.post.update({
      where: { id: resolvedParams.id },
      data: {
        commentCount: {
          increment: 1,
        },
      },
    });

    const displayName =
      comment.visibilityName === "anonymous"
        ? "익명"
        : comment.author.nickname || comment.author.name || "익명";

    return NextResponse.json(
      {
        ...comment,
        author: {
          clerkUserId: comment.author.clerkUserId,
          displayName,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      {
        error: error.message || "댓글 작성 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

