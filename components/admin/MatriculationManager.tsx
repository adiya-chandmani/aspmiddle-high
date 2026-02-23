"use client";

import { useMemo, useState } from "react";

type MatriculationRecord = {
  id: string;
  year: number;
  university: string;
  outcome: "ACCEPTED" | "MATRICULATED";
  logoUrl: string | null;
  country: string | null;
  studentName: string | null;
  program: string | null;
  note: string | null;
  acceptances: string | null;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

function yearList(records: MatriculationRecord[]) {
  const years = Array.from(new Set(records.map((r) => r.year)));
  years.sort((a, b) => b - a);
  return years;
}

export default function MatriculationManager({
  initialRecords,
}: {
  initialRecords: MatriculationRecord[];
}) {
  const [records, setRecords] = useState<MatriculationRecord[]>(initialRecords);
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [saving, setSaving] = useState(false);

  const years = useMemo(() => yearList(records), [records]);

  const filtered = useMemo(() => {
    const list = selectedYear === "all" ? records : records.filter((r) => r.year === selectedYear);
    return [...list].sort((a, b) => (b.year - a.year) || (a.order - b.order) || a.university.localeCompare(b.university));
  }, [records, selectedYear]);

  const [form, setForm] = useState({
    year: new Date().getFullYear(),
    university: "",
    logoUrl: "",
    country: "",
    studentName: "",
    program: "",
    note: "",
    acceptances: "",
    order: 0,
    isPublished: true,
  });

  async function refresh() {
    const res = await fetch("/api/matriculation?includeAll=true");
    const data = await res.json();
    setRecords(
      data.map((r: any) => ({
        ...r,
        createdAt: new Date(r.createdAt).toISOString(),
        updatedAt: new Date(r.updatedAt).toISOString(),
      }))
    );
  }

  async function createRecord() {
    setSaving(true);
    try {
      const res = await fetch("/api/matriculation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: Number(form.year),
          university: form.university,
          logoUrl: form.logoUrl || null,
          country: form.country || null,
          studentName: form.studentName || null,
          program: form.program || null,
          note: form.note || null,
          acceptances: form.acceptances || null,
          order: Number(form.order) || 0,
          isPublished: Boolean(form.isPublished),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create record");
      }

      setForm((f) => ({
        ...f,
        university: "",
        logoUrl: "",
        country: "",
        studentName: "",
        program: "",
        note: "",
        acceptances: "",
        order: 0,
        isPublished: true,
      }));
      await refresh();
    } finally {
      setSaving(false);
    }
  }

  async function updateRecord(id: string, patch: Partial<MatriculationRecord>) {
    const res = await fetch(`/api/matriculation/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to update record");
    }
    await refresh();
  }

  async function deleteRecord(id: string) {
    if (!confirm("Delete this record?")) return;
    const res = await fetch(`/api/matriculation/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to delete record");
    }
    await refresh();
  }

  return (
    <div className="space-y-8">
      {/* Create */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add Matriculation Record</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-700 dark:text-gray-300">Year</span>
            <input
              type="number"
              className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900"
              value={form.year}
              onChange={(e) => setForm((f) => ({ ...f, year: Number(e.target.value) }))}
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700 dark:text-gray-300">University *</span>
            <input
              type="text"
              className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900"
              value={form.university}
              onChange={(e) => setForm((f) => ({ ...f, university: e.target.value }))}
              placeholder="e.g., Seoul National University"
            />
          </label>

          <div className="block">
            <span className="text-sm text-gray-700 dark:text-gray-300">Outcome</span>
            <div className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-900 px-3 py-2 text-sm text-gray-800 dark:text-gray-200">
              Matriculation
            </div>
          </div>

          <label className="block">
            <span className="text-sm text-gray-700 dark:text-gray-300">University logo URL (optional)</span>
            <input
              type="url"
              className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900"
              value={form.logoUrl}
              onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
              placeholder="https://..."
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700 dark:text-gray-300">Country</span>
            <input
              type="text"
              className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900"
              value={form.country}
              onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
              placeholder="e.g., Korea"
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700 dark:text-gray-300">Student name (optional)</span>
            <input
              type="text"
              className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900"
              value={form.studentName}
              onChange={(e) => setForm((f) => ({ ...f, studentName: e.target.value }))}
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700 dark:text-gray-300">Program (optional)</span>
            <input
              type="text"
              className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900"
              value={form.program}
              onChange={(e) => setForm((f) => ({ ...f, program: e.target.value }))}
              placeholder="e.g., Computer Science"
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700 dark:text-gray-300">Order</span>
            <input
              type="number"
              className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900"
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Note</span>
            <textarea
              className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900"
              rows={3}
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              placeholder="Optional short note (scholarship, honors, etc.)"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              University Acceptances (optional)
            </span>
            <textarea
              className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900"
              rows={3}
              value={form.acceptances}
              onChange={(e) => setForm((f) => ({ ...f, acceptances: e.target.value }))}
              placeholder="One per line (e.g., Harvard University)"
            />
            <p className="text-xs text-gray-500 mt-1">
              This will show as a small list on the Matriculation card.
            </p>
          </label>

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Published (visible on website)</span>
          </label>
        </div>

        <div className="mt-4">
          <button
            type="button"
            disabled={saving || !form.university.trim()}
            onClick={createRecord}
            className="px-4 py-2 rounded-md bg-navy text-white hover:bg-navy-800 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Add"}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Records</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Year:</span>
            <select
              className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900"
              value={selectedYear}
              onChange={(e) => {
                const v = e.target.value;
                setSelectedYear(v === "all" ? "all" : Number(v));
              }}
            >
              <option value="all">All</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 pr-3">Year</th>
                <th className="py-2 pr-3">Logo</th>
                <th className="py-2 pr-3">University</th>
                <th className="py-2 pr-3">Country</th>
                <th className="py-2 pr-3">Student</th>
                <th className="py-2 pr-3">Program</th>
                <th className="py-2 pr-3">Order</th>
                <th className="py-2 pr-3">Published</th>
                <th className="py-2 pr-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-2 pr-3">{r.year}</td>
                  <td className="py-2 pr-3">
                    <div className="flex items-center gap-2">
                      <input
                        className="w-56 rounded-md border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                        value={r.logoUrl || ""}
                        onChange={(e) =>
                          setRecords((prev) => prev.map((x) => (x.id === r.id ? { ...x, logoUrl: e.target.value } : x)))
                        }
                        onBlur={async () => {
                          try {
                            await updateRecord(r.id, { logoUrl: r.logoUrl });
                          } catch (e: any) {
                            alert(e.message);
                          }
                        }}
                        placeholder="https://..."
                      />
                      {r.logoUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.logoUrl}
                          alt="logo"
                          className="w-7 h-7 object-contain rounded bg-white border border-gray-100"
                        />
                      )}
                    </div>
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      className="w-64 rounded-md border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                      value={r.university}
                      onChange={(e) =>
                        setRecords((prev) => prev.map((x) => (x.id === r.id ? { ...x, university: e.target.value } : x)))
                      }
                      onBlur={async () => {
                        try {
                          await updateRecord(r.id, { university: r.university });
                        } catch (e: any) {
                          alert(e.message);
                        }
                      }}
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      className="w-28 rounded-md border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                      value={r.country || ""}
                      onChange={(e) =>
                        setRecords((prev) => prev.map((x) => (x.id === r.id ? { ...x, country: e.target.value } : x)))
                      }
                      onBlur={async () => {
                        try {
                          await updateRecord(r.id, { country: r.country });
                        } catch (e: any) {
                          alert(e.message);
                        }
                      }}
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      className="w-36 rounded-md border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                      value={r.studentName || ""}
                      onChange={(e) =>
                        setRecords((prev) =>
                          prev.map((x) => (x.id === r.id ? { ...x, studentName: e.target.value } : x))
                        )
                      }
                      onBlur={async () => {
                        try {
                          await updateRecord(r.id, { studentName: r.studentName });
                        } catch (e: any) {
                          alert(e.message);
                        }
                      }}
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      className="w-40 rounded-md border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                      value={r.program || ""}
                      onChange={(e) =>
                        setRecords((prev) => prev.map((x) => (x.id === r.id ? { ...x, program: e.target.value } : x)))
                      }
                      onBlur={async () => {
                        try {
                          await updateRecord(r.id, { program: r.program });
                        } catch (e: any) {
                          alert(e.message);
                        }
                      }}
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      type="number"
                      className="w-20 rounded-md border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                      value={r.order}
                      onChange={(e) =>
                        setRecords((prev) =>
                          prev.map((x) => (x.id === r.id ? { ...x, order: Number(e.target.value) } : x))
                        )
                      }
                      onBlur={async () => {
                        try {
                          await updateRecord(r.id, { order: r.order });
                        } catch (e: any) {
                          alert(e.message);
                        }
                      }}
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      type="checkbox"
                      checked={r.isPublished}
                      onChange={async (e) => {
                        const next = e.target.checked;
                        setRecords((prev) => prev.map((x) => (x.id === r.id ? { ...x, isPublished: next } : x)));
                        try {
                          await updateRecord(r.id, { isPublished: next });
                        } catch (err: any) {
                          alert(err.message);
                        }
                      }}
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <button
                      type="button"
                      className="text-red-600 hover:underline"
                      onClick={() =>
                        deleteRecord(r.id).catch((e) => {
                          alert(e.message);
                        })
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td className="py-8 text-gray-500" colSpan={9}>
                    No records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
