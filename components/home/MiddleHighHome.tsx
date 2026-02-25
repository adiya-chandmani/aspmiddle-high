import Link from "next/link";

const quickLinks = [
  { href: "/about", label: "Overview" },
  { href: "/teachers", label: "Leadership" },
  { href: "/staff", label: "Admissions" },
  { href: "/about", label: "Mission & Vision" },
  { href: "/about", label: "Strategic Plan" },
];

const slides = [
  {
    title: "A student-centered learning environment",
    body: "A warm, safe, and academically ambitious community.",
  },
  {
    title: "World-class campus & programs",
    body: "Athletics, academics, and the arts—supported by modern facilities.",
  },
  {
    title: "Boarding & day school options",
    body: "Flexible paths for grades JK–12, boarding starting in grade 7.",
  },
];

export default function MiddleHighHome() {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* HERO / INTRO */}
      <section className="border-b border-gray-200/70 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-start">
            <div className="space-y-5">
              <p className="text-sm font-semibold tracking-wide text-orange">
                Korea International School-style layout
              </p>
              <h1 className="text-3xl md:text-5xl font-bold text-navy dark:text-white leading-tight">
                Middle &amp; High School
              </h1>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                A friendly, student-centered environment with a mission to inspire
                each student to be positive, responsible, and well-rounded—prepared
                to adapt and become successful leaders anywhere in the world.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We look forward to showing you around our campus, helping you learn
                more about our programs, and supporting your family in choosing the
                best school for your child.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/staff"
                  className="inline-flex items-center justify-center rounded-md bg-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
                >
                  Apply Now
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 px-5 py-2.5 text-sm font-semibold text-navy dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* QUICK LINKS (right rail) */}
            <aside className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
                <p className="text-sm font-semibold text-navy dark:text-white">
                  Quick Links
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Fast navigation to key pages
                </p>
              </div>
              <div className="p-3">
                <div className="grid gap-1">
                  {quickLinks.map((l) => (
                    <Link
                      key={l.href + l.label}
                      href={l.href}
                      className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-orange/10 dark:hover:bg-orange/15 hover:text-navy dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
                    >
                      <span>{l.label}</span>
                      <span aria-hidden className="text-gray-400">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* SLIDER */}
      <section className="bg-gray-50 dark:bg-gray-950 border-b border-gray-200/70 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-12">
          <div className="flex items-end justify-between gap-6 mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-navy dark:text-white">
                Highlights
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                A simple, clean slider-style section (static for now)
              </p>
            </div>
            <div className="hidden md:flex gap-2">
              <button
                type="button"
                className="h-9 w-9 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-900 transition-colors"
                aria-label="Previous"
                disabled
                title="Static mock"
              >
                ‹
              </button>
              <button
                type="button"
                className="h-9 w-9 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-900 transition-colors"
                aria-label="Next"
                disabled
                title="Static mock"
              >
                ›
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {slides.map((s) => (
              <div
                key={s.title}
                className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-6"
              >
                <p className="text-xs font-semibold tracking-wide text-orange">
                  Slide
                </p>
                <h3 className="mt-2 text-lg font-bold text-navy dark:text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLICATIONS SECTION */}
      <section className="border-b border-gray-200/70 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-12">
          <div className="grid gap-6 lg:grid-cols-2 items-start">
            <div className="space-y-3">
              <h2 className="text-xl md:text-2xl font-bold text-navy dark:text-white">
                Applications for the 2025–26 school year
              </h2>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                JK–12 curriculum, diverse programs, and a supportive community.
                Apply now to begin your journey.
              </p>
              <div>
                <Link
                  href="/staff"
                  className="inline-flex items-center justify-center rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-navy-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
                >
                  apply now
                </Link>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-orange-50 dark:bg-orange/10 p-6">
              <p className="text-sm font-semibold text-navy dark:text-white">
                Tip
              </p>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Keep this section short and action-oriented. Use one primary CTA,
                and avoid long paragraphs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL FEED */}
      <section className="bg-gray-50 dark:bg-gray-950 border-b border-gray-200/70 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-12">
          <div className="flex items-center justify-between gap-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-navy dark:text-white">
                Our students create a vibrant and inclusive community
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Social feed placeholder (grid of latest posts)
              </p>
            </div>
            <a
              href="#"
              className="text-sm font-semibold text-orange hover:text-orange-700 transition-colors"
            >
              Follow on Instagram
            </a>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden"
              >
                <div className="aspect-[16/10] bg-gray-100 dark:bg-gray-800" />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Instagram · {idx % 3 === 0 ? "1 day ago" : idx % 3 === 1 ? "6 days ago" : "2 weeks ago"}
                    </p>
                    <button
                      type="button"
                      className="text-xs font-semibold text-navy dark:text-gray-200 hover:text-orange transition-colors"
                    >
                      Share
                    </button>
                  </div>
                  <p className="mt-2 text-sm font-medium text-navy dark:text-white line-clamp-2">
                    Student life highlight #{idx + 1}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-900 transition-colors"
            >
              Load More
            </button>
          </div>
        </div>
      </section>

      {/* CAMPUS EXPERIENCE */}
      <section className="border-b border-gray-200/70 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] items-start">
            <div className="space-y-3">
              <h2 className="text-xl md:text-2xl font-bold text-navy dark:text-white">
                The Campus Experience
              </h2>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                A globally-minded education in a nurturing environment—academic
                growth, personal development, and holistic education.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Through extracurricular activities and strong communication with
                families, we support well-rounded development.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800">
              <div className="aspect-[16/9]" />
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Are you ready to take the next step?
              </h2>
              <p className="mt-2 text-white/80 leading-relaxed">
                Learn more about our programs and join our community.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/staff"
                className="inline-flex items-center justify-center rounded-md bg-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
              >
                Apply Now
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-md border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
              >
                Overview
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
