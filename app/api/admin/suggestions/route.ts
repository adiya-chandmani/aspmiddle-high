import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getUserRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// DELETE: 모든 제안 기록 삭제 (ADMIN만 가능)
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
    if (role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only administrators can clear all suggestions." },
        { status: 403 }
      );
    }

    // 모든 제안 기록 삭제
    const result = await prisma.suggestion.deleteMany({});

    // 캐시 무효화
    revalidatePath("/admin/suggestions");

    return NextResponse.json(
      { 
        message: `Successfully cleared ${result.count} suggestion(s).`,
        count: result.count 
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (error: any) {
    console.error("Error clearing suggestions:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while clearing suggestions." },
      { status: 500 }
    );
  }
}

