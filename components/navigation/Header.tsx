import Image from "next/image";
import Link from "next/link";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-navy text-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-40 h-40">
              <Image
                src="/asfc.png"
                alt="ASP Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/about"
              className="text-sm font-medium text-gray-300 hover:text-orange transition-colors"
            >
              ABOUT
            </Link>
            <Link
              href="/qna"
              className="text-sm font-medium text-gray-300 hover:text-orange transition-colors"
            >
              Q&A
            </Link>
            <Link
              href="/news"
              className="text-sm font-medium text-gray-300 hover:text-orange transition-colors"
            >
              NEWS
            </Link>
            <Link
              href="/teachers"
              className="text-sm font-medium text-gray-300 hover:text-orange transition-colors"
            >
              TEACHERS
            </Link>
            <Link
              href="/club"
              className="text-sm font-medium text-gray-300 hover:text-orange transition-colors"
            >
              CLUB
            </Link>
            <Link
              href="/community"
              className="text-sm font-medium text-gray-300 hover:text-orange transition-colors"
            >
              COMMUNITY
            </Link>
          </nav>

          {/* Right Side Utilities */}
          <div className="flex items-center space-x-4">
            <SignedOut>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-orange-400 hover:text-orange-500 transition-colors"
              >
                LOG IN
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </SignedIn>
            {/* Search Icon */}
            <button
              className="p-2 text-gray-300 hover:text-white transition-colors"
              aria-label="검색"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-300 hover:text-white"
              aria-label="메뉴 열기"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

