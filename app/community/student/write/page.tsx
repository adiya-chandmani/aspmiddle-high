import { requireStudentOrSchoolEmail } from "@/lib/auth";
import { redirect } from "next/navigation";
import WritePageClient from "./WritePageClient";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "글쓰기 | Student Community",
  description: "게시물 작성",
};

export default async function WritePage() {
  // STUDENT role 또는 학교 이메일이면 접근 가능
  try {
    await requireStudentOrSchoolEmail();
  } catch (error) {
    redirect("/community/student");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">글쓰기</h1>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <WritePageClient />
      </div>
    </div>
  );
}

