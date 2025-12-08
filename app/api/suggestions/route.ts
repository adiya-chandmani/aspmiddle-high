import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

// POST: 제안/건의사항 제출
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, title, content } = body;

    // 입력 검증
    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Please enter a title." },
        { status: 400 }
      );
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Please enter content." },
        { status: 400 }
      );
    }

    // 사용자 확인 (선택사항이지만 로그인한 경우 연결)
    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
      });
    }

    // 제안 생성
    const suggestion = await prisma.suggestion.create({
      data: {
        name: name?.trim() || null,
        title: title.trim(),
        content: content.trim(),
        authorId: user ? userId : null,
      },
    });

    return NextResponse.json(suggestion, { status: 201 });
  } catch (error: any) {
    console.error("Error creating suggestion:", error);
    return NextResponse.json(
      {
        error: error.message || "An error occurred while submitting the suggestion.",
      },
      { status: 500 }
    );
  }
}

// GET: 제안 목록 조회 (관리자만)
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    // 관리자 권한 확인
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    const suggestions = await prisma.suggestion.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            name: true,
            nickname: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(suggestions);
  } catch (error: any) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json(
      {
        error: error.message || "An error occurred while fetching suggestions.",
      },
      { status: 500 }
    );
  }
}

