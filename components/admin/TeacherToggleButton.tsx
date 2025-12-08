"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface TeacherToggleButtonProps {
  teacherId: string;
  teacherName: string;
  isActive: boolean;
}

export default function TeacherToggleButton({ 
  teacherId, 
  teacherName, 
  isActive 
}: TeacherToggleButtonProps) {
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);

    try {
      const response = await fetch(`/api/teachers/${teacherId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          isActive: !isActive,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to toggle status." }));
        throw new Error(errorData.error || "Failed to toggle status.");
      }

      // 즉시 페이지 새로고침
      router.refresh();
      window.location.reload();
    } catch (error: any) {
      console.error("Error toggling teacher status:", error);
      alert(error.message || "Failed to toggle teacher status.");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isToggling}
      className={`px-3 py-1 text-xs rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        isActive
          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
          : "bg-green-100 text-green-800 hover:bg-green-200"
      }`}
    >
      {isToggling ? "..." : isActive ? "Deactivate" : "Activate"}
    </button>
  );
}

