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

  const accepted = records.filter((r) => r.outcome === "ACCEPTED");
  const matriculated = records.filter((r) => r.outcome === "MATRICULATED");

  return (
    <MiddleHighHeroLayout active="matriculation">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Matriculation</h1>
          <p className="text-gray-600 mt-2">
            University placements and matriculation outcomes.
          </p>
        </div>

        {records.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-10 text-center">
            <h2 className="text-2xl font-semibold mb-3">No results published yet</h2>
            <p className="text-gray-700">Please check back soon.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Quick summary */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <p className="text-sm text-gray-600">Acceptances</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{accepted.length}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <p className="text-sm text-gray-600">Matriculations</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{matriculated.length}</p>
              </div>
            </div>

            {years.map((year) => {
              const list = records.filter((r) => r.year === year);
              const acceptedList = list.filter((r) => r.outcome === "ACCEPTED");
              const matriculatedList = list.filter((r) => r.outcome === "MATRICULATED");

              const uniqueUniversities = new Set(list.map((r) => r.university)).size;

              const Card = ({ r }: { r: (typeof records)[number] }) => (
                <div className="rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow bg-white">
                  <div className="flex items-start gap-3">
                    {r.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={r.logoUrl}
                        alt={`${r.university} logo`}
                        className="w-10 h-10 object-contain rounded bg-white border border-gray-100 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-gray-100 border border-gray-200 flex-shrink-0" />
                    )}

                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{r.university}</p>
                      {(r.country || r.program) && (
                        <p className="text-sm text-gray-600 mt-1">
                          {[r.country, r.program].filter(Boolean).join(" • ")}
                        </p>
                      )}
                      {r.studentName && (
                        <p className="text-sm text-gray-700 mt-2">
                          <span className="font-medium">Student:</span> {r.studentName}
                        </p>
                      )}

                      {r.note && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{r.note}</p>
                        </div>
                      )}

                      {r.acceptances && r.outcome === "MATRICULATED" && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                              University Acceptances
                            </p>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {r.acceptances
                              .split("\n")
                              .map((x) => x.trim())
                              .filter(Boolean)
                              .map((u, idx) => (
                                <span
                                  key={`${r.id}-acc-${idx}`}
                                  className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200"
                                >
                                  {u}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );

              return (
                <section key={year} className="bg-gray-50">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
                        <h2 className="text-2xl font-bold">Class of {year}</h2>
                        <p className="text-sm text-gray-600">
                          {list.length} total · {uniqueUniversities} universit{uniqueUniversities === 1 ? "y" : "ies"}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 space-y-10">
                      <div>
                        <div className="flex items-baseline justify-between mb-4">
                          <h3 className="text-xl font-semibold">Matriculations</h3>
                          <p className="text-sm text-gray-600">{matriculatedList.length}</p>
                        </div>
                        {matriculatedList.length === 0 ? (
                          <p className="text-sm text-gray-500">No matriculations published for this year.</p>
                        ) : (
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {matriculatedList.map((r) => (
                              <Card key={r.id} r={r} />
                            ))}
                          </div>
                        )}

                        {/* Small acceptances summary (separate ACCEPTED records) */}
                        <div className="mt-6">
                          <div className="flex items-baseline justify-between mb-2">
                            <p className="text-sm font-semibold text-gray-700">University Acceptances</p>
                            <p className="text-xs text-gray-500">{acceptedList.length}</p>
                          </div>
                          {acceptedList.length === 0 ? (
                            <p className="text-sm text-gray-500">No acceptances published for this year.</p>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {acceptedList.map((r) => (
                                <span
                                  key={r.id}
                                  className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200"
                                >
                                  {r.university}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </MiddleHighHeroLayout>
  );
}


