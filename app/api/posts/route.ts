import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getUserRole } from "@/lib/auth";
import { sortByHotScore } from "@/lib/utils/hot-posts";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET: 게시물 목록 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const excludeCategories = searchParams.getAll("excludeCategory"); // 여러 카테고리 제외 옵션
    const mine = searchParams.get("mine") === "true"; // "내가 쓴 질문" 필터링
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const { userId } = await auth();
    const role = userId ? await getUserRole(userId) : null;

    const where: any = {
      isDeleted: false,
      isHidden: false,
    };

    if (category && category !== "all") {
      const upperCategory = category.toUpperCase();
      where.category = upperCategory;

      // Q&A 게시판: 목록은 모든 로그인 사용자가 볼 수 있음 (상세 페이지 접근 권한은 별도 체크)
      if (upperCategory === "QNA") {
        if (!userId) {
          return NextResponse.json(
            {
              posts: [],
              pagination: { page, limit, total: 0, totalPages: 0 },
            },
            { status: 200 }
          );
        }
        // "내가 쓴 질문" 필터링
        if (mine) {
          where.authorId = userId;
        }
        // 목록 조회 시에는 필터링하지 않음 (모든 QNA 표시)
      }
    } else if (excludeCategories.length > 0) {
      // 여러 카테고리 제외 (Student Community에서 QNA, CLUB 제외)
      const upperExcludeCategories = excludeCategories.map(cat => cat.toUpperCase());
      where.category = {
        notIn: upperExcludeCategories,
      };
    }

    // HOT 게시물 정렬
    const isHot = searchParams.get("hot") === "true";

    const [allPosts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              clerkUserId: true,
              nickname: true,
              name: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    // HOT 게시물인 경우 QNA와 CLUB 제외 후 점수 계산 및 정렬
    let posts = allPosts;
    if (isHot) {
      // HOT 게시물에서 QNA와 CLUB 제외
      const postsFiltered = allPosts.filter(
        (post) => post.category !== "QNA" && post.category !== "CLUB"
      );
      posts = sortByHotScore(postsFiltered);
    } else {
      posts = allPosts.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    // 페이지네이션 적용
    posts = posts.slice(skip, skip + limit);

    // 익명 게시물 처리 및 QNA 작성자 정보 제한
    const postsWithVisibility = posts.map((post) => {
      let displayName = "익명";
      
      // QNA 게시물인 경우 작성자 정보 제한
      if (post.category === "QNA") {
        // 관리자이거나 작성자 본인인 경우에만 작성자 정보 표시
        if (role === "ADMIN" || post.author.clerkUserId === userId) {
          displayName =
            post.visibilityName === "anonymous"
              ? "익명"
              : post.author.nickname || post.author.name || "익명";
        } else {
          // 다른 사용자의 QNA는 작성자 정보 숨김
          displayName = "익명";
        }
      } else {
        // 일반 게시물은 기존 로직
        displayName =
          post.visibilityName === "anonymous"
            ? "익명"
            : post.author.nickname || post.author.name || "익명";
      }

      return {
        ...post,
        author: {
          ...post.author,
          displayName,
        },
      };
    });

    return NextResponse.json({
      posts: postsWithVisibility,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "게시물을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// POST: 게시물 작성
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, category, visibilityName } = body;

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

    // HTML 내용이 실제로 비어있는지 확인
    const textContent = content.replace(/<[^>]*>/g, "").trim();
    if (textContent.length === 0) {
      return NextResponse.json(
        { error: "내용을 입력해주세요." },
        { status: 400 }
      );
    }

    // 사용자 확인 및 자동 생성 (webhook이 실행되지 않은 경우 대비)
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      // Clerk에서 사용자 정보 가져오기
      const clerkUser = await currentUser();
      if (!clerkUser) {
        return NextResponse.json(
          { error: "사용자 정보를 가져올 수 없습니다." },
          { status: 401 }
        );
      }

      // 사용자 자동 생성
      const emailAddresses = clerkUser.emailAddresses || [];
      const email = emailAddresses[0]?.emailAddress || null;
      const name = clerkUser.firstName && clerkUser.lastName
        ? `${clerkUser.firstName} ${clerkUser.lastName}`
        : clerkUser.firstName || clerkUser.lastName || null;

      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          email,
          name,
          role: "STUDENT", // 기본값은 STUDENT
        },
      });
    }

    // 게시물 생성
    const post = await prisma.post.create({
      data: {
        title,
        content,
        category: category || "FREE",
        authorId: userId,
        visibilityName: visibilityName || "nickname",
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
      post.visibilityName === "anonymous"
        ? "익명"
        : post.author.nickname || post.author.name || "익명";

    return NextResponse.json(
      {
        ...post,
        author: {
          ...post.author,
          displayName,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { 
        error: error.message || "게시물 작성 중 오류가 발생했습니다.",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

