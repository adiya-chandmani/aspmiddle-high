"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface TeacherDeleteButtonProps {
  teacherId: string;
  teacherName: string;
}

export default function TeacherDeleteButton({ teacherId, teacherName }: TeacherDeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to PERMANENTLY delete ${teacherName}'s profile?\n\nThis action cannot be undone!`)) {
      return;
    }

    // 이중 확인
    if (!confirm(`Final confirmation: Delete ${teacherName}'s profile permanently?`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/teachers/${teacherId}`, {
        method: "DELETE",
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to delete profile." }));
        throw new Error(errorData.error || "Failed to delete profile.");
      }

      // 즉시 페이지 새로고침
      router.refresh();
      window.location.reload();
    } catch (error: any) {
      console.error("Error deleting teacher:", error);
      alert(error.message || "Failed to delete teacher profile.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-3 py-1 text-xs rounded-md font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}

