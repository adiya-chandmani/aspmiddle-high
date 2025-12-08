import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

// POST: 좋아요 토글
export async function POST(
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

    // 게시물 확인
    const post = await prisma.post.findUnique({
      where: { id: params.id },
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

    // 기존 좋아요 확인
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: params.id,
          userId: userId,
        },
      },
    });

    if (existingLike) {
      // 좋아요 취소
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      // 게시물 좋아요 수 감소
      await prisma.post.update({
        where: { id: params.id },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      });

      return NextResponse.json({ liked: false });
    } else {
      // 좋아요 추가
      await prisma.like.create({
        data: {
          postId: params.id,
          userId: userId,
        },
      });

      // 게시물 좋아요 수 증가
      await prisma.post.update({
        where: { id: params.id },
        data: {
          likeCount: {
            increment: 1,
          },
        },
      });

      return NextResponse.json({ liked: true });
    }
  } catch (error: any) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      {
        error: error.message || "좋아요 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

// GET: 좋아요 상태 확인
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ liked: false });
    }

    const like = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: params.id,
          userId: userId,
        },
      },
    });

    return NextResponse.json({ liked: !!like });
  } catch (error) {
    console.error("Error checking like status:", error);
    return NextResponse.json({ liked: false });
  }
}

