"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PostEditor from "@/components/community/PostEditor";

export default function QnaWritePageClient() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  // QNA 카테고리로 고정
  const initialData = {
    title: "",
    content: "",
    category: "QNA",
    visibilityName: "nickname",
  };

  const handleSubmit = async (data: {
    title: string;
    content: string;
    category: string;
    visibilityName: string;
  }) => {
    try {
      setError(null);
      // QNA 카테고리로 강제 설정
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          category: "QNA", // 항상 QNA로 설정
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to post question." }));
        throw new Error(errorData.error || "Failed to post question.");
      }

      const post = await response.json();
      // 성공 시 Q&A 페이지로 이동
      router.push(`/qna`);
    } catch (error: any) {
      console.error("Error submitting Q&A:", error);
      setError(error.message || "Failed to post question.");
    }
  };

  const handleCancel = () => {
    router.push("/qna");
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

