"use client";

import Image from "next/image";
import Link from "next/link";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    // Close menus when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };

    if (isSettingsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSettingsOpen]);

  useEffect(() => {
    // Close mobile menu on route change-like interactions (basic escape hatch)
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-navy dark:bg-gray-900 text-white shadow-sm">
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
              FACULTY &amp; STAFF
            </Link>
            <Link
              href="/staff"
              className="text-sm font-medium text-gray-300 hover:text-orange transition-colors"
            >
              MATRICULATION
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
            
            {/* Settings Icon with Dropdown */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="p-2 text-gray-300 hover:text-white transition-colors"
                aria-label="Settings"
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
                  <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </button>

              {/* Settings Dropdown */}
              {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Settings</p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
                  >
                    <span>Theme</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {isDarkMode ? "Dark" : "Light"}
                      </span>
                      {isDarkMode ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                      )}
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden p-2 text-gray-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
              aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
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

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav
            id="mobile-nav"
            className="md:hidden border-t border-white/10 py-3"
          >
            <div className="grid gap-1">
              {[
                { href: "/about", label: "ABOUT" },
                { href: "/qna", label: "Q&A" },
                { href: "/news", label: "NEWS" },
                { href: "/teachers", label: "FACULTY & STAFF" },
                { href: "/staff", label: "MATRICULATION" },
                { href: "/club", label: "CLUB" },
                { href: "/community", label: "COMMUNITY" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-2 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

