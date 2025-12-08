import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import MiddleHighHeroLayout from "@/components/layouts/MiddleHighHeroLayout";
import TeacherProfileEditor from "../TeacherProfileEditor";

export const metadata = {
  title: "Edit Teacher Profile | Teachers",
  description: "Edit teacher profile",
};

export default async function TeacherProfileEditPage({
  params,
}: {
  params: { id: string };
}) {
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
  // ADMIN, STAFF만 다른 선생님의 프로필 수정 가능
  if (role !== "ADMIN" && role !== "STAFF") {
    redirect("/teachers");
  }

  // 선생님 정보 조회
  const teacher = await prisma.teacher.findUnique({
    where: { id: params.id },
  });

  if (!teacher) {
    redirect("/teachers");
  }

  return (
    <MiddleHighHeroLayout active="teachers">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-navy mb-8">Edit Teacher Profile</h1>
          <TeacherProfileEditor 
            userRole={role} 
            teacherId={params.id}
            isAdminEdit={true}
          />
        </div>
      </div>
    </MiddleHighHeroLayout>
  );
}

