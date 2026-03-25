"use client";

import { useState, useEffect } from "react";

interface BookmarkButtonProps {
  articleId: string;
  variant?: "default" | "overlay";
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sessionId = localStorage.getItem("sg-session-id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("sg-session-id", sessionId);
  }
  return sessionId;
}

export default function BookmarkButton({
  articleId,
  variant = "default",
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check local storage for bookmark state
    const bookmarks = JSON.parse(
      localStorage.getItem("sg-bookmarks") || "[]"
    ) as string[];
    setBookmarked(bookmarks.includes(articleId));
  }, [articleId]);

  const toggleBookmark = async () => {
    if (loading) return;
    setLoading(true);

    const bookmarks = JSON.parse(
      localStorage.getItem("sg-bookmarks") || "[]"
    ) as string[];

    const sessionId = getSessionId();

    if (bookmarked) {
      // Remove bookmark
      const updated = bookmarks.filter((id) => id !== articleId);
      localStorage.setItem("sg-bookmarks", JSON.stringify(updated));
      setBookmarked(false);

      // Try async Supabase delete (best effort)
      try {
        await fetch("/api/bookmarks", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articleId, sessionId }),
        });
      } catch {
        // Silently fail - local state is source of truth
      }
    } else {
      // Add bookmark
      bookmarks.push(articleId);
      localStorage.setItem("sg-bookmarks", JSON.stringify(bookmarks));
      setBookmarked(true);

      // Try async Supabase insert (best effort)
      try {
        await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articleId, sessionId }),
        });
      } catch {
        // Silently fail
      }
    }

    setLoading(false);
  };

  const baseClasses =
    variant === "overlay"
      ? "bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-colors"
      : "bg-white/90 hover:bg-white text-black p-2 rounded-full transition-colors";

  return (
    <button
      className={baseClasses}
      onClick={toggleBookmark}
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
      disabled={loading}
    >
      <span className="material-symbols-outlined text-sm" style={{
        fontVariationSettings: bookmarked ? "'FILL' 1" : "'FILL' 0",
      }}>
        bookmark
      </span>
    </button>
  );
}
