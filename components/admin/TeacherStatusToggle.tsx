"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface TeacherStatusToggleProps {
  teacherId: string;
  isActive: boolean;
}

export default function TeacherStatusToggle({ 
  teacherId, 
  isActive 
}: TeacherStatusToggleProps) {
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
    <span
      onClick={handleToggle}
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer transition-colors hover:opacity-80 ${
        isActive
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      } ${isToggling ? "opacity-50 cursor-wait" : ""}`}
      title="Click to toggle status"
    >
      {isToggling ? "..." : isActive ? "Active" : "Inactive"}
    </span>
  );
}

