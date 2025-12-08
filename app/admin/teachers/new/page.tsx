import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";
import TeacherProfileEditor from "@/app/(middle-high)/teachers/profile/TeacherProfileEditor";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Add New Teacher | Admin",
  description: "Add new teacher profile",
};

export default async function AdminTeacherNewPage() {
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
  // Only ADMIN and STAFF can add new teacher profiles
  if (role !== "ADMIN" && role !== "STAFF") {
    redirect("/admin");
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Add New Teacher</h2>
        <p className="text-gray-600">Create a new teacher profile.</p>
      </div>
      <TeacherProfileEditor 
        userRole={role} 
        isAdminEdit={true}
      />
    </div>
  );
}

