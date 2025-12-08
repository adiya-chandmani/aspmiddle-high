"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClearReportsButton() {
  const router = useRouter();
  const [isClearing, setIsClearing] = useState(false);

  const handleClear = async () => {
    if (!confirm("Are you sure you want to clear ALL report records?\n\nThis action cannot be undone!")) {
      return;
    }

    // 이중 확인
    if (!confirm("Final confirmation: Delete all report records permanently?")) {
      return;
    }

    setIsClearing(true);

    try {
      const response = await fetch("/api/admin/reports", {
        method: "DELETE",
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to clear reports." }));
        throw new Error(errorData.error || "Failed to clear reports.");
      }

      const data = await response.json();
      alert(`Successfully cleared ${data.count} report(s).`);
      
      // 즉시 페이지 새로고침
      router.refresh();
      window.location.reload();
    } catch (error: any) {
      console.error("Error clearing reports:", error);
      alert(error.message || "Failed to clear reports.");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <button
      onClick={handleClear}
      disabled={isClearing}
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
    >
      {isClearing ? "Clearing..." : "Clear All Records"}
    </button>
  );
}

