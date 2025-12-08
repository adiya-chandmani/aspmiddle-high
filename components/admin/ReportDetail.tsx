"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ReportDetailProps {
  report: any;
}

export default function ReportDetail({ report }: ReportDetailProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionType, setActionType] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  const target = report.post || report.comment;
  const author = report.post?.author || report.comment?.author;
  const isPost = !!report.post;

  const handleAction = async (type: string) => {
    if (!confirm(`Are you sure you want to take ${getActionLabel(type)} action?`)) {
      return;
    }

    setIsProcessing(true);
    setActionType(type);

    try {
      const response = await fetch(`/api/admin/reports/${report.id}/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          actionType: type,
          description: description.trim() || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to process action." }));
        throw new Error(errorData.error || "Failed to process action.");
      }

      alert("Action completed successfully.");
      router.refresh();
    } catch (error: any) {
      console.error("Error processing action:", error);
      alert(error.message || "An error occurred while processing action.");
    } finally {
      setIsProcessing(false);
      setActionType(null);
      setDescription("");
    }
  };

  const getActionLabel = (type: string) => {
    switch (type) {
      case "HIDE":
        return "Hide";
      case "DELETE":
        return "Delete";
      case "WARNING":
        return "Warning";
      case "SUSPEND":
        return "Suspend Account";
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-red-100 text-red-800";
      case "REVIEWED":
        return "bg-yellow-100 text-yellow-800";
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      case "DISMISSED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "REVIEWED":
        return "Under Review";
      case "RESOLVED":
        return "Resolved";
      case "DISMISSED":
        return "Dismissed";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Report Information
            </h3>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                  report.status
                )}`}
              >
                {getStatusLabel(report.status)}
              </span>
              <span className="text-sm text-gray-500">
                Report Count: {report.reportCount}
              </span>
            </div>
          </div>
          <Link
            href="/admin/reports"
            className="text-sm text-gray-600 hover:text-orange"
          >
            ← Back to List
          </Link>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Report Type</label>
            <p className="mt-1 text-gray-900">{isPost ? "Post" : "Comment"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Reason</label>
            <p className="mt-1 text-gray-900 whitespace-pre-wrap">{report.reason}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Reporter</label>
            <p className="mt-1 text-gray-900">
              {report.reporter.nickname || report.reporter.name || "Anonymous"} (
              {report.reporter.email || "No email"})
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Report Date</label>
            <p className="mt-1 text-gray-900">
              {new Date(report.createdAt).toLocaleString("en-US")}
            </p>
          </div>
        </div>
      </div>

      {/* Author Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Author Information (Internal)
        </h3>
        {author ? (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-gray-900">
                {author.nickname || author.name || "Anonymous"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Clerk User ID
              </label>
              <p className="mt-1 text-gray-900 font-mono text-sm">
                {author.clerkUserId}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Role</label>
              <p className="mt-1 text-gray-900">{author.role}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-gray-900">
                {author.email || "No email"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Author information not found.</p>
        )}
      </div>

      {/* Reported Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Reported {isPost ? "Post" : "Comment"} Content
        </h3>
        {isPost ? (
          <div>
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">{report.post.title}</h4>
              <div
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: report.post.content }}
              />
            </div>
            <Link
              href={`/community/student/${report.post.id}`}
              target="_blank"
              className="text-sm text-orange hover:text-orange-700"
            >
              View Original Post →
            </Link>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <p className="text-gray-700 whitespace-pre-wrap">
                {report.comment.content}
              </p>
            </div>
            {report.comment.post && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Original Post:</p>
                <Link
                  href={`/community/student/${report.comment.post.id}`}
                  target="_blank"
                  className="text-sm text-orange hover:text-orange-700"
                >
                  {report.comment.post.title} →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action History */}
      {report.adminActions.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Action History</h3>
          <div className="space-y-3">
            {report.adminActions.map((action: any) => (
              <div
                key={action.id}
                className="border-l-4 border-orange pl-4 py-2 bg-gray-50 rounded"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      {getActionLabel(action.actionType)}
                    </p>
                    {action.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {action.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{action.admin.name || "Admin"}</p>
                    <p>
                      {new Date(action.createdAt).toLocaleString("en-US")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Take Action</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action Reason (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-navy focus:outline-none"
              rows={3}
              placeholder="Enter action reason..."
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleAction("HIDE")}
              disabled={isProcessing}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing && actionType === "HIDE" ? "Processing..." : "Hide"}
            </button>
            <button
              onClick={() => handleAction("DELETE")}
              disabled={isProcessing}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing && actionType === "DELETE" ? "Processing..." : "Delete"}
            </button>
            <button
              onClick={() => handleAction("WARNING")}
              disabled={isProcessing}
              className="px-4 py-2 bg-orange text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing && actionType === "WARNING" ? "Processing..." : "Warning"}
            </button>
            <button
              onClick={() => handleAction("SUSPEND")}
              disabled={isProcessing}
              className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing && actionType === "SUSPEND" ? "Processing..." : "Suspend Account"}
            </button>
            <button
              onClick={() => handleAction("DISMISS")}
              disabled={isProcessing}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing && actionType === "DISMISS" ? "Processing..." : "Dismiss"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

