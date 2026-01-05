"use client";

import { useState, useEffect } from "react";
import RichTextEditor from "./RichTextEditor";

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FAQManagerProps {
  initialFAQs: FAQ[];
}

const defaultFormState = {
  question: "",
  answer: "",
  category: "",
  order: 0,
  isPublished: true,
};

export default function FAQManager({ initialFAQs }: FAQManagerProps) {
  const [faqs, setFAQs] = useState<FAQ[]>(initialFAQs);
  const [formState, setFormState] = useState(defaultFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const resetForm = () => {
    setFormState(defaultFormState);
    setEditingId(null);
  };

  const handleEdit = (faq: FAQ) => {
    setFormState({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || "",
      order: faq.order,
      isPublished: faq.isPublished,
    });
    setEditingId(faq.id);
  };

  const handleSave = async () => {
    if (!formState.question.trim()) {
      alert("Please enter a question.");
      return;
    }
    if (!formState.answer || formState.answer.replace(/<[^>]*>/g, "").trim().length === 0) {
      alert("Please enter an answer.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        question: formState.question.trim(),
        answer: formState.answer,
        category: formState.category.trim() || null,
        order: Number(formState.order) || 0,
        isPublished: formState.isPublished,
      };
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/faqs/${editingId}` : "/api/faqs";
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
      setFAQs((prev) =>
        editingId ? prev.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...prev]
      );
      resetForm();
      // Refresh the page to get updated list
      window.location.reload();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    setIsDeleting(id);
    try {
      const response = await fetch(`/api/faqs/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to delete." }));
        throw new Error(errorData.error || "Failed to delete.");
      }
      setFAQs((prev) => prev.filter((item) => item.id !== id));
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
          {editingId ? "Edit FAQ" : "Create FAQ"}
        </h3>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Question <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formState.question}
              onChange={(e) => setFormState((prev) => ({ ...prev, question: e.target.value }))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-navy dark:focus:ring-orange focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter question"
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
                placeholder="e.g., General, Admissions"
              />
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
          <RichTextEditor
            label="Answer"
            value={formState.answer}
            onChange={(value) => setFormState((prev) => ({ ...prev, answer: value }))}
          />
          <div className="flex items-center gap-2">
            <input
              id="faq-published"
              type="checkbox"
              checked={formState.isPublished}
              onChange={(e) => setFormState((prev) => ({ ...prev, isPublished: e.target.checked }))}
              className="h-4 w-4 text-navy dark:text-orange focus:ring-navy dark:focus:ring-orange border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
            />
            <label htmlFor="faq-published" className="text-sm text-gray-700 dark:text-gray-300">
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
                New FAQ
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
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">FAQ List</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">{faqs.length} FAQs</span>
        </div>
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {faqs.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No FAQs registered yet.</p>
          )}
          {faqs
            .slice()
            .sort((a, b) => a.order - b.order || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((faq) => (
              <div
                key={faq.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-sm transition-shadow bg-white dark:bg-gray-700"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {faq.category && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-navy text-white rounded">
                          {faq.category}
                        </span>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400">Order {faq.order}</span>
                      {!faq.isPublished && (
                        <span className="text-xs font-medium text-red-500 dark:text-red-400">Unpublished</span>
                      )}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{faq.question}</h4>
                    <div
                      className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(faq)}
                      className="text-sm font-medium text-navy dark:text-navy-200 hover:text-navy-700 dark:hover:text-navy-300"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(faq.id)}
                      disabled={isDeleting === faq.id}
                      className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50"
                    >
                      {isDeleting === faq.id ? "Deleting..." : "Delete"}
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

