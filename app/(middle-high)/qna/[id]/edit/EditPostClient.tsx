"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PostEditor from "@/components/community/PostEditor";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  visibilityName: string;
}

interface QnaEditPostClientProps {
  postId: string;
  initialPost: Post;
}

export default function QnaEditPostClient({ postId, initialPost }: QnaEditPostClientProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState({
    title: initialPost.title,
    content: initialPost.content,
    category: "QNA", // QNA로 고정
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
        body: JSON.stringify({
          ...data,
          category: "QNA", // 항상 QNA로 설정
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to update Q&A." }));
        throw new Error(errorData.error || "Failed to update Q&A.");
      }

      // 성공 시 Q&A 상세 페이지로 이동
      router.push(`/qna/${postId}`);
    } catch (error: any) {
      console.error("Error updating Q&A:", error);
      setError(error.message || "Failed to update Q&A.");
    }
  };

  const handleCancel = () => {
    router.push(`/qna/${postId}`);
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
        hideCategory={true}
      />
    </>
  );
}

