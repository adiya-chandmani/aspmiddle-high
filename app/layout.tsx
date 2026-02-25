import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "School Web Platform",
  description: "학교 웹사이트 및 학생 커뮤니티 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ko" className={notoSansKr.variable}>
        <body className="font-sans antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}

