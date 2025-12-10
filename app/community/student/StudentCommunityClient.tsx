"use client";

import { useState } from "react";
import PostList from "@/components/community/PostList";
import Link from "next/link";

export default function StudentCommunityClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [isHot, setIsHot] = useState(false);

  const handleCategoryClick = (category: string) => {
    if (category === "hot") {
      setIsHot(true);
      setActiveCategory("all");
    } else {
      setIsHot(false);
      setActiveCategory(category);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* 페이지 헤더 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-5">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Board</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              A space to share free discussions, consultations, and study information.
            </p>
          </div>
          <Link
            href="/community/student/write"
            className="px-5 py-2.5 bg-orange text-white rounded-md hover:bg-orange-700 transition-colors font-medium text-sm shadow-sm hover:shadow"
          >
            Write Post
          </Link>
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6">
        <div className="flex space-x-1">
          <button
            onClick={() => handleCategoryClick("all")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeCategory === "all" && !isHot
                ? "text-navy dark:text-orange border-orange bg-white dark:bg-gray-800"
                : "text-gray-600 dark:text-gray-400 border-transparent hover:text-orange hover:border-orange"
            }`}
            >
              All
            </button>
            <button
              onClick={() => handleCategoryClick("FREE")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeCategory === "FREE" && !isHot
                  ? "text-navy dark:text-orange border-orange bg-white dark:bg-gray-800"
                  : "text-gray-600 dark:text-gray-400 border-transparent hover:text-orange hover:border-orange"
              }`}
            >
              Free Board
            </button>
            <button
              onClick={() => handleCategoryClick("CONSULTATION")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeCategory === "CONSULTATION" && !isHot
                  ? "text-navy dark:text-orange border-orange bg-white dark:bg-gray-800"
                  : "text-gray-600 dark:text-gray-400 border-transparent hover:text-orange hover:border-orange"
              }`}
            >
              Consultation
            </button>
            <button
              onClick={() => handleCategoryClick("STUDY")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeCategory === "STUDY" && !isHot
                  ? "text-navy dark:text-orange border-orange bg-white dark:bg-gray-800"
                  : "text-gray-600 dark:text-gray-400 border-transparent hover:text-orange hover:border-orange"
              }`}
            >
              Study & Exams
            </button>
          <button
            onClick={() => handleCategoryClick("hot")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              isHot
                ? "text-navy dark:text-orange border-orange bg-white dark:bg-gray-800"
                : "text-gray-600 dark:text-gray-400 border-transparent hover:text-orange hover:border-orange"
            }`}
          >
            HOT
          </button>
        </div>
      </div>

      {/* 게시물 목록 */}
      <div className="p-6">
        <PostList category={activeCategory} hot={isHot} />
      </div>
    </div>
  );
}

