import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/auth";

export const metadata = {
  title: "Community | School Web Platform",
  description: "Student Community",
};

export default async function CommunityPage() {
  const { userId } = await auth();

  // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
  if (!userId) {
    redirect("/sign-in");
  }

  // 역할 확인
  const role = await getUserRole(userId);

  // STAFF, ADMIN, STUDENT 역할은 바로 Student Community로 리다이렉트
  if (role === "STAFF" || role === "ADMIN" || role === "STUDENT") {
    redirect("/community/student");
  }

  // VISITOR 역할만 안내 화면 표시
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Community</h1>
      <div className="prose max-w-none">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <p className="text-lg text-gray-900 font-medium">
            Student-only community is available only to students.
          </p>
          <p className="text-gray-700 mt-2">
            If you are a student, please log in to access the community.
          </p>
        </div>
        <div className="mt-4">
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-orange/20 transition-colors font-medium text-sm"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

