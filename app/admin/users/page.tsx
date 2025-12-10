import UserRoleManager from "@/components/admin/UserRoleManager";
import { prisma } from "@/lib/db";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serialized = users.map((user) => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">User Role Management</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Grant or revoke admin privileges to designate users who can manage content.
        </p>
      </div>
      <UserRoleManager initialUsers={serialized} />
    </div>
  );
}

