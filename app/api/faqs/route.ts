import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { getUserRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET: Get all published FAQs (public) or all FAQs (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminView = searchParams.get("admin") === "true";

    // Check if user is admin for admin view
    if (adminView) {
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
          { error: "Only admins can view all FAQs." },
          { status: 403 }
        );
      }

      // Return all FAQs for admin
      const faqs = await prisma.fAQ.findMany({
        orderBy: [
          { order: "asc" },
          { createdAt: "desc" },
        ],
      });

      return NextResponse.json(faqs);
    }

    // Return only published FAQs for public view
    const faqs = await prisma.fAQ.findMany({
      where: {
        isPublished: true,
      },
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(faqs);
  } catch (error: any) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQs." },
      { status: 500 }
    );
  }
}

// POST: Create a new FAQ (ADMIN only)
export async function POST(request: NextRequest) {
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
        { error: "Only admins can create FAQs." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { question, answer, category, order, isPublished } = body;

    // Validation
    if (!question || !question.trim()) {
      return NextResponse.json(
        { error: "Question is required." },
        { status: 400 }
      );
    }

    if (!answer || !answer.trim()) {
      return NextResponse.json(
        { error: "Answer is required." },
        { status: 400 }
      );
    }

    // Create FAQ
    const faq = await prisma.fAQ.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
        category: category?.trim() || null,
        order: order || 0,
        isPublished: isPublished !== undefined ? isPublished : true,
      },
    });

    // Revalidate paths
    revalidatePath("/qna");
    revalidatePath("/admin/faqs");

    return NextResponse.json(faq, { status: 201 });
  } catch (error: any) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create FAQ." },
      { status: 500 }
    );
  }
}

