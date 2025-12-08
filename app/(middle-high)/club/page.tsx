export const metadata = {
  title: "Club | School Web Platform",
  description: "동아리 정보",
};

import { prisma } from "@/lib/db";
import MiddleHighHeroLayout from "@/components/layouts/MiddleHighHeroLayout";
import ClubTabsCube from "@/components/club/ClubTabsCube";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function ClubPage() {
  const clubs = await prisma.clubArticle.findMany({
    where: { isActive: true },
    orderBy: [{ section: "asc" }, { order: "asc" }, { createdAt: "desc" }],
  });

  // 섹션별로 그룹화
  const sectionsMap = new Map<string, typeof clubs>();
  clubs.forEach((club) => {
    if (!sectionsMap.has(club.section)) {
      sectionsMap.set(club.section, []);
    }
    sectionsMap.get(club.section)!.push(club);
  });
  const sections = Array.from(sectionsMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <MiddleHighHeroLayout active="club">
      <div className="container mx-auto px-4 py-12">
        {clubs.length === 0 ? (
          <div className="bg-gray-50 p-12 rounded-lg text-center border border-dashed border-gray-300">
            <p className="text-lg text-gray-600">
              No club articles available. Please add content from the admin page.
            </p>
          </div>
        ) : (
          <ClubTabsCube sections={sections} />
        )}
      </div>
    </MiddleHighHeroLayout>
  );
}

