import { prisma } from "@/lib/db";
import MiddleHighHeroLayout from "@/components/layouts/MiddleHighHeroLayout";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface NewsDetailPageProps {
  params: Promise<{ id: string }> | { id: string };
}

function formatFullDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const article = await prisma.newsArticle.findUnique({
    where: { id: resolvedParams.id },
    include: {
      author: { select: { name: true } },
    },
  });

  if (!article || !article.isPublished) {
    notFound();
  }

  return (
    <MiddleHighHeroLayout active="news">
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-6">
          <Link
            href="/news"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange transition-colors"
          >
            ← Back to List
          </Link>
        </div>

        <div className="space-y-3 mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-orange font-semibold">
            {article.category || "NEWS"}
          </p>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{article.title}</h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {article.author?.name || "School Office"} · {formatFullDate(article.publishedAt)}
          </div>
        </div>

        {article.coverImage && (
          <div className="relative w-full h-[280px] md:h-[360px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-10">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 60vw, 100vw"
              priority
              unoptimized
            />
          </div>
        )}

        <div
          className="prose max-w-none text-gray-800 dark:text-gray-200 leading-relaxed prose-headings:dark:text-white prose-p:dark:text-gray-200 prose-strong:dark:text-white"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </MiddleHighHeroLayout>
  );
}


