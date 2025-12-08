import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Suggestion Detail | Admin",
  description: "View suggestion details",
};

export default async function AdminSuggestionDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  await requireAdmin();
  const resolvedParams = await Promise.resolve(params);

  const suggestion = await prisma.suggestion.findUnique({
    where: { id: resolvedParams.id },
    include: {
      author: {
        select: {
          name: true,
          nickname: true,
          email: true,
          clerkUserId: true,
        },
      },
    },
  });

  if (!suggestion) {
    redirect("/admin/suggestions");
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/suggestions"
          className="text-sm text-gray-600 hover:text-orange mb-4 inline-block"
        >
          ← Back to Suggestions
        </Link>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Suggestion Detail</h2>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-gray-900">{suggestion.name || "-"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <p className="mt-1 text-gray-900">{suggestion.title}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Content</label>
            <p className="mt-1 text-gray-900 whitespace-pre-wrap">{suggestion.content}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Author</label>
            <p className="mt-1 text-gray-900">
              {suggestion.author
                ? suggestion.author.nickname || suggestion.author.name || suggestion.author.email || "-"
                : "-"}
            </p>
            {suggestion.author && (
              <p className="mt-1 text-xs text-gray-500">
                Email: {suggestion.author.email || "-"}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Submitted Date</label>
            <p className="mt-1 text-gray-900">
              {new Date(suggestion.createdAt).toLocaleString("en-US")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

