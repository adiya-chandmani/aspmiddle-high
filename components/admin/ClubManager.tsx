"use client";

import { useMemo, useState } from "react";
import RichTextEditor from "./RichTextEditor";

export interface ClubArticle {
  id: string;
  title: string;
  summary?: string | null;
  content: string;
  section: string;
  coverImage?: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ClubManagerProps {
  initialArticles: ClubArticle[];
}

const sectionPresets = [
  "VEX",
  "Code Combat",
  "News Paper",
  "Chess",
  "Band",
  "AMC 8",
  "Biology",
  "Model UN",
  "Public Speaking",
  "HSK 3rd",
  "Student Government",
  "Sat Math",
  "NHS",
  "Study Hall",
];

const defaultFormState = {
  title: "",
  summary: "",
  content: "",
  section: "VEX",
  coverImage: "",
  order: 0,
  isActive: true,
};

export default function ClubManager({ initialArticles }: ClubManagerProps) {
  const [articles, setArticles] = useState<ClubArticle[]>(initialArticles);
  const [formState, setFormState] = useState(defaultFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const groupedSections = useMemo(() => {
    const map = new Map<string, number>();
    articles.forEach((article) => {
      map.set(article.section, (map.get(article.section) || 0) + 1);
    });
    return Array.from(map.entries());
  }, [articles]);

  const resetForm = () => {
    setFormState(defaultFormState);
    setEditingId(null);
  };

  const handleEdit = (article: ClubArticle) => {
    setFormState({
      title: article.title,
      summary: article.summary || "",
      content: article.content,
      section: article.section,
      coverImage: article.coverImage || "",
      order: article.order,
      isActive: article.isActive,
    });
    setEditingId(article.id);
  };

  const handleSave = async () => {
    if (!formState.title.trim()) {
      alert("Please enter a title.");
      return;
    }
    if (!formState.content || formState.content.replace(/<[^>]*>/g, "").trim().length === 0) {
      alert("Please enter content.");
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        title: formState.title.trim(),
        summary: formState.summary.trim() || null,
        content: formState.content,
        section: formState.section.trim() || "General",
        coverImage: formState.coverImage.trim() || null,
        order: Number(formState.order) || 0,
        isActive: formState.isActive,
      };
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/clubs/${editingId}` : "/api/clubs";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to save." }));
        throw new Error(errorData.error || "Failed to save.");
      }
      const saved = await response.json();
      setArticles((prev) =>
        editingId ? prev.map((item) => (item.id === saved.id ? saved : item)) : [...prev, saved]
      );
      resetForm();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this content?")) return;
    setIsDeleting(id);
    try {
      const response = await fetch(`/api/clubs/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to delete." }));
        throw new Error(errorData.error || "Failed to delete.");
      }
      setArticles((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) {
        resetForm();
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "An error occurred while deleting.");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {editingId ? "Edit Club Section" : "Create Club Section"}
        </h3>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formState.title}
              onChange={(e) => setFormState((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-navy dark:focus:ring-orange focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter club title"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section</label>
              <select
                value={formState.section}
                onChange={(e) => setFormState((prev) => ({ ...prev, section: e.target.value }))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-navy dark:focus:ring-orange focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {sectionPresets.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order</label>
              <input
                type="number"
                value={formState.order}
                onChange={(e) => setFormState((prev) => ({ ...prev, order: Number(e.target.value) }))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-navy dark:focus:ring-orange focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Summary</label>
            <textarea
              value={formState.summary}
              onChange={(e) => setFormState((prev) => ({ ...prev, summary: e.target.value }))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-navy dark:focus:ring-orange focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              rows={2}
              placeholder="Enter brief description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Image</label>
            <div className="space-y-2">
              <input
                type="text"
                value={formState.coverImage}
                onChange={(e) => setFormState((prev) => ({ ...prev, coverImage: e.target.value }))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-navy dark:focus:ring-orange focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="https://example.com/image.jpg 또는 파일 업로드"
              />
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 5 * 1024 * 1024) {
                      alert("Image size must be 5MB or less.");
                      return;
                    }
                    setIsUploading(true);
                    try {
                      const formData = new FormData();
                      formData.append("file", file);
                      const response = await fetch("/api/upload", {
                        method: "POST",
                        body: formData,
                      });
                      if (!response.ok) {
                        throw new Error("Image upload failed");
                      }
                      const data = await response.json();
                      setFormState((prev) => ({ ...prev, coverImage: data.url }));
                    } catch (error: any) {
                      alert(error.message || "Failed to upload image.");
                    } finally {
                      setIsUploading(false);
                    }
                  }}
                  className="hidden"
                  id="club-cover-upload"
                />
                <label
                  htmlFor="club-cover-upload"
                  className="px-4 py-2 text-sm font-medium text-navy border border-navy rounded-md hover:bg-navy-50 cursor-pointer transition-colors"
                >
                  {isUploading ? "Uploading..." : "Select File"}
                </label>
                {formState.coverImage && (
                  <button
                    type="button"
                    onClick={() => setFormState((prev) => ({ ...prev, coverImage: "" }))}
                    className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              {formState.coverImage && (
                <div className="relative w-full h-32 border border-gray-300 rounded-md overflow-hidden">
                  <img
                    src={formState.coverImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              If no cover image is provided, the first image from the content will be used automatically.
            </p>
          </div>
          <RichTextEditor
            label="Content"
            value={formState.content}
            onChange={(value) => setFormState((prev) => ({ ...prev, content: value }))}
          />
          <div className="flex items-center gap-2">
            <input
              id="club-active"
              type="checkbox"
              checked={formState.isActive}
              onChange={(e) => setFormState((prev) => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 text-navy dark:text-orange focus:ring-navy dark:focus:ring-orange border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
            />
            <label htmlFor="club-active" className="text-sm text-gray-700 dark:text-gray-300">
              Display on site
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800"
              >
                New Section
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 bg-orange text-white rounded-md font-medium hover:bg-orange-700 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Section List</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">{articles.length} sections</span>
        </div>
        <div className="flex flex-wrap gap-3 mb-4">
          {groupedSections.map(([section, count]) => (
            <span
              key={section}
              className="px-3 py-1 text-sm bg-navy-50 dark:bg-navy-900/30 text-navy dark:text-navy-200 rounded-full border border-navy-100 dark:border-navy-800"
            >
              {section} · {count}
            </span>
          ))}
          {groupedSections.length === 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400">No sections registered yet.</span>
          )}
        </div>
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {articles
            .slice()
            .sort((a, b) => a.section.localeCompare(b.section) || a.order - b.order)
            .map((article) => (
              <div
                key={article.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-sm transition-shadow bg-white dark:bg-gray-700"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 text-xs font-medium bg-navy text-white rounded">
                        {article.section}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Order {article.order}</span>
                      {!article.isActive && (
                        <span className="text-xs font-medium text-red-500 dark:text-red-400">Hidden</span>
                      )}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{article.title}</h4>
                    {article.summary && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{article.summary}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                    onClick={() => handleEdit(article)}
                    className="text-sm font-medium text-navy dark:text-navy-200 hover:text-navy-700 dark:hover:text-navy-300"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(article.id)}
                    disabled={isDeleting === article.id}
                    className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50"
                  >
                    {isDeleting === article.id ? "Deleting..." : "Delete"}
                  </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

