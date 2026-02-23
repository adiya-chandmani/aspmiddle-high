import MatriculationManager from "@/components/admin/MatriculationManager";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminMatriculationPage() {
  const records = await prisma.matriculationRecord.findMany({
    orderBy: [{ year: "desc" }, { order: "asc" }, { university: "asc" }],
  });

  const serialized = records.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Matriculation</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage matriculation outcomes shown on the public website. Add a new record per placement,
          then publish/unpublish as needed.
        </p>
      </div>

      <MatriculationManager initialRecords={serialized} />
    </div>
  );
}
