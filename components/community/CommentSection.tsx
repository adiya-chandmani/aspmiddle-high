"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import ReportButton from "./ReportButton";

interface Comment {
  id: string;
  content: string;
  author: {
    clerkUserId?: string;
    displayName: string;
  };
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
  category: string;
  isAuthor: boolean;
  initialComments?: Comment[];
  onChange?: () => void;
}

export default function CommentSection({
  postId,
  category,
  isAuthor,
  initialComments = [],
  onChange,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { userId } = useAuth();
  const isQna = category === "QNA";
  const canSubmit = !!userId && (!isQna ? true : userRole === "ADMIN");
  const canView = !isQna || userRole === "ADMIN" || isAuthor;

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      alert("Please enter a comment.");
      return;
    }

    if (!userId) {
      alert("Login required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment.trim(),
          visibilityName: isAnonymous ? "anonymous" : "nickname",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to post comment." }));
        throw new Error(errorData.error || "Failed to post comment.");
      }

      const newCommentData = await response.json();
      setComments((prev) => [...prev, newCommentData]);
      setNewComment("");
      setIsAnonymous(false);
      await fetchComments();
      onChange?.();
    } catch (error: any) {
      console.error("Error submitting comment:", error);
      alert(error.message || "An error occurred while posting comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!userId) {
      alert("Login required.");
      return;
    }

    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to delete comment." }));
        throw new Error(errorData.error || "Failed to delete comment.");
      }

      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      await fetchComments();
      onChange?.();
    } catch (error: any) {
      console.error("Error deleting comment:", error);
      alert(error.message || "An error occurred while deleting comment.");
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

  if (isQna && !canView) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          This Q&A can only be viewed by the author and administrators.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Comments {comments.length}
        </h2>
      </div>

      {/* Comment Form */}
      {canSubmit && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-navy dark:focus:ring-orange focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              rows={3}
              placeholder="Enter your comment..."
              disabled={isSubmitting}
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-4 w-4 text-navy dark:text-orange focus:ring-navy dark:focus:ring-orange border-gray-300 dark:border-gray-600 rounded"
                />
                Post as Anonymous
              </label>
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="px-4 py-2 bg-orange text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isSubmitting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Comment List */}
      {isLoading ? (
        <div className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
        </div>
      ) : (
        <div>
          {comments.map((comment) => (
            <div key={comment.id} className="p-6 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {comment.author.displayName}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  {(comment.author.clerkUserId === userId || userRole === "ADMIN") && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                  <ReportButton
                    commentId={comment.id}
                    onReportSuccess={() => {}}
                  />
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mt-2 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

