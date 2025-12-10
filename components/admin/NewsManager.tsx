"use client";

import { useState } from "react";
import RichTextEditor from "./RichTextEditor";

export interface NewsArticle {
  id: string;
  title: string;
  summary?: string | null;
  content: string;
  category?: string | null;
  coverImage?: string | null;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface NewsManagerProps {
  initialArticles: NewsArticle[];
}

const defaultFormState = {
  title: "",
  summary: "",
  content: "",
  category: "General",
  coverImage: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  isPublished: true,
};

export default function NewsManager({ initialArticles }: NewsManagerProps) {
  const [articles, setArticles] = useState<NewsArticle[]>(initialArticles);
  const [formState, setFormState] = useState(defaultFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const resetForm = () => {
    setFormState(defaultFormState);
    setEditingId(null);
  };

  const handleEdit = (article: NewsArticle) => {
    setFormState({
      title: article.title,
      summary: article.summary || "",
      content: article.content,
      category: article.category || "General",
      coverImage: article.coverImage || "",
      publishedAt: article.publishedAt.slice(0, 10),
      isPublished: article.isPublished,
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
        category: formState.category.trim() || null,
        coverImage: formState.coverImage.trim() || null,
        isPublished: formState.isPublished,
        publishedAt: new Date(formState.publishedAt).toISOString(),
      };
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/news/${editingId}` : "/api/news";
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
        editingId ? prev.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...prev]
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
    if (!confirm("Are you sure you want to delete this news article?")) return;
    setIsDeleting(id);
    try {
      const response = await fetch(`/api/news/${id}`, { method: "DELETE" });
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
          {editingId ? "Edit News" : "Create News"}
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
              placeholder="Enter title"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <input
                type="text"
                value={formState.category}
                onChange={(e) => setFormState((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-navy dark:focus:ring-orange focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="e.g., Announcement, Event"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Publish Date</label>
              <input
                type="date"
                value={formState.publishedAt}
                onChange={(e) => setFormState((prev) => ({ ...prev, publishedAt: e.target.value }))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-navy dark:focus:ring-orange focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
              placeholder="Enter news summary"
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
                  id="news-cover-upload"
                />
                <label
                  htmlFor="news-cover-upload"
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
              id="news-published"
              type="checkbox"
              checked={formState.isPublished}
              onChange={(e) => setFormState((prev) => ({ ...prev, isPublished: e.target.checked }))}
              className="h-4 w-4 text-navy dark:text-orange focus:ring-navy dark:focus:ring-orange border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
            />
            <label htmlFor="news-published" className="text-sm text-gray-700 dark:text-gray-300">
              Publish on site
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800"
              >
                New Article
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 bg-orange text-white rounded-md font-medium hover:bg-orange-700 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : editingId ? "Update" : "Publish"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">News List</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">{articles.length} articles</span>
        </div>
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {articles.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No news articles registered yet.</p>
          )}
          {articles.map((article) => (
            <div
              key={article.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-sm transition-shadow bg-white dark:bg-gray-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {article.category && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-navy text-white rounded">
                        {article.category}
                      </span>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(article.publishedAt).toLocaleDateString("en-US")}
                    </span>
                    {!article.isPublished && (
                      <span className="text-xs font-medium text-red-500 dark:text-red-400">Unpublished</span>
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

