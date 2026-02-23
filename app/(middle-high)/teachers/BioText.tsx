"use client";

import { useMemo, useState } from "react";

export default function BioText({
  text,
  clampLines = 5,
}: {
  text: string;
  clampLines?: number;
}) {
  const [expanded, setExpanded] = useState(false);

  const shouldShowToggle = useMemo(() => {
    // Heuristic: show toggle for longer bios (works well without measuring DOM lines)
    const normalized = text.trim();
    return normalized.length >= 180 || normalized.split("\n").some((l) => l.trim().length > 0);
  }, [text]);

  return (
    <div className="mt-2 pt-3 border-t border-gray-100">
      <p
        className={`text-sm text-gray-700 leading-relaxed whitespace-pre-line ${
          expanded ? "" : `line-clamp-${clampLines}`
        }`}
      >
        {text}
      </p>

      {shouldShowToggle && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-sm font-medium text-orange hover:underline"
            aria-expanded={expanded}
          >
            {expanded ? "Less" : "More"}
          </button>
        </div>
      )}
    </div>
  );
}
