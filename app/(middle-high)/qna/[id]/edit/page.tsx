import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import QnaEditPostClient from "./EditPostClient";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import MiddleHighHeroLayout from "@/components/layouts/MiddleHighHeroLayout";

export const metadata = {
  title: "Edit Q&A",
  description: "Edit Q&A question",
};

export default async function QnaEditPostPage({
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

  // 게시물 확인 및 작성자 확인
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: {
          clerkUserId: true,
        },
      },
    },
  });

  if (!post) {
    redirect("/qna");
  }

  // QNA 카테고리가 아니면 리다이렉트
  if (post.category !== "QNA") {
    redirect(`/qna/${params.id}`);
  }

  // 작성자만 수정 가능
  if (post.author.clerkUserId !== userId) {
    redirect(`/qna/${params.id}`);
  }

  return (
    <MiddleHighHeroLayout active="qna">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md border border-navy-200 p-6">
          <h1 className="text-2xl font-bold text-navy mb-6">Edit Q&A</h1>
          <QnaEditPostClient postId={params.id} initialPost={post} />
        </div>
      </div>
    </MiddleHighHeroLayout>
  );
}

