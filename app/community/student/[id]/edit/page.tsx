import { requireStudentOrSchoolEmail } from "@/lib/auth";
import { redirect } from "next/navigation";
import EditPostClient from "./EditPostClient";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Edit Post | Student Community",
  description: "Edit post",
};

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  // STUDENT role 또는 학교 이메일이면 접근 가능
  try {
    await requireStudentOrSchoolEmail();
  } catch (error) {
    redirect("/community/student");
  }

  // 게시물 확인 및 작성자 확인
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const post = await prisma.post.findUnique({
    where: { id: resolvedParams.id },
    include: {
      author: {
        select: {
          clerkUserId: true,
        },
      },
    },
  });

  if (!post) {
    redirect("/community/student");
  }

  // QNA 카테고리는 QNA 수정 페이지로 리다이렉트
  if (post.category === "QNA") {
    redirect(`/qna/${resolvedParams.id}/edit`);
  }

  if (post.author.clerkUserId !== userId) {
    redirect(`/community/student/${resolvedParams.id}`);
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md border border-navy-200 p-6">
      <h1 className="text-2xl font-bold text-navy mb-6">Edit Post</h1>
      <EditPostClient postId={resolvedParams.id} initialPost={post} />
    </div>
  );
}

