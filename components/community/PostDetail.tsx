"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import CommentSection from "./CommentSection";
import ReportButton from "./ReportButton";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  author: {
    clerkUserId?: string;
    displayName: string;
  };
  likeCount: number;
  commentCount: number;
  createdAt: string;
  comments: Array<{
    id: string;
    content: string;
    author: {
      clerkUserId?: string;
      displayName: string;
    };
    createdAt: string;
  }>;
}

interface PostDetailProps {
  postId: string;
  category?: string; // 카테고리 정보 (QNA인 경우 목록 링크 변경)
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

export default function PostDetail({ postId, category }: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isTogglingLike, setIsTogglingLike] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();
  const { userId } = useAuth();

  const [isForbidden, setIsForbidden] = useState(false);

  const fetchPost = useCallback(async () => {
    setLoading(true);
    setIsForbidden(false);
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (!response.ok) {
        if (response.status === 403) {
          setIsForbidden(true);
          return;
        }
        throw new Error("Failed to fetch post");
      }
      const data = await response.json();
      setPost(data);
      setIsAuthor(data.author?.clerkUserId === userId);
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  }, [postId, userId]);

  const fetchLikeStatus = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch(`/api/posts/${postId}/like`);
      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.liked);
      }
    } catch (error) {
      console.error("Error fetching like status:", error);
    }
  }, [userId, postId]);

  useEffect(() => {
    fetchPost();
  }, [postId, fetchPost]);

  useEffect(() => {
    // 게시글 조회 기록 저장 (userId별로 구분)
    if (typeof window !== "undefined" && userId) {
      const storageKey = `viewedPosts_${userId}`;
      const viewedPosts = JSON.parse(
        localStorage.getItem(storageKey) || "[]"
      );
      if (!viewedPosts.includes(postId)) {
        viewedPosts.push(postId);
        if (viewedPosts.length > 1000) {
          viewedPosts.shift();
        }
        localStorage.setItem(storageKey, JSON.stringify(viewedPosts));
      }
    }
  }, [postId, userId]);

  useEffect(() => {
    if (userId && post) {
      fetchLikeStatus();
    }
  }, [userId, post, fetchLikeStatus]);

  useEffect(() => {
    // 사용자 역할 가져오기
    const fetchUserRole = async () => {
      if (!userId) {
        setUserRole(null);
        return;
      }
      try {
        const res = await fetch("/api/users/me");
        if (!res.ok) return;
        const data = await res.json();
        setUserRole(data.role || null);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, [userId]);

  const handleLike = async () => {
    if (!userId) {
      alert("Login required.");
      return;
    }

    setIsTogglingLike(true);
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to process like." }));
        throw new Error(errorData.error || "Failed to process like.");
      }

      const data = await response.json();
      setIsLiked(data.liked);
      
      // 게시물 정보 새로고침
      await fetchPost();
    } catch (error: any) {
      console.error("Error toggling like:", error);
      alert(error.message || "An error occurred while processing like.");
    } finally {
      setIsTogglingLike(false);
    }
  };

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

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete post.");
      }

      // Redirect to list after successful deletion
      router.push(category === "QNA" ? "/qna" : "/community/student");
    } catch (error: any) {
      console.error("Error deleting post:", error);
      alert(error.message || "Failed to delete post.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Loading post...</p>
      </div>
    );
  }

  if (isForbidden) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="text-center py-16 px-6">
          <div className="mb-6">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500"
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
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Secret Post</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This Q&A can only be viewed by the author and administrators.
          </p>
          <Link
            href={category === "QNA" ? "/qna" : "/community/student"}
            className="inline-block px-6 py-2 bg-navy text-white rounded-md hover:bg-navy-700 transition-colors font-medium"
          >
            Back to List
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 mb-4">Post not found.</p>
        <Link
          href={category === "QNA" ? "/qna" : "/community/student"}
          className="text-navy dark:text-orange hover:text-orange font-medium"
        >
          Back to List
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* 게시물 헤더 */}
      <div className="p-6 pb-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white flex-1">
            {post.title}
          </h1>
          {(isAuthor || userRole === "ADMIN") && (
            <div className="flex items-center gap-2 ml-4">
              {isAuthor && (
                <Link
                  href={category === "QNA" ? `/qna/${postId}/edit` : `/community/student/${postId}/edit`}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                >
                  Edit
                </Link>
              )}
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
            {categoryLabels[post.category] || post.category}
          </span>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <span>{formatDate(post.createdAt)}</span>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <span>{post.author.displayName}</span>
          <span className="text-gray-300 ml-auto">|</span>
          <span>Views {post.likeCount + post.commentCount + 1}</span>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <span>Comments {post.commentCount}</span>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <span>Likes {post.likeCount}</span>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <ReportButton postId={postId} onReportSuccess={() => {}} />
        </div>
      </div>

      {/* 구분선 */}
      <div className="border-t border-gray-200 dark:border-gray-700"></div>

      {/* 게시물 본문 */}
      <div className="p-6">
        <div
          className="prose max-w-none text-gray-700 dark:text-gray-300 leading-relaxed prose-headings:dark:text-white prose-p:dark:text-gray-300 prose-strong:dark:text-white"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* 구분선 */}
      <div className="border-t border-gray-200 dark:border-gray-700"></div>

      {/* 좋아요 버튼 */}
      <div className="p-4 flex items-center justify-center gap-4 bg-gray-50 dark:bg-gray-900">
        <button
          onClick={handleLike}
          disabled={isTogglingLike || !userId}
          className={`flex items-center gap-2 px-5 py-2 border rounded-md transition-colors ${
            isLiked
              ? "bg-orange-50 dark:bg-orange-900/30 border-orange text-orange hover:bg-orange-100 dark:hover:bg-orange-900/40"
              : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <svg
            className={`w-4 h-4 ${isLiked ? "text-orange" : "text-gray-600 dark:text-gray-400"}`}
            fill={isLiked ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          <span className={`text-sm font-medium ${isLiked ? "text-orange" : "text-gray-700 dark:text-gray-300"}`}>
            {post.likeCount}
          </span>
        </button>
      </div>

      {/* 댓글 섹션 */}
      <div className="mt-6">
        <CommentSection
          postId={postId}
          category={post.category}
          isAuthor={isAuthor}
          initialComments={post.comments}
          onChange={fetchPost}
        />
      </div>
    </div>
  );
}

