"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Quill을 동적으로 로드 (SSR 방지)
const ReactQuill = dynamic(() => import("react-quill"), { 
  ssr: false,
  loading: () => <div className="h-[300px] border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center">
    <p className="text-gray-500 dark:text-gray-400">Loading editor...</p>
  </div>
});

interface PostEditorProps {
  onSubmit: (data: { title: string; content: string; category: string; visibilityName: string }) => Promise<void>;
  onCancel?: () => void;
  initialData?: {
    title: string;
    content: string;
    category: string;
    visibilityName: string;
  };
  hideCategory?: boolean; // 카테고리 선택 숨기기 옵션
}

const categories = [
  { value: "FREE", label: "Free Board" },
  { value: "CONSULTATION", label: "Consultation" },
  { value: "STUDY", label: "Study & Exams" },
  { value: "LOST_FOUND", label: "Lost & Found" },
  { value: "INFO", label: "Suggestion" },
  { value: "QNA", label: "Q&A" },
];

export default function PostEditor({ onSubmit, onCancel, initialData, hideCategory = false }: PostEditorProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [category, setCategory] = useState(initialData?.category || "FREE");
  const [isAnonymous, setIsAnonymous] = useState(initialData?.visibilityName === "anonymous");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const quillRef = useRef<any>(null);
  const quillInstanceRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setCategory(initialData.category);
      setIsAnonymous(initialData.visibilityName === "anonymous");
    }
  }, [initialData]);

  const handleImageUpload = useCallback(async () => {
    // Quill 인스턴스 가져오기 함수
    const getQuillInstance = () => {
      // 1. 캐시된 인스턴스 확인
      if (quillInstanceRef.current) {
        return quillInstanceRef.current;
      }

      // 2. ref에서 가져오기
      if (quillRef.current) {
        try {
          if (typeof quillRef.current.getEditor === 'function') {
            const editor = quillRef.current.getEditor();
            if (editor) {
              quillInstanceRef.current = editor;
              return editor;
            }
          }
        } catch (e) {
          console.log("Error getting editor from ref:", e);
        }
      }

      // 3. DOM에서 직접 찾기
      const editorElement = document.querySelector('.ql-editor');
      if (editorElement) {
        const container = editorElement.closest('.ql-container');
        if (container && (container as any).__quill) {
          const quill = (container as any).__quill;
          quillInstanceRef.current = quill;
          return quill;
        }
      }

      return null;
    };

    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      // 파일 크기 제한 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be 5MB or less.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Image upload failed" }));
          throw new Error(errorData.error || "Image upload failed");
        }

        const data = await response.json();
        if (!data.url) {
          throw new Error("Failed to receive image URL.");
        }

        // Get Quill instance
        const quill = getQuillInstance();

        if (quill && typeof quill.insertEmbed === 'function') {
          try {
            const range = quill.getSelection(true);
            const index = range ? range.index : quill.getLength();
            quill.insertEmbed(index, "image", data.url);
            quill.setSelection(index + 1);
          } catch (e) {
            console.error("Error inserting image:", e);
            // Fallback: add directly to content
            const imageHtml = `<img src="${data.url}" alt="Uploaded image" />`;
            setContent((prev) => prev + imageHtml);
            alert("Image added successfully.");
          }
        } else {
          // If Quill instance not found, add directly to content
          const imageHtml = `<img src="${data.url}" alt="Uploaded image" />`;
          setContent((prev) => prev + imageHtml);
          alert("Image added successfully.");
        }
      } catch (error: any) {
        console.error("Error uploading image:", error);
        alert(error.message || "Failed to upload image.");
      }
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: handleImageUpload,
      },
    },
  }), [handleImageUpload]);

  const formats = useMemo(() => [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
  ], []);

  const handleContentChange = useCallback((value: string) => {
    setContent(value);
  }, []);

  // HTML 내용이 실제로 비어있는지 확인
  const isContentEmpty = (html: string): boolean => {
    if (!html || !html.trim()) return true;
    // HTML 태그만 있고 실제 텍스트가 없는 경우 체크
    const textContent = html.replace(/<[^>]*>/g, "").trim();
    return textContent.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert("Please enter a title.");
      return;
    }

    if (isContentEmpty(content)) {
      alert("Please enter content.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        category,
        visibilityName: isAnonymous ? "anonymous" : "nickname",
      });
      // 성공 시 폼 초기화
      setTitle("");
      setContent("");
      setCategory(initialData?.category || "FREE");
      setIsAnonymous(false);
    } catch (error) {
      console.error("Error submitting post:", error);
      // 에러는 상위 컴포넌트에서 처리하므로 여기서는 alert 제거
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy dark:focus:ring-orange focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Enter title"
          maxLength={200}
        />
      </div>

      {!hideCategory && (
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-navy dark:focus:ring-orange focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Content <span className="text-red-500">*</span>
        </label>
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          {isMounted && (
            <ReactQuill
              theme="snow"
              value={content}
              onChange={handleContentChange}
              modules={modules}
              formats={formats}
              placeholder="Enter content"
              className="bg-white dark:bg-gray-800"
            />
          )}
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="anonymous"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className="w-4 h-4 text-navy dark:text-orange border-gray-300 dark:border-gray-600 rounded focus:ring-navy dark:focus:ring-orange bg-white dark:bg-gray-700"
        />
        <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          Post as Anonymous
        </label>
      </div>

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-orange text-white rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}

