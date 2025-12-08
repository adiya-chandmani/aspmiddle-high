import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getUserRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET: 현재 선생님의 정보 조회
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const role = await getUserRole(userId);
    // TEACHER, STAFF, ADMIN 역할만 프로필 추가/수정 가능
    if (role !== "TEACHER" && role !== "STAFF" && role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only teachers can access this page." },
        { status: 403 }
      );
    }

    // 현재 사용자의 선생님 정보만 조회 (다른 사람의 프로필은 조회 불가)
    const teacher = await prisma.teacher.findUnique({
      where: { userId },
    });

    // 선생님 정보가 없으면 null 반환 (자동 생성하지 않음)
    if (!teacher) {
      return NextResponse.json(null);
    }

    return NextResponse.json(teacher);
  } catch (error) {
    console.error("Error fetching teacher info:", error);
      return NextResponse.json(
        { error: "An error occurred while loading teacher information." },
        { status: 500 }
      );
  }
}

// PUT: 현재 선생님의 정보 수정
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const role = await getUserRole(userId);
    // TEACHER, STAFF, ADMIN 역할만 프로필 추가/수정 가능
    if (role !== "TEACHER" && role !== "STAFF" && role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only teachers can update profiles." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, subject, email, bio, profileImage } = body;

    // 입력 검증
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    // 선생님 정보 업데이트 또는 생성 (where 조건이 userId이므로 자동으로 현재 사용자의 것만 처리됨)
    const teacher = await prisma.teacher.upsert({
      where: { userId },
      update: {
        name: name.trim(),
        subject: subject?.trim() || null,
        email: email?.trim() || null,
        bio: bio?.trim() || null,
        profileImage: profileImage?.trim() || null,
      },
      create: {
        userId,
        name: name.trim(),
        subject: subject?.trim() || null,
        email: email?.trim() || null,
        bio: bio?.trim() || null,
        profileImage: profileImage?.trim() || null,
      },
    });

    // 캐시 무효화하여 즉시 업데이트 반영
    revalidatePath("/teachers");
    revalidatePath("/admin/teachers");
    revalidatePath("/teachers/profile");

    return NextResponse.json(teacher, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error: any) {
    console.error("Error updating teacher info:", error);
      return NextResponse.json(
        { error: error.message || "An error occurred while updating teacher information." },
        { status: 500 }
      );
  }
}

// DELETE: 현재 선생님의 프로필 삭제 (TEACHER, ADMIN, STAFF 가능)
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const role = await getUserRole(userId);
    // TEACHER, ADMIN, STAFF만 프로필 삭제 가능
    if (role !== "TEACHER" && role !== "ADMIN" && role !== "STAFF") {
      return NextResponse.json(
        { error: "Only teachers can delete profiles." },
        { status: 403 }
      );
    }

    // 현재 사용자의 프로필 삭제 (isActive를 false로 설정 - soft delete)
    const teacher = await prisma.teacher.findUnique({
      where: { userId },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: "No profile found to delete." },
        { status: 404 }
      );
    }

    // Soft delete: isActive를 false로 설정
    await prisma.teacher.update({
      where: { userId },
      data: {
        isActive: false,
      },
    });

    // 캐시 무효화하여 즉시 업데이트 반영
    revalidatePath("/teachers");
    revalidatePath("/admin/teachers");
    revalidatePath("/teachers/profile");

    return NextResponse.json({ message: "Profile deleted successfully." }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error: any) {
    console.error("Error deleting teacher info:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while deleting profile." },
      { status: 500 }
    );
  }
}

