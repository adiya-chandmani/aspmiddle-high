import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import TeacherDeleteButton from "@/components/admin/TeacherDeleteButton";
import TeacherStatusToggle from "@/components/admin/TeacherStatusToggle";

// Force dynamic rendering (prevent caching)
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface AdminTeachersPageProps {
  searchParams?: {
    tab?: string;
  };
}

export default async function AdminTeachersPage({ searchParams }: AdminTeachersPageProps) {
  const activeTab = searchParams?.tab === "staff" ? "staff" : "teachers";

  const [teachers, staff] = await Promise.all([
    prisma.teacher.findMany({
      where: {
        type: "TEACHER",
      },
      orderBy: [
        { isActive: "desc" }, // Active ones first
        { name: "asc" },
      ],
    }),
    prisma.teacher.findMany({
      where: {
        type: "STAFF",
      },
      orderBy: [
        { isActive: "desc" },
        { name: "asc" },
      ],
    }),
  ]);

  const isStaffTab = activeTab === "staff";
  const list = isStaffTab ? staff : teachers;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isStaffTab ? "Staff Management" : "Teachers Management"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {isStaffTab
              ? "Manage staff profiles. Add, edit, or delete staff information."
              : "Manage teacher profiles. Add, edit, or delete teacher information."}
          </p>
        </div>
        <Link
          href={isStaffTab ? "/admin/staff/new" : "/admin/teachers/new"}
          className="px-5 py-2.5 bg-orange text-white rounded-md hover:bg-orange-700 transition-colors font-medium text-sm shadow-sm hover:shadow"
        >
          {isStaffTab ? "Add New Staff" : "Add New Teacher"}
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <Link
          href="/admin/teachers?tab=teachers"
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            !isStaffTab
              ? "border-orange text-orange"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          Teachers
        </Link>
        <Link
          href="/admin/teachers?tab=staff"
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            isStaffTab
              ? "border-orange text-orange"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          Staff
        </Link>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Profile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {list.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {member.profileImage ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                        <Image
                          src={member.profileImage}
                          alt={member.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-white">
                          {member.name[0]?.toUpperCase() || "T"}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{member.subject || "-"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{member.email || "-"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <TeacherStatusToggle 
                      teacherId={member.id}
                      isActive={member.isActive}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/teachers/${member.id}`}
                        className="text-orange hover:text-orange-700 dark:hover:text-orange-400"
                      >
                        Edit
                      </Link>
                      <TeacherDeleteButton teacherId={member.id} teacherName={member.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {list.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {isStaffTab ? "No staff registered yet." : "No teachers registered yet."}
            </p>
            <Link
              href={isStaffTab ? "/admin/staff/new" : "/admin/teachers/new"}
              className="inline-block px-4 py-2 bg-orange text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              {isStaffTab ? "Add First Staff" : "Add First Teacher"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

