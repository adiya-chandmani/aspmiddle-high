import Link from "next/link";

type MiddleHighTab = "about" | "qna" | "news" | "teachers" | "club" | "community";

interface MiddleHighHeroLayoutProps {
  active?: MiddleHighTab;
  children: React.ReactNode;
}

export default function MiddleHighHeroLayout({
  active = "about",
  children,
}: MiddleHighHeroLayoutProps) {
  const tabs: { key: MiddleHighTab; href: string; label: string }[] = [
    { key: "about", href: "/about", label: "About" },
    { key: "qna", href: "/qna", label: "Q&A" },
    { key: "news", href: "/news", label: "News" },
    { key: "teachers", href: "/teachers", label: "Teachers" },
    { key: "club", href: "/club", label: "Club" },
    { key: "community", href: "/community", label: "Community" },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Hero Section with Large Blue Block */}
      <div className="relative w-full min-h-[320px] md:min-h-[520px] flex items-center">
        {/* Background with blurred text effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 text-[120px] md:text-[180px] lg:text-[220px] font-bold text-navy-200 opacity-20 blur-sm select-none"
            style={{ fontFamily: "serif", fontStyle: "italic" }}
          >
            MIDDLE & HIGH SCHOOL
          </div>
        </div>

        {/* Large Blue Content Block */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-navy text-white p-10 md:p-14 lg:p-16 max-w-2xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
              MIDDLE & HIGH SCHOOL
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-light">
              Middle & High School Division
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Links */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 md:px-8 py-6">
          <nav className="flex flex-wrap items-center gap-4 md:gap-6">
            {tabs.map((tab, index) => (
              <div key={tab.key} className="flex items-center gap-4">
                <Link
                  href={tab.href}
                  className={`text-sm md:text-base font-medium pb-2 border-b-2 transition-colors ${
                    active === tab.key
                      ? "text-navy border-orange"
                      : "text-gray-700 border-transparent hover:text-orange hover:border-orange"
                  }`}
                >
                  {tab.label}
                </Link>
                {index < tabs.length - 1 && <span className="text-gray-300 hidden sm:inline">|</span>}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <div className="bg-gray-50">{children}</div>
    </div>
  );
}


