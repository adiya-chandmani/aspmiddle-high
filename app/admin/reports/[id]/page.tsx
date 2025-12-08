import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ReportDetail from "@/components/admin/ReportDetail";

export const metadata = {
  title: "Report Detail | Admin",
  description: "Report details and actions",
};

export default async function AdminReportDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const report = await prisma.report.findUnique({
    where: { id: params.id },
    include: {
      reporter: {
        select: {
          name: true,
          nickname: true,
          email: true,
          clerkUserId: true,
        },
      },
      post: {
        include: {
          author: {
            select: {
              clerkUserId: true,
              name: true,
              nickname: true,
              email: true,
              role: true,
            },
          },
        },
      },
      comment: {
        include: {
          author: {
            select: {
              clerkUserId: true,
              name: true,
              nickname: true,
              email: true,
              role: true,
            },
          },
          post: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
      adminActions: {
        orderBy: { createdAt: "desc" },
        include: {
          admin: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!report) {
    redirect("/admin/reports");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Report Detail</h2>
        <p className="text-gray-600">
          Review report content and take action.
        </p>
      </div>

      <ReportDetail report={report} />
    </div>
  );
}

