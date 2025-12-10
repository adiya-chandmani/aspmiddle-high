import { prisma } from "@/lib/db";
import MiddleHighHeroLayout from "@/components/layouts/MiddleHighHeroLayout";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface ClubDetailPageProps {
  params: Promise<{ id: string }> | { id: string };
}

function extractFirstImage(content: string): string | null {
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return imgMatch ? imgMatch[1] : null;
}

export default async function ClubDetailPage({ params }: ClubDetailPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const club = await prisma.clubArticle.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!club || !club.isActive) {
    notFound();
  }

  const coverImage = club.coverImage || extractFirstImage(club.content);

  return (
    <MiddleHighHeroLayout active="club">
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-6">
          <Link
            href="/club"
            className="text-sm text-gray-600 hover:text-orange transition-colors"
          >
            ← Back to List
          </Link>
        </div>

        <div className="space-y-3 mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-orange font-semibold">
            {club.section}
          </p>
          <h1 className="text-4xl font-bold text-gray-900">{club.title}</h1>
          {club.summary && (
            <p className="text-lg text-gray-600">{club.summary}</p>
          )}
        </div>

        {coverImage && (
          <div className="relative w-full h-[280px] md:h-[360px] rounded-xl overflow-hidden border border-gray-200 mb-10">
            <Image
              src={coverImage}
              alt={club.title}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 60vw, 100vw"
              priority
              unoptimized
            />
          </div>
        )}

        <div
          className="prose max-w-none text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: club.content }}
        />
      </article>
    </MiddleHighHeroLayout>
  );
}

