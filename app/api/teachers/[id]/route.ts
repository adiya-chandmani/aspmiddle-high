import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getUserRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// GET: 특정 선생님의 정보 조회 (ADMIN, STAFF만 가능)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const role = await getUserRole(userId);
    // ADMIN, STAFF만 다른 선생님의 프로필 조회 가능
    if (role !== "ADMIN" && role !== "STAFF") {
      return NextResponse.json(
        { error: "Only admins and staff can view other teachers' profiles." },
        { status: 403 }
      );
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id: params.id },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: "Teacher not found." },
        { status: 404 }
      );
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

// PUT: 특정 선생님의 정보 수정 (ADMIN, STAFF만 가능)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const role = await getUserRole(userId);
    // ADMIN, STAFF만 다른 선생님의 프로필 수정 가능
    if (role !== "ADMIN" && role !== "STAFF") {
      return NextResponse.json(
        { error: "Only admins and staff can update other teachers' profiles." },
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

    // 선생님 정보 업데이트
    const teacher = await prisma.teacher.update({
      where: { id: params.id },
      data: {
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
    revalidatePath(`/teachers/profile/${params.id}`);

    return NextResponse.json(teacher, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error: any) {
    console.error("Error updating teacher info:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Teacher not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || "An error occurred while updating teacher information." },
      { status: 500 }
    );
  }
}

// PATCH: 활성/비활성 토글 (ADMIN, STAFF만 가능)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const role = await getUserRole(userId);
    if (role !== "ADMIN" && role !== "STAFF") {
      return NextResponse.json(
        { error: "Only admins and staff can toggle teacher status." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { isActive } = body;

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "isActive must be a boolean value." },
        { status: 400 }
      );
    }

    const teacher = await prisma.teacher.update({
      where: { id: params.id },
      data: {
        isActive,
      },
    });

    // 캐시 무효화
    revalidatePath("/teachers");
    revalidatePath("/admin/teachers");
    revalidatePath(`/teachers/profile/${params.id}`);

    return NextResponse.json(teacher, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error: any) {
    console.error("Error toggling teacher status:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Teacher not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || "An error occurred while updating teacher status." },
      { status: 500 }
    );
  }
}

// DELETE: 특정 선생님의 프로필 완전 삭제 (ADMIN, STAFF만 가능)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const role = await getUserRole(userId);
    // ADMIN, STAFF만 다른 선생님의 프로필 삭제 가능
    if (role !== "ADMIN" && role !== "STAFF") {
      return NextResponse.json(
        { error: "Only admins and staff can delete other teachers' profiles." },
        { status: 403 }
      );
    }

    // 완전 삭제 (hard delete)
    await prisma.teacher.delete({
      where: { id: params.id },
    });

    // 캐시 무효화하여 즉시 업데이트 반영
    revalidatePath("/teachers");
    revalidatePath("/admin/teachers");
    revalidatePath(`/teachers/profile/${params.id}`);

    return NextResponse.json({ message: "Profile deleted successfully." }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error: any) {
    console.error("Error deleting teacher info:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Teacher not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || "An error occurred while deleting profile." },
      { status: 500 }
    );
  }
}

