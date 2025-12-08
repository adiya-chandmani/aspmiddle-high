"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface TeacherData {
  id: string;
  name: string;
  subject?: string | null;
  email?: string | null;
  bio?: string | null;
  profileImage?: string | null;
}

interface TeacherProfileEditorProps {
  userRole?: string;
  teacherId?: string; // Admin/Staff가 다른 선생님 프로필 편집 시 사용
  isAdminEdit?: boolean; // Admin/Staff가 편집하는지 여부
}

export default function TeacherProfileEditor({ 
  userRole, 
  teacherId, 
  isAdminEdit = false 
}: TeacherProfileEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<TeacherData>({
    id: "",
    name: "",
    subject: "",
    email: "",
    bio: "",
    profileImage: "",
  });
  const [userId, setUserId] = useState<string>(""); // 새로운 teacher 추가 시 사용할 userId

  const fetchTeacherData = useCallback(async () => {
    try {
      setLoading(true);
      // Admin/Staff가 다른 선생님 프로필을 편집하는 경우
      const apiUrl = isAdminEdit && teacherId 
        ? `/api/teachers/${teacherId}`
        : "/api/teachers/me";
      
      const response = await fetch(apiUrl, {
        cache: "no-store", // 캐시 사용 안 함으로 즉시 최신 데이터 가져오기
      });
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Only teachers can access this page.");
        }
        throw new Error("Failed to load teacher information.");
      }
      const data = await response.json();
      
      // 프로필이 없으면 빈 폼으로 시작 (새로 추가 가능)
      if (!data) {
        setFormData({
          id: "",
          name: "",
          subject: "",
          email: "",
          bio: "",
          profileImage: "",
        });
      } else {
        setFormData({
          id: data.id || "",
          name: data.name || "",
          subject: data.subject || "",
          email: data.email || "",
          bio: data.bio || "",
          profileImage: data.profileImage || "",
        });
      }
    } catch (error: any) {
      console.error("Error fetching teacher data:", error);
      setError(error.message || "An error occurred while loading information.");
    } finally {
      setLoading(false);
    }
  }, [teacherId, isAdminEdit]);

  useEffect(() => {
    fetchTeacherData();
  }, [fetchTeacherData]);

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image.");
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, profileImage: data.url }));
    } catch (error: any) {
      console.error("Error uploading image:", error);
      alert(error.message || "Failed to upload image.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      // Admin/Staff가 다른 선생님 프로필을 편집하는 경우
      const apiUrl = isAdminEdit && teacherId 
        ? `/api/teachers/${teacherId}`
        : "/api/teachers/me";
      
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // 캐시 사용 안 함
        body: JSON.stringify({
          name: formData.name,
          subject: formData.subject,
          email: formData.email,
          bio: formData.bio,
          profileImage: formData.profileImage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to update profile." }));
        throw new Error(errorData.error || "Failed to update profile.");
      }

      const updatedData = await response.json();
      
      // 즉시 리다이렉트 (성공 메시지 없이 바로 이동)
      const redirectPath = isAdminEdit ? "/admin/teachers" : "/teachers";
      router.push(redirectPath);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setError(error.message || "An error occurred while updating profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this profile? This action cannot be undone.")) {
      return;
    }

    setDeleting(true);
    setError(null);
    setSuccess(false);

    try {
      // Admin/Staff가 다른 선생님 프로필을 삭제하는 경우
      const apiUrl = isAdminEdit && teacherId 
        ? `/api/teachers/${teacherId}`
        : "/api/teachers/me";
      
      const response = await fetch(apiUrl, {
        method: "DELETE",
        cache: "no-store", // 캐시 사용 안 함
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to delete profile." }));
        throw new Error(errorData.error || "Failed to delete profile.");
      }

      // 즉시 리다이렉트 (성공 메시지 없이 바로 이동)
      const redirectPath = isAdminEdit ? "/admin/teachers" : "/teachers";
      router.push(redirectPath);
    } catch (error: any) {
      console.error("Error deleting profile:", error);
      setError(error.message || "An error occurred while deleting profile.");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading information...</p>
        </div>
      </div>
    );
  }

  const isNewProfile = !formData.id;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      {isNewProfile && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Add New Profile</p>
          <p className="text-sm mt-1">No profile has been registered yet. Enter your information to add a profile.</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User ID (새로운 teacher 추가 시에만 표시) */}
        {isAdminEdit && !teacherId && (
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
              User ID (Clerk User ID) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-navy focus:outline-none"
              placeholder="Enter Clerk User ID"
              required={isAdminEdit && !teacherId}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the Clerk User ID of the user you want to create a teacher profile for.
            </p>
          </div>
        )}

        {/* 프로필 이미지 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Image
          </label>
          <div className="flex items-center gap-4">
            {formData.profileImage ? (
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                <Image
                  src={formData.profileImage}
                  alt="Profile"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-24 h-24 bg-navy rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {formData.name[0]?.toUpperCase() || "T"}
                </span>
              </div>
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload(file);
                  }
                }}
                className="text-sm text-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">
                You can upload an image or enter a URL directly.
              </p>
            </div>
          </div>
          <input
            type="text"
            value={formData.profileImage || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, profileImage: e.target.value }))}
            className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-navy focus:outline-none"
            placeholder="Or enter image URL (https://example.com/image.jpg)"
          />
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-navy focus:outline-none"
            placeholder="Enter name"
            required
          />
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={formData.subject || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-navy focus:outline-none"
            placeholder="e.g., Math, English, Science"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-navy focus:outline-none"
            placeholder="Enter email"
          />
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            value={formData.bio || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
            rows={6}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-navy focus:outline-none"
            placeholder="Enter a brief introduction about yourself"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center pt-4">
          {/* Delete button (shown for ADMIN, STAFF when profile exists, or TEACHER for their own profile) */}
          {!isNewProfile && (
            (isAdminEdit && (userRole === "ADMIN" || userRole === "STAFF")) ||
            (!isAdminEdit && (userRole === "TEACHER" || userRole === "ADMIN" || userRole === "STAFF"))
          ) && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {deleting ? "Deleting..." : "Delete Profile"}
            </button>
          )}
          <div className="flex justify-end gap-3 ml-auto">
            <button
              type="button"
              onClick={() => router.push(isAdminEdit ? "/admin/teachers" : "/teachers")}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-orange text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {saving ? (isNewProfile ? "Adding..." : "Saving...") : (isNewProfile ? "Add Profile" : "Save")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

