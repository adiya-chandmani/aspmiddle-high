import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getCurrentUserRole } from "@/lib/auth";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const user = await currentUser();
    const role = await getCurrentUserRole();

    return NextResponse.json({
      userId,
      role,
      email: user?.emailAddresses[0]?.emailAddress,
      name: user?.firstName || user?.emailAddresses[0]?.emailAddress,
    });
  } catch (error: any) {
    console.error("Error fetching current user info:", error);
    return NextResponse.json(
      {
        error: error.message || "사용자 정보를 불러오는 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

