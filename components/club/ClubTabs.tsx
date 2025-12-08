"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

interface ClubArticle {
  id: string;
  title: string;
  summary?: string | null;
  content: string;
  section: string;
  coverImage?: string | null;
  order: number;
}

interface ClubTabsProps {
  articles: ClubArticle[];
}

export default function ClubTabs({ articles }: ClubTabsProps) {
  const sections = useMemo(() => {
    const map = new Map<string, ClubArticle[]>();
    articles.forEach((article) => {
      if (!map.has(article.section)) {
        map.set(article.section, []);
      }
      map.get(article.section)!.push(article);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [articles]);

  const [activeSection, setActiveSection] = useState(sections[0]?.[0] ?? "");

  const currentArticles = sections.find(([section]) => section === activeSection)?.[1] ?? [];

  if (sections.length === 0) {
    return (
      <div className="bg-gray-50 p-12 rounded-lg border border-dashed border-gray-300 text-center text-gray-600">
        클럽 섹션 콘텐츠가 없습니다. 관리자 페이지에서 섹션을 추가해주세요.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-4 border-b border-gray-200 mb-6">
        {sections.map(([section]) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`pb-3 text-sm font-medium tracking-wide border-b-2 transition-colors ${
              activeSection === section
                ? "text-navy border-orange"
                : "text-gray-500 border-transparent hover:text-orange"
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {currentArticles.map((article) => (
          <article
            key={article.id}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-orange mb-2">
                  {article.section}
                </p>
                <h3 className="text-2xl font-semibold text-gray-900">{article.title}</h3>
              </div>
              {article.coverImage && (
                <div className="relative w-32 h-32">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    sizes="128px"
                    className="object-cover rounded-md border border-gray-200"
                    unoptimized
                  />
                </div>
              )}
            </div>
            {article.summary && <p className="text-gray-600 mb-4">{article.summary}</p>}
            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>
        ))}

        {currentArticles.length === 0 && (
          <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500 border border-dashed border-gray-300">
            선택한 섹션에 표시할 콘텐츠가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

