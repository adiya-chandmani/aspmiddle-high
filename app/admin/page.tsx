import { prisma } from "@/lib/db";
import Link from "next/link";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [
    newsCount,
    clubCount,
    userCount,
    pendingReportsCount,
    recentPosts,
    recentReports,
  ] = await Promise.all([
    prisma.newsArticle.count({ where: { isPublished: true } }),
    prisma.clubArticle.count({ where: { isActive: true } }),
    prisma.user.count(),
    prisma.report.count({ where: { status: "PENDING" } }),
    prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      where: { isDeleted: false },
      include: {
        author: {
          select: {
            name: true,
            nickname: true,
          },
        },
      },
    }),
    prisma.report.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      where: { status: "PENDING" },
      include: {
        post: {
          select: {
            title: true,
          },
        },
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">
          Manage and monitor the entire system.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-2">News Articles</p>
          <p className="text-3xl font-bold text-navy">{newsCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-2">Club Sections</p>
          <p className="text-3xl font-bold text-navy">{clubCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-2">Registered Users</p>
          <p className="text-3xl font-bold text-navy">{userCount}</p>
        </div>
        <Link
          href="/admin/reports"
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <p className="text-sm text-gray-500 mb-2">Pending Reports</p>
          <p className="text-3xl font-bold text-red-600">{pendingReportsCount}</p>
          {pendingReportsCount > 0 && (
            <p className="text-xs text-red-600 mt-2">Action Required</p>
          )}
        </Link>
      </div>

      {/* Recent Posts */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Posts</h3>
          <Link
            href="/community/student"
            className="text-sm text-orange hover:text-orange-700"
          >
            View All →
          </Link>
        </div>
        {recentPosts.length > 0 ? (
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
              >
                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                  {post.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {post.author.nickname || post.author.name || "Anonymous"} ·{" "}
                  {new Date(post.createdAt).toLocaleDateString("en-US")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No recent posts.</p>
        )}
      </div>

      {/* Recent Reports */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
          <Link
            href="/admin/reports"
            className="text-sm text-orange hover:text-orange-700"
          >
            View All →
          </Link>
        </div>
        {recentReports.length > 0 ? (
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
              >
                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                  {report.post?.title || "Comment Report"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {report.reason.substring(0, 50)}... ·{" "}
                  {new Date(report.createdAt).toLocaleDateString("en-US")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No recent reports.</p>
        )}
      </div>
    </div>
  );
}

