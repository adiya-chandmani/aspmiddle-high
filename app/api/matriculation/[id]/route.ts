import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await requireAdmin();
    const resolvedParams = await Promise.resolve(params);

    const body = await request.json();
    const year = body.year !== undefined ? Number(body.year) : undefined;

    if (year !== undefined) {
      if (!year || Number.isNaN(year) || year < 1990 || year > 2100) {
        return NextResponse.json({ error: "Please provide a valid year." }, { status: 400 });
      }
    }

    if (body.university !== undefined && !String(body.university).trim()) {
      return NextResponse.json({ error: "Please enter a university." }, { status: 400 });
    }

    const record = await prisma.matriculationRecord.update({
      where: { id: resolvedParams.id },
      data: {
        ...(year !== undefined ? { year } : {}),
        ...(body.university !== undefined ? { university: String(body.university).trim() } : {}),
        ...(body.outcome !== undefined ? { outcome: "MATRICULATED" } : {}),
        ...(body.logoUrl !== undefined ? { logoUrl: body.logoUrl ? String(body.logoUrl).trim() : null } : {}),
        ...(body.country !== undefined ? { country: body.country ? String(body.country).trim() : null } : {}),
        ...(body.studentName !== undefined
          ? { studentName: body.studentName ? String(body.studentName).trim() : null }
          : {}),
        ...(body.program !== undefined ? { program: body.program ? String(body.program).trim() : null } : {}),
        ...(body.note !== undefined ? { note: body.note ? String(body.note).trim() : null } : {}),
        ...(body.acceptances !== undefined
          ? { acceptances: body.acceptances ? String(body.acceptances) : null }
          : {}),
        ...(body.order !== undefined ? { order: typeof body.order === "number" ? body.order : Number(body.order) } : {}),
        ...(body.isPublished !== undefined ? { isPublished: Boolean(body.isPublished) } : {}),
      },
    });

    return NextResponse.json(record);
  } catch (error: any) {
    console.error("[PUT /api/matriculation/[id]]", error);
    if (error.message?.includes("Forbidden") || error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }
    return NextResponse.json({ error: "An error occurred while updating record." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await requireAdmin();
    const resolvedParams = await Promise.resolve(params);

    await prisma.matriculationRecord.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("[DELETE /api/matriculation/[id]]", error);
    if (error.message?.includes("Forbidden") || error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }
    return NextResponse.json({ error: "An error occurred while deleting record." }, { status: 500 });
  }
}
