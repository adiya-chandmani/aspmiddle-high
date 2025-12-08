"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface ClubArticle {
  id: string;
  title: string;
  summary?: string | null;
  content: string;
  section: string;
  coverImage?: string | null;
}

interface ClubTabsCubeProps {
  sections: [string, ClubArticle[]][];
}

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

export default function ClubTabsCube({ sections }: ClubTabsCubeProps) {
  const [activeSection, setActiveSection] = useState("All");
  const [showAllSections, setShowAllSections] = useState(false);
  
  // 모든 클럽을 하나의 배열로 합치기
  const allClubs = sections.flatMap(([, clubs]) => clubs);
  
  // 현재 선택된 섹션의 클럽 가져오기
  const currentClubs = activeSection === "All" 
    ? allClubs 
    : sections.find(([section]) => section === activeSection)?.[1] ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 border-b border-gray-200 mb-8 pb-4">
        <button
          onClick={() => setActiveSection("All")}
          className={`pb-2 text-sm font-medium tracking-wide border-b-2 transition-colors ${
            activeSection === "All"
              ? "text-navy border-orange"
              : "text-gray-500 border-transparent hover:text-orange hover:border-orange"
          }`}
        >
          All
        </button>
        {showAllSections && sections.map(([section]) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`pb-2 text-sm font-medium tracking-wide border-b-2 transition-colors ${
              activeSection === section
                ? "text-navy border-orange"
                : "text-gray-500 border-transparent hover:text-orange hover:border-orange"
            }`}
          >
            {section}
          </button>
        ))}
        {!showAllSections && (
          <button
            onClick={() => setShowAllSections(true)}
            className="pb-2 text-sm font-medium text-gray-500 hover:text-orange transition-colors border-b-2 border-transparent hover:border-orange"
          >
            More
          </button>
        )}
        {showAllSections && (
          <button
            onClick={() => {
              setShowAllSections(false);
              setActiveSection("All");
            }}
            className="pb-2 text-sm font-medium text-gray-500 hover:text-orange transition-colors border-b-2 border-transparent hover:border-orange"
          >
            Less
          </button>
        )}
      </div>

      {currentClubs.length === 0 ? (
        <div className="bg-gray-50 p-12 rounded-lg text-center border border-dashed border-gray-300">
          <p className="text-gray-600">No content available for the selected section.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {currentClubs.map((club) => {
            const coverImage = club.coverImage || extractFirstImage(club.content);
            return (
              <Link
                key={club.id}
                href={`/club/${club.id}`}
                className="group aspect-square rounded-3xl border border-gray-200 bg-white shadow-sm hover:shadow-lg hover:border-orange transition-all flex flex-col overflow-hidden"
              >
                <div className="relative h-1/2 w-full bg-gray-100 border-b border-gray-200">
                  {coverImage ? (
                    <Image
                      src={coverImage}
                      alt={club.title}
                      fill
                      sizes="(min-width:1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                      IMAGE
                    </div>
                  )}
                </div>
                <div className="flex-1 p-5 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <span className="font-semibold text-orange uppercase tracking-widest">
                      {club.section}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
                    {club.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-3 flex-1">{getSnippet(club.summary, club.content)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

