import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";
import TeacherProfileEditor from "@/app/(middle-high)/teachers/profile/TeacherProfileEditor";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Add New Staff | Admin",
  description: "Add new staff profile",
};

export default async function AdminStaffNewPage() {
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
  // Only ADMIN can add new staff profiles
  if (role !== "ADMIN") {
    redirect("/admin");
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Add New Staff</h2>
        <p className="text-gray-600">Create a new staff profile.</p>
      </div>
      <TeacherProfileEditor 
        userRole={role} 
        isAdminEdit={true}
        initialType="STAFF"
      />
    </div>
  );
}


