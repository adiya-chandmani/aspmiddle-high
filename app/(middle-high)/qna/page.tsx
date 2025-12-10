"use client";

import { useState } from "react";
import PostList from "@/components/community/PostList";
import Link from "next/link";
import MiddleHighHeroLayout from "@/components/layouts/MiddleHighHeroLayout";

export default function QnaPage() {
  const [activeTab, setActiveTab] = useState<"QNA" | "MINE">("QNA");

  return (
    <MiddleHighHeroLayout active="qna">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-5">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Q&A</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ask questions to the school and administrators. Questions can only be viewed by the author and administrators.
                </p>
              </div>
              <Link
                href="/qna/write"
                className="px-5 py-2.5 bg-orange text-white rounded-md hover:bg-orange-700 transition-colors font-medium text-sm shadow-sm hover:shadow"
              >
                Ask Question
              </Link>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab("QNA")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "QNA"
                    ? "text-navy dark:text-orange border-orange bg-white dark:bg-gray-800"
                    : "text-gray-600 dark:text-gray-400 border-transparent hover:text-orange hover:border-orange"
                }`}
              >
                All Q&A
              </button>
              <button
                onClick={() => setActiveTab("MINE")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "MINE"
                    ? "text-navy dark:text-orange border-orange bg-white dark:bg-gray-800"
                    : "text-gray-600 dark:text-gray-400 border-transparent hover:text-orange hover:border-orange"
                }`}
              >
                My Questions
              </button>
            </div>
          </div>

          <div className="p-6">
            <PostList category="QNA" mine={activeTab === "MINE"} />
          </div>
        </div>
      </div>
    </MiddleHighHeroLayout>
  );
}
