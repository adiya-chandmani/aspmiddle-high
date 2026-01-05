import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { getUserRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET: Get a single FAQ by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    const faq = await prisma.fAQ.findUnique({
      where: { id },
    });

    if (!faq) {
      return NextResponse.json(
        { error: "FAQ not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(faq);
  } catch (error: any) {
    console.error("Error fetching FAQ:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQ." },
      { status: 500 }
    );
  }
}

// PUT: Update an FAQ (ADMIN only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const role = await getUserRole(userId);
    if (role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can update FAQs." },
        { status: 403 }
      );
    }

    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    const body = await request.json();
    const { question, answer, category, order, isPublished } = body;

    // Validation
    if (question !== undefined && !question.trim()) {
      return NextResponse.json(
        { error: "Question cannot be empty." },
        { status: 400 }
      );
    }

    if (answer !== undefined && !answer.trim()) {
      return NextResponse.json(
        { error: "Answer cannot be empty." },
        { status: 400 }
      );
    }

    // Update FAQ
    const faq = await prisma.fAQ.update({
      where: { id },
      data: {
        ...(question !== undefined && { question: question.trim() }),
        ...(answer !== undefined && { answer: answer.trim() }),
        ...(category !== undefined && { category: category?.trim() || null }),
        ...(order !== undefined && { order }),
        ...(isPublished !== undefined && { isPublished }),
      },
    });

    // Revalidate paths
    revalidatePath("/qna");
    revalidatePath("/admin/faqs");

    return NextResponse.json(faq);
  } catch (error: any) {
    console.error("Error updating FAQ:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "FAQ not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to update FAQ." },
      { status: 500 }
    );
  }
}

// DELETE: Delete an FAQ (ADMIN only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const role = await getUserRole(userId);
    if (role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can delete FAQs." },
        { status: 403 }
      );
    }

    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    await prisma.fAQ.delete({
      where: { id },
    });

    // Revalidate paths
    revalidatePath("/qna");
    revalidatePath("/admin/faqs");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting FAQ:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "FAQ not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to delete FAQ." },
      { status: 500 }
    );
  }
}

