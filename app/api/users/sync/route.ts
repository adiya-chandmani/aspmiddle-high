import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// POST: 현재 로그인한 사용자를 데이터베이스에 동기화
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    // Clerk에서 사용자 정보 가져오기
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json(
        { error: "사용자 정보를 가져올 수 없습니다." },
        { status: 401 }
      );
    }

    // 이메일 도메인 확인하여 역할 결정
    const emailAddresses = clerkUser.emailAddresses || [];
    const email = emailAddresses[0]?.emailAddress || null;
    const name = clerkUser.firstName && clerkUser.lastName
      ? `${clerkUser.firstName} ${clerkUser.lastName}`
      : clerkUser.firstName || clerkUser.lastName || null;

    const schoolEmailDomains = process.env.SCHOOL_EMAIL_DOMAINS?.split(",").map(d => d.trim()) || [];
    
    // 학교 이메일 도메인을 가진 사용자는 STUDENT 역할 부여
    let defaultRole: "STUDENT" | "VISITOR" = "VISITOR";
    if (email) {
      const domain = email.split("@")[1];
      if (schoolEmailDomains.includes(domain)) {
        defaultRole = "STUDENT";
      }
    }

    // 사용자 생성 또는 업데이트
    const user = await prisma.user.upsert({
      where: { clerkUserId: userId },
      update: {
        email: email || null,
        name: name || null,
        // 업데이트 시에는 역할을 변경하지 않음 (이미 설정된 역할 유지)
      },
      create: {
        clerkUserId: userId,
        email: email || null,
        name: name || null,
        role: defaultRole, // 학교 이메일이면 STUDENT, 아니면 VISITOR
      },
    });

    return NextResponse.json({
      success: true,
      message: "사용자가 데이터베이스에 동기화되었습니다.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      {
        error: error.message || "사용자 동기화 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

