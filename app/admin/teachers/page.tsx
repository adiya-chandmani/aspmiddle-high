import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import TeacherDeleteButton from "@/components/admin/TeacherDeleteButton";
import TeacherStatusToggle from "@/components/admin/TeacherStatusToggle";

// Force dynamic rendering (prevent caching)
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminTeachersPage() {
  // Fetch all teachers (including deleted ones)
  const teachers = await prisma.teacher.findMany({
    orderBy: [
      { isActive: "desc" }, // Active ones first
      { name: "asc" },
    ],
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Teachers Management</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage teacher profiles. Add, edit, or delete teacher information.
          </p>
        </div>
        <Link
          href="/admin/teachers/new"
          className="px-5 py-2.5 bg-orange text-white rounded-md hover:bg-orange-700 transition-colors font-medium text-sm shadow-sm hover:shadow"
        >
          Add New Teacher
        </Link>
      </div>

      {/* Teachers List */}
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
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {teacher.profileImage ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                        <Image
                          src={teacher.profileImage}
                          alt={teacher.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-white">
                          {teacher.name[0]?.toUpperCase() || "T"}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{teacher.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{teacher.subject || "-"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{teacher.email || "-"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <TeacherStatusToggle 
                      teacherId={teacher.id}
                      isActive={teacher.isActive}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/teachers/${teacher.id}`}
                        className="text-orange hover:text-orange-700 dark:hover:text-orange-400"
                      >
                        Edit
                      </Link>
                      <TeacherDeleteButton teacherId={teacher.id} teacherName={teacher.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {teachers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No teachers registered yet.</p>
            <Link
              href="/admin/teachers/new"
              className="inline-block px-4 py-2 bg-orange text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              Add First Teacher
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

