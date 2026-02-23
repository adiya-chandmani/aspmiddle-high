import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const includeAll = request.nextUrl.searchParams.get("includeAll") === "true";
  const yearParam = request.nextUrl.searchParams.get("year");
  const year = yearParam ? Number(yearParam) : null;

  const records = await prisma.matriculationRecord.findMany({
    where: {
      ...(includeAll ? {} : { isPublished: true }),
      ...(year ? { year } : {}),
    },
    orderBy: [{ year: "desc" }, { order: "asc" }, { university: "asc" }],
  });

  return NextResponse.json(records);
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const year = Number(body.year);

    if (!year || Number.isNaN(year) || year < 1990 || year > 2100) {
      return NextResponse.json({ error: "Please provide a valid year." }, { status: 400 });
    }
    if (!body.university || !String(body.university).trim()) {
      return NextResponse.json({ error: "Please enter a university." }, { status: 400 });
    }

    const outcome = body.outcome === "ACCEPTED" ? "ACCEPTED" : "MATRICULATED";

    const record = await prisma.matriculationRecord.create({
      data: {
        year,
        university: String(body.university).trim(),
        outcome,
        logoUrl: body.logoUrl ? String(body.logoUrl).trim() : null,
        country: body.country ? String(body.country).trim() : null,
        studentName: body.studentName ? String(body.studentName).trim() : null,
        program: body.program ? String(body.program).trim() : null,
        note: body.note ? String(body.note).trim() : null,
        order: typeof body.order === "number" ? body.order : 0,
        isPublished: typeof body.isPublished === "boolean" ? body.isPublished : true,
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/matriculation]", error);
    if (error.message?.includes("Forbidden") || error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }
    return NextResponse.json({ error: "An error occurred while creating record." }, { status: 500 });
  }
}
