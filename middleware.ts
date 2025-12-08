import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Webhook은 인증 제외
  if (req.nextUrl.pathname.startsWith("/api/webhooks/clerk")) {
    return;
  }

  // 공개 라우트는 인증 불필요 (로그인/회원가입 페이지만)
  if (isPublicRoute(req)) {
    return;
  }

  // 나머지 모든 라우트는 인증 필요
  // Admin 라우트는 layout에서 role 체크 (middleware에서 Prisma 사용 시 문제 발생 가능)
  await auth.protect();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

