import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";
import MiddleHighHeroLayout from "@/components/layouts/MiddleHighHeroLayout";
import TeacherProfileEditor from "./TeacherProfileEditor";

export const metadata = {
  title: "프로필 수정 | Teachers",
  description: "선생님 프로필 수정",
};

export default async function TeacherProfilePage() {
  // 모든 로그인 사용자 접근 가능
  try {
    await requireAuth();
  } catch (error) {
    redirect("/sign-in");
  }

  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const role = await getUserRole(userId);
  // TEACHER, STAFF, ADMIN 역할만 프로필 추가/수정 가능
  if (role !== "TEACHER" && role !== "STAFF" && role !== "ADMIN") {
    redirect("/teachers");
  }

  return (
    <MiddleHighHeroLayout active="teachers">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-navy mb-8">프로필 수정</h1>
          <TeacherProfileEditor userRole={role} />
        </div>
      </div>
    </MiddleHighHeroLayout>
  );
}

