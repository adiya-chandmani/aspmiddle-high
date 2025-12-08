import NewsManager from "@/components/admin/NewsManager";
import { prisma } from "@/lib/db";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function AdminNewsPage() {
  const newsArticles = await prisma.newsArticle.findMany({
    orderBy: { publishedAt: "desc" },
  });

  const serialized = newsArticles.map((article) => ({
    ...article,
    publishedAt: article.publishedAt.toISOString(),
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">News Management</h2>
        <p className="text-gray-600">
          Write school news and announcements, and manage publication status. You can freely edit content using the Quill editor.
        </p>
      </div>
      <NewsManager initialArticles={serialized} />
    </div>
  );
}

