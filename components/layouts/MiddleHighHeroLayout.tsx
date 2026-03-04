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
      <section className="relative isolate overflow-hidden bg-navy-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(252,131,43,0.35),transparent_38%),radial-gradient(circle_at_84%_10%,rgba(135,151,175,0.3),transparent_34%),linear-gradient(135deg,#141925_0%,#1e263a_52%,#29324f_100%)]" />
        <div className="absolute -left-20 top-10 h-56 w-56 rounded-[var(--radius-full)] bg-orange/40 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-[var(--radius-full)] bg-navy-400/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20 lg:py-24">
          <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="inline-flex items-center rounded-[var(--radius-full)] border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.22em] text-white/90">
                ASP MIDDLE & HIGH
              </p>
              <h1 className="mt-4 max-w-4xl text-hero font-bold text-white">
                Build a Future-Ready Global Path
              </h1>
              <p className="mt-5 max-w-2xl text-subhead text-white/85">
                English immersion, STEM rigor, and university-ready mentoring in one focused division.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/about"
                  className="cursor-pointer rounded-[var(--radius-md)] bg-orange px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
                >
                  Explore Division
                </Link>
                <Link
                  href="/matriculation"
                  className="cursor-pointer rounded-[var(--radius-md)] border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
                >
                  See Matriculation
                </Link>
              </div>
            </div>

            <div className="relative w-full">
              <div className="rounded-[var(--radius-lg)] border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
                <p className="text-xs font-semibold tracking-[0.24em] text-white/80">WHY ASP</p>
                <h2 className="mt-3 text-headline font-semibold text-white">Clear Direction, Strong Outcomes</h2>
                <ul className="mt-5 space-y-3 text-sm text-white/90">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-[var(--radius-full)] bg-orange" />
                    <span>Focused preparation for international academic pathways</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-[var(--radius-full)] bg-orange" />
                    <span>Project-based STEM practice with critical thinking emphasis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-[var(--radius-full)] bg-orange" />
                    <span>Personalized coaching from classroom to admissions stage</span>
                  </li>
                </ul>
              </div>
              <div className="absolute -bottom-4 -left-3 rounded-[var(--radius-md)] border border-orange-200/60 bg-orange/25 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-orange-100 backdrop-blur-md">
                STEM + ENGLISH + MENTORING
              </div>
            </div>
          </div>
        </div>
      </section>

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
