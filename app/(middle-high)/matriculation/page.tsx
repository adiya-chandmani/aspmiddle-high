import MiddleHighHeroLayout from "@/components/layouts/MiddleHighHeroLayout";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Matriculation | School Web Platform",
  description: "Matriculation outcomes",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MatriculationPage() {
  const records = await prisma.matriculationRecord.findMany({
    where: { isPublished: true },
    orderBy: [{ year: "desc" }, { order: "asc" }, { university: "asc" }],
  });

  const years = Array.from(new Set(records.map((r) => r.year))).sort((a, b) => b - a);

  return (
    <MiddleHighHeroLayout active="matriculation">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="inline-flex items-center gap-3">
            <h1 className="text-4xl font-bold text-navy">Matriculation</h1>
            <span className="h-2 w-2 rounded-full bg-orange" />
          </div>
          <p className="mt-2 max-w-2xl text-muted">
            University placements and matriculation outcomes.
          </p>
          <div className="mt-4 h-1 w-20 rounded-full bg-orange" />
        </div>

        {records.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-navy-100 bg-white p-10 text-center shadow-sm">
            <h2 className="mb-3 text-2xl font-semibold text-navy">No results published yet</h2>
            <p className="text-gray-700">Please check back soon.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {years.map((year) => {
              const list = records
                .filter((r) => r.year === year)
                .filter((r) => r.outcome === "MATRICULATED");

              const Card = ({ r }: { r: (typeof records)[number] }) => (
                <div className="w-full max-w-[320px] rounded-[var(--radius-lg)] border border-navy-100 bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-24 flex-shrink-0">
                      {r.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.logoUrl}
                          alt={`${r.university} logo`}
                          className="h-16 w-16 rounded-[var(--radius-sm)] border border-navy-100 bg-white object-contain"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-[var(--radius-sm)] border border-navy-100 bg-navy-50" />
                      )}

                      {r.note && (
                        <div className="mt-2 rounded-[var(--radius-sm)] bg-navy-50 px-2 py-1.5">
                          <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">{r.note}</p>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-navy">{r.university}</p>
                      {(r.country || r.program) && (
                        <p className="mt-1 text-sm text-muted">
                          {[r.country, r.program].filter(Boolean).join(" • ")}
                        </p>
                      )}
                      {r.studentName && (
                        <p className="mt-2 text-sm text-gray-700">
                          <span className="font-medium">Student:</span> {r.studentName}
                        </p>
                      )}

                      {r.acceptances && r.outcome === "MATRICULATED" && (
                        <div className="mt-2 border-t border-navy-50 pt-2">
                          <p className="text-sm font-semibold uppercase tracking-wide text-navy">
                            University Acceptances
                          </p>
                          <ul className="mt-2 space-y-1">
                            {r.acceptances
                              .split("\n")
                              .map((x) => x.trim())
                              .filter(Boolean)
                              .map((u, accIdx) => (
                                <li key={`${r.id}-acc-${accIdx}`} className="text-sm text-gray-700">
                                  - {u}
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );

              return (
                <details key={year} className="group rounded-[var(--radius-lg)] border border-navy-100 bg-white shadow-sm">
                  <summary className="list-none cursor-pointer p-5 [&::-webkit-details-marker]:hidden">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-2xl font-bold text-navy">Class of {year}</h2>
                      <svg
                        className="h-5 w-5 text-navy transition-transform duration-200 group-open:rotate-180"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 011.1 1.02l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </summary>

                  <div className="border-t border-navy-50 p-5">
                    <div className="mb-4 flex items-baseline justify-between">
                      <h3 className="text-xl font-semibold text-navy">Matriculations</h3>
                      <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-sm text-navy">
                        {list.length}
                      </span>
                    </div>

                    {list.length === 0 ? (
                      <p className="text-sm text-subtle">No matriculations published for this year.</p>
                    ) : (
                      <div className="grid justify-items-start gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {list.map((r) => (
                          <Card key={r.id} r={r} />
                        ))}
                      </div>
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </div>
    </MiddleHighHeroLayout>
  );
}
