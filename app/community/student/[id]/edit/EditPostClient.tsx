"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PostEditor from "@/components/community/PostEditor";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  visibilityName: string;
}

interface EditPostClientProps {
  postId: string;
  initialPost: Post;
}

export default function EditPostClient({ postId, initialPost }: EditPostClientProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState({
    title: initialPost.title,
    content: initialPost.content,
    category: initialPost.category,
    visibilityName: initialPost.visibilityName,
  });

  const handleSubmit = async (data: {
    title: string;
    content: string;
    category: string;
    visibilityName: string;
  }) => {
    try {
      setError(null);
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "게시물 수정에 실패했습니다." }));
        throw new Error(errorData.error || "게시물 수정에 실패했습니다.");
      }

      // 성공 시 게시물 상세 페이지로 이동
      router.push(`/community/student/${postId}`);
    } catch (error: any) {
      console.error("Error updating post:", error);
      setError(error.message || "게시물 수정에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    router.push(`/community/student/${postId}`);
  };

  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      <PostEditor 
        onSubmit={handleSubmit} 
        onCancel={handleCancel}
        initialData={initialData}
      />
    </>
  );
}

