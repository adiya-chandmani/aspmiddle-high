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
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Matriculation</h1>
          <p className="text-gray-600 mt-2">
            University placements and matriculation outcomes.
          </p>
        </div>

        {records.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-10 text-center">
            <h2 className="text-2xl font-semibold mb-3">No results published yet</h2>
            <p className="text-gray-700">
              Please check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {years.map((year) => {
              const list = records.filter((r) => r.year === year);
              const uniqueUniversities = new Set(list.map((r) => r.university)).size;
              return (
                <section key={year} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
                      <h2 className="text-2xl font-bold">Class of {year}</h2>
                      <p className="text-sm text-gray-600">
                        {list.length} placement{list.length === 1 ? "" : "s"} · {uniqueUniversities} universit{uniqueUniversities === 1 ? "y" : "ies"}
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {list.map((r) => (
                        <div key={r.id} className="rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-gray-900">{r.university}</p>
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
                            </div>
                          </div>

                          {r.note && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                {r.note}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
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


