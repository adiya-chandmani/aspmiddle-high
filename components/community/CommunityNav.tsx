"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CommunityNav() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-1 border-b border-gray-200 bg-white px-4 items-center justify-between">
      <div className="flex space-x-1">
        <Link
          href="/community/student"
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            pathname === "/community/student" || pathname.startsWith("/community/student/")
              ? "text-navy border-navy hover:bg-orange/10"
              : "text-gray-600 hover:text-orange hover:bg-orange/5 border-transparent hover:border-orange"
          }`}
        >
          Student Community
        </Link>
        <Link
          href="/community/suggestion"
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            pathname === "/community/suggestion"
              ? "text-navy border-navy hover:bg-orange/10"
              : "text-gray-600 hover:text-orange hover:bg-orange/5 border-transparent hover:border-orange"
          }`}
        >
          Suggestion
        </Link>
      </div>
      <Link
        href="/"
        className="p-2 text-gray-600 hover:text-orange hover:bg-orange/10 rounded-md transition-colors"
        title="홈으로 이동"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </Link>
    </nav>
  );
}

