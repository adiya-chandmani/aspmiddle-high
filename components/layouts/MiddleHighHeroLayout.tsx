import Link from "next/link";

type MiddleHighTab =
  | "about"
  | "qna"
  | "news"
  | "facultyStaff"
  | "matriculation"
  | "club"
  | "community";

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
    { key: "facultyStaff", href: "/teachers", label: "Faculty & Staff" },
    {
      key: "matriculation",
      href: "/matriculation",
      label: "Matriculation",
    },
    { key: "club", href: "/club", label: "Club" },
    { key: "community", href: "/community", label: "Community" },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full min-h-[280px] md:min-h-[380px] flex items-center">
        {/* Background with blurred text effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 text-[80px] md:text-[120px] lg:text-[160px] font-bold text-navy-200 opacity-10 blur-[1px] select-none"
            style={{ fontFamily: "serif", fontStyle: "italic" }}
          >
            MIDDLE & HIGH SCHOOL
          </div>
        </div>

        {/* Large Blue Content Block */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-navy text-white p-8 md:p-10 lg:p-12 max-w-3xl rounded-none md:rounded-lg shadow-sm">
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
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <nav className="flex items-center gap-6 overflow-x-auto whitespace-nowrap">
            {tabs.map((tab, index) => (
              <div key={tab.key} className="flex items-center gap-4">
                <Link
                  href={tab.href}
                  aria-current={active === tab.key ? "page" : undefined}
                  className={`text-sm md:text-base font-medium pb-2 border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-800 ${
                    active === tab.key
                      ? "text-navy dark:text-orange border-orange"
                      : "text-gray-700 dark:text-gray-300 border-transparent hover:text-orange hover:border-orange dark:hover:text-orange"
                  }`}
                >
                  {tab.label}
                </Link>
                {index < tabs.length - 1 && <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">|</span>}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <div className="bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-12">
          {children}
        </div>
      </div>
    </div>
  );
}
