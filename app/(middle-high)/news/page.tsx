export const metadata = {
  title: "News | School Web Platform",
  description: "학교 소식 및 공지사항",
};

import { prisma } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import MiddleHighHeroLayout from "@/components/layouts/MiddleHighHeroLayout";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function getSnippet(summary?: string | null, content?: string) {
  if (summary && summary.trim().length > 0) {
    return summary;
  }
  if (!content) return "";
  const plain = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return plain.slice(0, 80) + (plain.length > 80 ? "…" : "");
}

function extractFirstImage(content: string): string | null {
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return imgMatch ? imgMatch[1] : null;
}

function formatRelativeTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) {
    const minutes = Math.max(1, Math.floor(diff / 60000));
    return `${minutes}분 전`;
  }
  if (hours < 24) {
    return `${hours}시간 전`;
  }
  return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}

export default async function NewsPage() {
  const newsItems = await prisma.newsArticle.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    include: {
      author: { select: { name: true, email: true } },
    },
  });

  return (
    <MiddleHighHeroLayout active="news">
      <div className="container mx-auto px-4 py-12">
        {newsItems.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <p className="text-lg text-muted">
              No news articles available. Please add content from the admin page.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newsItems.map((news) => {
              const publishedAt = new Date(news.publishedAt);
              const coverImage = news.coverImage || extractFirstImage(news.content);
              return (
                <Link
                  key={news.id}
                  href={`/news/${news.id}`}
                  className="surface-card group aspect-square transition-all hover:border-orange hover:shadow-md flex flex-col overflow-hidden"
                >
                  <div className="relative h-1/2 w-full bg-gray-100 border-b border-gray-200">
                    {coverImage ? (
                      <Image
                        src={coverImage}
                        alt={news.title}
                        fill
                        sizes="(min-width:1024px) 25vw, 50vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-subtle">
                        IMAGE
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-5 flex flex-col">
                    <div className="mb-2 flex items-center gap-2 text-xs text-subtle">
                      <span className="font-semibold text-orange uppercase tracking-widest">
                        {news.category || "NEWS"}
                      </span>
                      <span>·</span>
                      <span>{formatRelativeTime(publishedAt)}</span>
                    </div>
                    <h2 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">
                      {news.title}
                    </h2>
                    <p className="text-sm text-muted line-clamp-3 flex-1">{getSnippet(news.summary, news.content)}</p>
                    {news.author?.name && (
                      <p className="mt-4 text-xs uppercase tracking-[0.3em] text-gray-400">
                        {news.author.name}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </MiddleHighHeroLayout>
  );
}
