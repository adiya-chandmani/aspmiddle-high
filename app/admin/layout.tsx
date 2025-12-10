import { requireAdmin, getUserRole } from "@/lib/auth";
import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";

// Force dynamic rendering (admin pages use auth and database)
export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.log("[AdminLayout] No userId, redirecting to sign-in");
      redirect("/sign-in");
    }

    const role = await getUserRole(userId);
    console.log("[AdminLayout] User ID:", userId, "Role:", role);

    if (role !== "ADMIN") {
      console.log("[AdminLayout] Access denied - role is not ADMIN, redirecting to home");
      redirect("/");
    }

    // ADMIN verification complete (requireAdmin throws error, so not needed after check)
  } catch (error: any) {
    console.error("[AdminLayout] Access denied - error:", error?.message || error);
    redirect("/");
  }
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-navy dark:bg-gray-800 text-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-white/70 dark:text-gray-300">Admin Console</p>
            <h1 className="text-2xl font-bold">School Content Manager</h1>
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold">{user?.firstName}</p>
            <p className="text-white/70 dark:text-gray-300">{user?.emailAddresses[0]?.emailAddress}</p>
          </div>
        </div>
        <AdminNav />
      </header>
      <main className="container mx-auto px-4 py-8 max-w-6xl">{children}</main>
    </div>
  );
}

