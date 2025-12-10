import { prisma } from "@/lib/db";
import Link from "next/link";
import ClearReportsButton from "@/components/admin/ClearReportsButton";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Report Management | Admin",
  description: "Manage reported posts and comments",
};

export default async function AdminReportsPage() {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      reporter: {
        select: {
          name: true,
          nickname: true,
          email: true,
        },
      },
      post: {
        select: {
          id: true,
          title: true,
          author: {
            select: {
              clerkUserId: true,
              name: true,
              nickname: true,
              role: true,
            },
          },
        },
      },
      comment: {
        select: {
          id: true,
          content: true,
          author: {
            select: {
              clerkUserId: true,
              name: true,
              nickname: true,
              role: true,
            },
          },
        },
      },
      adminActions: {
        take: 1,
        orderBy: { createdAt: "desc" },
        include: {
          admin: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200";
      case "REVIEWED":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200";
      case "RESOLVED":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200";
      case "DISMISSED":
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "REVIEWED":
        return "Under Review";
      case "RESOLVED":
        return "Resolved";
      case "DISMISSED":
        return "Dismissed";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Report Management</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Review and take action on reported posts and comments.
          </p>
        </div>
        {reports.length > 0 && <ClearReportsButton />}
      </div>

      {reports.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 text-center">No reports found.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Author Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
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
                {reports.map((report) => {
                  const target = report.post || report.comment;
                  const author = report.post?.author || report.comment?.author;

                  return (
                    <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {report.post ? "Post" : "Comment"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        <Link
                          href={`/admin/reports/${report.id}`}
                          className="text-orange hover:text-orange-700 dark:hover:text-orange-400 font-medium"
                        >
                          {report.post
                            ? report.post.title
                            : report.comment
                              ? report.comment.content.substring(0, 50) + "..."
                              : "No content"}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {author ? (
                          <div>
                            <div className="font-medium">
                              {author.nickname || author.name || "Anonymous"}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {author.clerkUserId}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Role: {author.role}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">No info</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs">
                        <div className="truncate" title={report.reason}>
                          {report.reason.substring(0, 50)}
                          {report.reason.length > 50 ? "..." : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {report.reportCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {getStatusLabel(report.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(report.createdAt).toLocaleDateString("en-US")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/admin/reports/${report.id}`}
                          className="text-orange hover:text-orange-700 dark:hover:text-orange-400 font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

