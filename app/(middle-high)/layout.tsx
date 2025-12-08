import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";

// Force dynamic rendering (requires authentication)
export const dynamic = 'force-dynamic';

export default async function MiddleHighLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 중고등학교 웹사이트는 로그인 필요
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

