"use client";

import { useState } from "react";

type UserRole = "STUDENT" | "PARENT" | "STAFF" | "TEACHER" | "VISITOR" | "ADMIN";

interface AdminUser {
  id: string;
  clerkUserId: string;
  name?: string | null;
  email?: string | null;
  role: UserRole;
  createdAt: string;
}

interface UserRoleManagerProps {
  initialUsers: AdminUser[];
}

const roleOptions: { value: UserRole; label: string }[] = [
  { value: "STUDENT", label: "Student" },
  { value: "PARENT", label: "Parent" },
  { value: "STAFF", label: "Staff" },
  { value: "TEACHER", label: "Teacher" },
  { value: "VISITOR", label: "Visitor" },
  { value: "ADMIN", label: "Admin" },
];

export default function UserRoleManager({ initialUsers }: UserRoleManagerProps) {
  const [users, setUsers] = useState(initialUsers);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, role: UserRole) => {
    setIsUpdating(userId);
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to update role." }));
        throw new Error(errorData.error || "Failed to update role.");
      }
      const updated = await response.json();
      setUsers((prev) => prev.map((user) => (user.id === updated.id ? updated : user)));
    } catch (error: any) {
      console.error(error);
      alert(error.message || "An error occurred while updating role.");
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900">User Role Management</h3>
          <p className="text-sm text-gray-600">
            The first administrator must set the `role` value to `ADMIN` directly in the database, then can grant permissions to other users from this screen.
          </p>
        </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Join Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{user.name || "No name"}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{user.email || "No email"}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                    disabled={isUpdating === user.id}
                    className="border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-navy"
                  >
                    {roleOptions.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString("en-US")}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-500">
                  No users registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

