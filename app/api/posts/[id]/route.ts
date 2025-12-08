import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getUserRole } from "@/lib/auth";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET: 게시물 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { userId } = await auth();
    const role = userId ? await getUserRole(userId) : null;

    const post = await prisma.post.findUnique({
      where: { id: resolvedParams.id },
      include: {
        author: {
          select: {
            clerkUserId: true,
            nickname: true,
            name: true,
          },
        },
        comments: {
          where: {
            isDeleted: false,
            isHidden: false,
          },
          include: {
            author: {
              select: {
                clerkUserId: true,
                nickname: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "게시물을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // Q&A 게시물은 작성자 또는 관리자만 조회 가능
    if (post.category === "QNA") {
      if (!userId || (post.authorId !== userId && role !== "ADMIN")) {
        return NextResponse.json(
          { error: "해당 Q&A를 볼 수 있는 권한이 없습니다." },
          { status: 403 }
        );
      }
    }

    if (post.isDeleted || post.isHidden) {
      return NextResponse.json(
        { error: "삭제되었거나 숨겨진 게시물입니다." },
        { status: 404 }
      );
    }

    // 익명 게시물 처리
    const displayName =
      post.visibilityName === "anonymous"
        ? "익명"
        : post.author.nickname || post.author.name || "익명";

    const commentsWithVisibility = post.comments.map((comment) => {
      const commentDisplayName =
        comment.visibilityName === "anonymous"
          ? "익명"
          : comment.author.nickname || comment.author.name || "익명";

      return {
        ...comment,
        author: {
          ...comment.author,
          displayName: commentDisplayName,
        },
      };
    });

    return NextResponse.json({
      ...post,
      author: {
        ...post.author,
        displayName,
      },
      comments: commentsWithVisibility,
      likeCount: post._count.likes,
      commentCount: post._count.comments,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "게시물을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// PUT: 게시물 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, category, visibilityName } = body;

    // 게시물 확인
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
      return NextResponse.json(
        { error: "게시물을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 작성자 확인
    if (post.author.clerkUserId !== userId) {
      return NextResponse.json(
        { error: "수정 권한이 없습니다." },
        { status: 403 }
      );
    }

    // 입력 검증
    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "제목을 입력해주세요." },
        { status: 400 }
      );
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "내용을 입력해주세요." },
        { status: 400 }
      );
    }

    const textContent = content.replace(/<[^>]*>/g, "").trim();
    if (textContent.length === 0) {
      return NextResponse.json(
        { error: "내용을 입력해주세요." },
        { status: 400 }
      );
    }

    // 게시물 수정
    const updatedPost = await prisma.post.update({
      where: { id: resolvedParams.id },
      data: {
        title: title.trim(),
        content: content.trim(),
        category: category || post.category,
        visibilityName: visibilityName || post.visibilityName,
      },
      include: {
        author: {
          select: {
            nickname: true,
            name: true,
          },
        },
      },
    });

    const displayName =
      updatedPost.visibilityName === "anonymous"
        ? "익명"
        : updatedPost.author.nickname || updatedPost.author.name || "익명";

    return NextResponse.json({
      ...updatedPost,
      author: {
        ...updatedPost.author,
        displayName,
      },
    });
  } catch (error: any) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      {
        error: error.message || "게시물 수정 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

// DELETE: 게시물 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    // 게시물 확인
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
      return NextResponse.json(
        { error: "게시물을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 작성자 또는 관리자 확인
    const role = userId ? await getUserRole(userId) : null;
    if (post.author.clerkUserId !== userId && role !== "ADMIN") {
      return NextResponse.json(
        { error: "삭제 권한이 없습니다." },
        { status: 403 }
      );
    }

    // 게시물 삭제 (soft delete)
    await prisma.post.update({
      where: { id: params.id },
      data: {
        isDeleted: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      {
        error: error.message || "게시물 삭제 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
