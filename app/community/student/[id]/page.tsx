import { requireStudentOrSchoolEmail } from "@/lib/auth";
import PostDetail from "@/components/community/PostDetail";
import Link from "next/link";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "게시물 상세 | Student Community",
  description: "게시물 상세 보기",
};

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  // STUDENT role 또는 학교 이메일이면 접근 가능
  try {
    await requireStudentOrSchoolEmail();
  } catch (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">접근 권한이 없습니다</h2>
        <p className="text-gray-600 mb-4">
          Student Community는 학생 또는 학교 이메일을 가진 사용자만 접근할 수 있습니다.
        </p>
        <Link
          href="/community"
          className="text-navy hover:text-navy-700 font-medium"
        >
          커뮤니티로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/community/student"
        className="text-navy hover:text-navy-700 font-medium mb-6 inline-block"
      >
        ← 목록으로
      </Link>
      <PostDetail postId={resolvedParams.id} />
    </div>
  );
}

