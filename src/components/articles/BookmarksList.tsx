"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface BookmarkedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  source_name: string;
  published_at: string;
  read_time_minutes: number;
  categories: { name: string; slug: string } | null;
}

export default function BookmarksList() {
  const [articles, setArticles] = useState<BookmarkedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkIds, setBookmarkIds] = useState<string[]>([]);

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem("sg-bookmarks") || "[]") as string[];
    setBookmarkIds(ids);

    if (ids.length === 0) {
      setLoading(false);
      return;
    }

    fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    })
      .then((res) => res.json())
      .then((data) => setArticles(data.articles || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  const removeBookmark = (articleId: string) => {
    const updated = bookmarkIds.filter((id) => id !== articleId);
    localStorage.setItem("sg-bookmarks", JSON.stringify(updated));
    setBookmarkIds(updated);
    setArticles((prev) => prev.filter((a) => a.id !== articleId));
  };

  const clearAll = () => {
    localStorage.setItem("sg-bookmarks", JSON.stringify([]));
    setBookmarkIds([]);
    setArticles([]);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-6 p-5 bg-white">
            <div className="w-32 h-20 skeleton shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-5 skeleton rounded w-3/4" />
              <div className="h-3 skeleton rounded w-full" />
              <div className="h-3 skeleton rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-24">
        <span className="material-symbols-outlined text-6xl text-zinc-200 block mb-4">bookmark</span>
        <h2 className="text-2xl font-headline font-bold mb-3">No bookmarks yet</h2>
        <p className="text-on-surface-variant font-body max-w-md mx-auto mb-8">
          Click the bookmark icon on any article to save it here for later reading.
        </p>
        <Link
          href="/"
          className="inline-block bg-black text-white px-8 py-4 font-label font-bold uppercase tracking-[0.12em] text-sm hover:bg-zinc-800 transition-colors"
        >
          Browse Articles
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-8">
        <span className="font-label text-[10px] font-black uppercase tracking-[0.2em]">
          {articles.length} saved {articles.length === 1 ? "article" : "articles"}
        </span>
        <button
          onClick={clearAll}
          className="font-label text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-error transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Articles */}
      <div className="space-y-0">
        {articles.map((article) => {
          const timeAgo = formatDistanceToNow(new Date(article.published_at), { addSuffix: true });
          return (
            <div
              key={article.id}
              className="flex gap-6 py-5 border-b border-zinc-100 group hover:bg-surface-container-low transition-colors -mx-3 px-3"
            >
              <Link href={`/article/${article.slug}`} className="flex gap-6 flex-1 min-w-0">
                {article.image_url && (
                  <div className="w-32 h-20 shrink-0 overflow-hidden bg-zinc-100">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {article.categories && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-primary-container">
                        {article.categories.name}
                      </span>
                    )}
                    <span className="text-[9px] text-zinc-300">&bull;</span>
                    <span className="text-[9px] text-zinc-400">{timeAgo}</span>
                  </div>
                  <h3 className="font-headline font-bold text-lg leading-tight group-hover:text-primary-container transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-xs text-on-surface-variant mt-1 line-clamp-1">{article.excerpt}</p>
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300 mt-1.5 block">
                    {article.source_name} &bull; {article.read_time_minutes} min
                  </span>
                </div>
              </Link>
              <button
                onClick={() => removeBookmark(article.id)}
                className="self-center opacity-0 group-hover:opacity-100 p-2 hover:bg-error/10 hover:text-error transition-all shrink-0"
                title="Remove bookmark"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
