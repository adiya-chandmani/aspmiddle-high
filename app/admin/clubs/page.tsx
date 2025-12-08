import ClubManager from "@/components/admin/ClubManager";
import { prisma } from "@/lib/db";

export default async function AdminClubsPage() {
  const clubArticles = await prisma.clubArticle.findMany({
    orderBy: [{ section: "asc" }, { order: "asc" }, { createdAt: "desc" }],
  });

  const serialized = clubArticles.map((article) => ({
    ...article,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Club Section Management</h2>
        <p className="text-gray-600">
          Create sections displayed in the top tabs and enter content for each section. Each section appears as a tab on the club page.
        </p>
      </div>
      <ClubManager initialArticles={serialized} />
    </div>
  );
}

