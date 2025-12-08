import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import TeacherProfileEditor from "@/app/(middle-high)/teachers/profile/TeacherProfileEditor";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Edit Teacher Profile | Admin",
  description: "Edit teacher profile",
};

export default async function AdminTeacherEditPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await Promise.resolve(params);
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
  // Only ADMIN and STAFF can edit other teachers' profiles
  if (role !== "ADMIN" && role !== "STAFF") {
    redirect("/admin");
  }

  // Fetch teacher information
  const teacher = await prisma.teacher.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!teacher) {
    redirect("/admin/teachers");
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Edit Teacher Profile</h2>
        <p className="text-gray-600">Update teacher information and profile details.</p>
      </div>
      <TeacherProfileEditor 
        userRole={role} 
        teacherId={resolvedParams.id}
        isAdminEdit={true}
      />
    </div>
  );
}

