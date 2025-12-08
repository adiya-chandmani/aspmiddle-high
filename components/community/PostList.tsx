"use client";

import { useEffect, useState, useCallback } from "react";
import PostCard from "./PostCard";
import Link from "next/link";

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

interface PostListProps {
  category?: string;
  hot?: boolean;
  mine?: boolean; // Filter for "My Questions"
}

export default function PostList({ category = "all", hot = false, mine = false }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [category, hot, mine]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });

      if (category !== "all") {
        params.append("category", category);
      } else if (!hot) {
        // "all" 카테고리일 때 QNA와 CLUB 제외 (Student Community에서 보이지 않도록)
        params.append("excludeCategory", "QNA");
        params.append("excludeCategory", "CLUB");
      }

      if (hot) {
        params.append("hot", "true");
        // HOT 게시물에서도 QNA와 CLUB 제외
        params.append("excludeCategory", "QNA");
        params.append("excludeCategory", "CLUB");
      }

      if (mine) {
        params.append("mine", "true");
      }

      const response = await fetch(`/api/posts?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data.posts);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [category, hot, mine, page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading posts...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    // QNA 카테고리인 경우 /qna/write로, 그 외는 /community/student/write로
    const writeHref = category?.toUpperCase() === "QNA" 
      ? "/qna/write"
      : category?.toUpperCase() === "INFO" 
        ? "/community/student/write?category=INFO"
        : "/community/student/write";
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No posts yet.</p>
        <Link
          href={writeHref}
          className="text-navy hover:text-orange font-medium"
        >
          Write First Post
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-0 border border-gray-200 rounded-md overflow-hidden bg-white">
        {posts.map((post) => (
          <div key={post.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
            <PostCard post={post} />
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

