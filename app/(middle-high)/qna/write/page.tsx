import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import QnaWritePageClient from "./WritePageClient";
import MiddleHighHeroLayout from "@/components/layouts/MiddleHighHeroLayout";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Ask Question | Q&A",
  description: "Ask questions to the school and administrators",
};

export default async function QnaWritePage() {
  // 모든 로그인 사용자 접근 가능 (학생/학교 이메일 제한 없음)
  try {
    await requireAuth();
  } catch (error) {
    redirect("/sign-in");
  }

  return (
    <MiddleHighHeroLayout active="qna">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Ask Question</h1>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <QnaWritePageClient />
          </div>
        </div>
      </div>
    </MiddleHighHeroLayout>
  );
}

