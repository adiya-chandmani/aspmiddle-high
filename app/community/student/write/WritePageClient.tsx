"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PostEditor from "@/components/community/PostEditor";

export default function WritePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const allowedCategories = ["FREE", "CONSULTATION", "STUDY", "LOST_FOUND", "INFO", "QNA"];
  const requestedCategory = searchParams.get("category")?.toUpperCase();
  const defaultCategory = requestedCategory && allowedCategories.includes(requestedCategory)
    ? requestedCategory
    : undefined;
  const initialData = defaultCategory
    ? {
        title: "",
        content: "",
        category: defaultCategory,
        visibilityName: "nickname",
      }
    : undefined;

  const handleSubmit = async (data: {
    title: string;
    content: string;
    category: string;
    visibilityName: string;
  }) => {
    try {
      setError(null);
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "게시물 작성에 실패했습니다." }));
        throw new Error(errorData.error || "게시물 작성에 실패했습니다.");
      }

      const post = await response.json();
      // 성공 시 게시물 상세 페이지로 이동
      router.push(`/community/student/${post.id}`);
    } catch (error: any) {
      console.error("Error submitting post:", error);
      setError(error.message || "게시물 작성에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    router.push("/community/student");
  };

  return (
    <>
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      <PostEditor onSubmit={handleSubmit} onCancel={handleCancel} initialData={initialData} />
    </>
  );
}

