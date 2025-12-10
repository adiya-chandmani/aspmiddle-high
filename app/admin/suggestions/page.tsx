import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import ClearSuggestionsButton from "@/components/admin/ClearSuggestionsButton";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Suggestions | Admin",
  description: "View and manage student suggestions",
};

export default async function AdminSuggestionsPage() {
  await requireAdmin();

  const suggestions = await prisma.suggestion.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          name: true,
          nickname: true,
          email: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Suggestions</h2>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage suggestions submitted by students.
          </p>
        </div>
        {suggestions.length > 0 && <ClearSuggestionsButton />}
      </div>

      {suggestions.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 text-center">No suggestions found.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {suggestions.map((suggestion) => (
                  <tr key={suggestion.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {suggestion.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs">
                      <div className="truncate" title={suggestion.title}>
                        {suggestion.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {suggestion.author
                        ? suggestion.author.nickname || suggestion.author.name || suggestion.author.email || "-"
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(suggestion.createdAt).toLocaleDateString("en-US")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/admin/suggestions/${suggestion.id}`}
                        className="text-orange hover:text-orange-700 dark:hover:text-orange-400 font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

