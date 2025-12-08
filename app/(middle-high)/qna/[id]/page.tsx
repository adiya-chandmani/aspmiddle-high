import { requireAuth } from "@/lib/auth";
import PostDetail from "@/components/community/PostDetail";
import Link from "next/link";
import { redirect } from "next/navigation";
import MiddleHighHeroLayout from "@/components/layouts/MiddleHighHeroLayout";

export const metadata = {
  title: "Q&A Detail",
  description: "View Q&A question details",
};

export default async function QnaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // 모든 로그인 사용자 접근 가능 (학생/학교 이메일 제한 없음)
  try {
    await requireAuth();
  } catch (error) {
    redirect("/sign-in");
  }

  return (
    <MiddleHighHeroLayout active="qna">
      <div className="container mx-auto px-4 py-12">
        <Link
          href="/qna"
          className="text-navy hover:text-navy-700 font-medium mb-6 inline-block"
        >
          ← Back to List
        </Link>
        <PostDetail postId={params.id} category="QNA" />
      </div>
    </MiddleHighHeroLayout>
  );
}

