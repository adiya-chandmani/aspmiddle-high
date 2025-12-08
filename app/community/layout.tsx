import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { getCurrentUserRole } from "@/lib/auth";
import CommunityNav from "@/components/community/CommunityNav";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const role = await getCurrentUserRole();
  const email = user?.emailAddresses[0]?.emailAddress || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-navy-50/30 to-gray-100 relative">
      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 블러 처리된 배경 텍스트 */}
        <div className="absolute right-0 top-1/4 text-[200px] md:text-[300px] lg:text-[400px] font-bold text-navy-100/20 blur-sm select-none" style={{ fontFamily: "serif", fontStyle: "italic" }}>
          COMMUNITY
        </div>
        {/* 좌측 상단 장식 */}
        <div className="absolute left-0 top-0 w-64 h-64 bg-orange-100/20 rounded-full blur-3xl"></div>
        {/* 우측 하단 장식 */}
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-navy-100/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* 헤더 섹션 - 공식 웹사이트 스타일 */}
        <div className="mb-8 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden backdrop-blur-sm">
          <div className="bg-navy text-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-1">Student Community</h1>
              </div>
              </div>
              {/* 계정 정보 */}
              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium">{user?.firstName || user?.emailAddresses[0]?.emailAddress || "사용자"}</p>
                  <p className="text-xs text-navy-200">{email}</p>
                  {role && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-orange bg-opacity-20 text-white rounded">
                      {role}
                    </span>
                  )}
                </div>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 border-2 border-white",
                    },
                  }}
                />
              </div>
            </div>
          </div>
          <CommunityNav />
        </div>
        {children}
      </div>
    </div>
  );
}

