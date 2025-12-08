import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { getUserRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// GET: 모든 선생님 정보 조회 (공개)
export async function GET(request: NextRequest) {
  try {
    const teachers = await prisma.teacher.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return NextResponse.json(
      { error: "선생님 정보를 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// POST: 새로운 선생님 프로필 생성 (ADMIN, STAFF만 가능)
export async function POST(request: NextRequest) {
  try {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const role = await getUserRole(currentUserId);
    if (role !== "ADMIN" && role !== "STAFF") {
      return NextResponse.json(
        { error: "Only admins and staff can create teacher profiles." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, name, subject, email, bio, profileImage } = body;

    // 입력 검증
    if (!userId || !userId.trim()) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    // 사용자가 존재하는지 확인
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please ensure the user is registered in the system." },
        { status: 404 }
      );
    }

    // 이미 teacher 프로필이 있는지 확인 (활성화 여부와 관계없이)
    const existingTeacher = await prisma.teacher.findUnique({
      where: { userId },
    });

    if (existingTeacher) {
      // 이미 존재하는 경우 (활성화 여부와 관계없이) 에러 반환
      return NextResponse.json(
        { error: `Teacher profile already exists for this user. Please use a different user ID or edit the existing profile.` },
        { status: 409 }
      );
    }

    // 새로운 teacher 프로필 생성
    const teacher = await prisma.teacher.create({
      data: {
        userId,
        name: name.trim(),
        subject: subject?.trim() || null,
        email: email?.trim() || null,
        bio: bio?.trim() || null,
        profileImage: profileImage?.trim() || null,
      },
    });

    // 캐시 무효화
    revalidatePath("/teachers");
    revalidatePath("/admin/teachers");

    return NextResponse.json(teacher, { status: 201 });
  } catch (error: any) {
    console.error("Error creating teacher profile:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Teacher profile already exists for this user." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error.message || "An error occurred while creating teacher profile." },
      { status: 500 }
    );
  }
}

