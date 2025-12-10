"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  author: {
    displayName: string;
  };
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

interface PostCardProps {
  post: Post;
}

const categoryLabels: Record<string, string> = {
  FREE: "Free",
  CONSULTATION: "Consultation",
  STUDY: "Study & Exams",
  INFO: "Suggestion",
  LOST_FOUND: "Lost & Found",
  QNA: "Q&A",
  ANNOUNCEMENT: "Announcement",
};

export default function PostCard({ post }: PostCardProps) {
  const [isViewed, setIsViewed] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // userId 가져오기
    const fetchUserId = async () => {
      try {
        const response = await fetch("/api/users/me");
        if (response.ok) {
          const data = await response.json();
          setUserId(data.userId || null);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    // localStorage에서 본 게시글 확인 (userId별로 구분)
    if (typeof window !== "undefined" && userId) {
      const storageKey = `viewedPosts_${userId}`;
      const viewedPosts = JSON.parse(
        localStorage.getItem(storageKey) || "[]"
      );
      setIsViewed(viewedPosts.includes(post.id));
    }
  }, [post.id, userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-US");
  };

  const handleClick = () => {
    // 게시글 클릭 시 localStorage에 저장 (userId별로 구분)
    if (typeof window !== "undefined" && userId) {
      const storageKey = `viewedPosts_${userId}`;
      const viewedPosts = JSON.parse(
        localStorage.getItem(storageKey) || "[]"
      );
      if (!viewedPosts.includes(post.id)) {
        viewedPosts.push(post.id);
        // 최대 1000개까지만 저장 (메모리 관리)
        if (viewedPosts.length > 1000) {
          viewedPosts.shift();
        }
        localStorage.setItem(storageKey, JSON.stringify(viewedPosts));
        setIsViewed(true);
      }
    }
  };

  // QNA 카테고리인 경우 /qna 경로로, 그 외는 /community/student 경로로
  const postHref = post.category === "QNA" 
    ? `/qna/${post.id}` 
    : `/community/student/${post.id}`;

  return (
    <Link href={postHref} onClick={handleClick}>
      <div
        className={`flex items-start gap-4 p-4 transition-all cursor-pointer ${
          isViewed
            ? "bg-gray-50 dark:bg-gray-800 opacity-70 hover:opacity-90"
            : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        }`}
      >
        {/* 좋아요 수 또는 자물쇠 아이콘 (왼쪽) */}
        <div className="flex flex-col items-center justify-center min-w-[45px] self-center">
          {post.category === "QNA" ? (
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          ) : (
            <>
              <svg
                className="w-4 h-4 text-gray-500 hover:text-orange transition-colors"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                {post.likeCount}
              </span>
            </>
          )}
        </div>

        {/* 게시글 내용 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
              {categoryLabels[post.category] || post.category}
            </span>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(post.createdAt)}</span>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{post.author.displayName}</span>
          </div>
          <h3
            className={`text-base font-semibold mb-1 line-clamp-2 ${
              isViewed ? "text-gray-500 dark:text-gray-500" : "text-gray-900 dark:text-white"
            }`}
          >
            {post.title}
          </h3>
          {post.commentCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>Comments {post.commentCount}</span>
            </div>
          )}
        </div>

        {/* 썸네일 (나중에 추가 가능) */}
        {/* <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0">
          <img src={post.thumbnail} alt="" className="w-full h-full object-cover rounded" />
        </div> */}
      </div>
    </Link>
  );
}
