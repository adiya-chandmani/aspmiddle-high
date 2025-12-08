import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

// POST: 신고 제출
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { postId, commentId, reason } = body;

    // 입력 검증
    if (!reason || !reason.trim()) {
      return NextResponse.json(
        { error: "신고 사유를 입력해주세요." },
        { status: 400 }
      );
    }

    if (!postId && !commentId) {
      return NextResponse.json(
        { error: "게시물 또는 댓글 ID가 필요합니다." },
        { status: 400 }
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

    // 중복 신고 확인 (같은 사용자가 같은 게시물/댓글을 이미 신고했는지)
    const existingReport = await prisma.report.findFirst({
      where: {
        reporterId: userId,
        postId: postId || null,
        commentId: commentId || null,
        status: "PENDING",
      },
    });

    if (existingReport) {
      // 기존 신고가 있으면 reportCount 증가
      const updatedReport = await prisma.report.update({
        where: { id: existingReport.id },
        data: {
          reportCount: {
            increment: 1,
          },
          reason: reason.trim(), // 최신 신고 사유로 업데이트
        },
      });

      return NextResponse.json(updatedReport, { status: 200 });
    }

    // 새 신고 생성
    const report = await prisma.report.create({
      data: {
        reporterId: userId,
        postId: postId || null,
        commentId: commentId || null,
        reason: reason.trim(),
        status: "PENDING",
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error: any) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      {
        error: error.message || "신고 제출 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

