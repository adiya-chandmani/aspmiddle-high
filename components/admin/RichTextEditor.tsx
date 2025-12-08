"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] border border-gray-300 rounded-lg bg-white flex items-center justify-center">
      <p className="text-gray-500">Loading editor...</p>
    </div>
  ),
});

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  height?: number;
  placeholder?: string;
}

export default function RichTextEditor({
  label = "Content",
  value,
  onChange,
  height = 320,
  placeholder = "Enter content",
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const quillRef = useRef<any>(null);
  const quillInstanceRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const getQuillInstance = useCallback(() => {
    if (quillInstanceRef.current) return quillInstanceRef.current;
    if (quillRef.current?.getEditor) {
      const editor = quillRef.current.getEditor();
      if (editor) {
        quillInstanceRef.current = editor;
        return editor;
      }
    }
    const editorElement = document.querySelector(".ql-editor");
    if (editorElement) {
      const container = editorElement.closest(".ql-container");
      if (container && (container as any).__quill) {
        const quill = (container as any).__quill;
        quillInstanceRef.current = quill;
        return quill;
      }
    }
    return null;
  }, []);

  const handleImageUpload = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
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
          throw new Error("Did not receive image URL.");
        }

        const quill = getQuillInstance();
        if (quill?.insertEmbed) {
          const range = quill.getSelection(true);
          const index = range ? range.index : quill.getLength();
          quill.insertEmbed(index, "image", data.url);
          quill.setSelection(index + 1);
        } else {
          const fallbackHtml = `<img src="${data.url}" alt="Uploaded image" />`;
          onChangeRef.current?.(`${valueRef.current || ""}${fallbackHtml}`);
        }
      } catch (error: any) {
        console.error("Error uploading image:", error);
        alert(error.message || "Failed to upload image.");
      }
    };
  }, [getQuillInstance]);

  const modules = useMemo(
    () => ({
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
    }),
    [handleImageUpload]
  );

  const formats = useMemo(
    () => ["header", "bold", "italic", "underline", "strike", "list", "bullet", "link", "image"],
    []
  );

  const handleEditorChange = useCallback((content: string) => {
    onChangeRef.current?.(content);
  }, []);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ minHeight: height }}>
        {isMounted && (
          <ReactQuill
            theme="snow"
            value={value}
            onChange={handleEditorChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
            className="bg-white"
          />
        )}
      </div>
    </div>
  );
}

