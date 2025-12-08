import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// POST: Process report action
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  // Handle both Promise and direct params (Next.js 14 compatibility)
  const resolvedParams = await Promise.resolve(params);
  const { id } = resolvedParams;
  try {
    // Verify admin permissions
    const { userId } = await requireAdmin();

    const body = await request.json();
    const { actionType, description } = body;

    // Input validation
    if (!actionType) {
      return NextResponse.json(
        { error: "Please select an action type." },
        { status: 400 }
      );
    }

    const validActionTypes = ["HIDE", "DELETE", "WARNING", "SUSPEND", "DISMISS"];
    if (!validActionTypes.includes(actionType)) {
      return NextResponse.json(
        { error: "Invalid action type." },
        { status: 400 }
      );
    }

    // DISMISS is not in AdminActionType, so handle separately
    const needsAdminAction = actionType !== "DISMISS";

    // Fetch report
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        post: true,
        comment: true,
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Report not found." },
        { status: 404 }
      );
    }

    // Process action
    let targetUpdated = false;

    if (actionType === "HIDE") {
      // Hide post/comment
      if (report.postId) {
        await prisma.post.update({
          where: { id: report.postId },
          data: { isHidden: true },
        });
        targetUpdated = true;
      } else if (report.commentId) {
        await prisma.comment.update({
          where: { id: report.commentId },
          data: { isHidden: true },
        });
        targetUpdated = true;
      }
    } else if (actionType === "DELETE") {
      // Delete post/comment
      if (report.postId) {
        await prisma.post.update({
          where: { id: report.postId },
          data: { isDeleted: true },
        });
        targetUpdated = true;
      } else if (report.commentId) {
        await prisma.comment.update({
          where: { id: report.commentId },
          data: { isDeleted: true },
        });
        targetUpdated = true;
      }
    } else if (actionType === "SUSPEND") {
      // Suspend account (author information required)
      const authorId = report.post?.authorId || report.comment?.authorId;
      if (authorId) {
        // Change user role to VISITOR (temporary measure)
        // In practice, a separate suspension system may be needed
        await prisma.user.update({
          where: { clerkUserId: authorId },
          data: { role: "VISITOR" },
        });
        targetUpdated = true;
      }
    }
    // WARNING and DISMISS only log actions

    // Update report status
    let newStatus = report.status;
    if (actionType === "DISMISS") {
      newStatus = "DISMISSED";
    } else if (actionType !== "WARNING") {
      // WARNING only logs, no status change
      newStatus = "RESOLVED";
    } else {
      newStatus = "REVIEWED";
    }

    await prisma.report.update({
      where: { id },
      data: { status: newStatus },
    });

    // Create AdminAction log (excluding DISMISS)
    let adminAction = null;
    if (needsAdminAction) {
      adminAction = await prisma.adminAction.create({
        data: {
          reportId: id,
          adminId: userId,
          actionType: actionType as any,
          description: description?.trim() || null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      adminAction,
      targetUpdated,
      message: "Action completed successfully.",
    });
  } catch (error: any) {
    console.error("Error processing report action:", error);
    return NextResponse.json(
      {
        error: error.message || "An error occurred while processing the action.",
      },
      { status: 500 }
    );
  }
}

