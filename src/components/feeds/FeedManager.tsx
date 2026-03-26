"use client";

import { useState } from "react";
import type { Category } from "@/types/database";

interface Feed {
  id: string;
  name: string;
  feed_url: string;
  is_active: boolean;
  last_fetched_at: string | null;
  category_id: string | null;
  categories: { name: string; slug: string } | null;
}

interface FeedPreview {
  valid: boolean;
  title: string;
  description: string | null;
  itemCount: number;
  lastItem: string | null;
  link: string | null;
}

interface FeedManagerProps {
  initialFeeds: Feed[];
  categories: Category[];
}

export default function FeedManager({ initialFeeds, categories }: FeedManagerProps) {
  const [feeds, setFeeds] = useState<Feed[]>(initialFeeds);
  const [feedUrl, setFeedUrl] = useState("");
  const [feedName, setFeedName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [preview, setPreview] = useState<FeedPreview | null>(null);
  const [validating, setValidating] = useState(false);
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const validateFeed = async () => {
    if (!feedUrl.trim()) return;
    clearMessages();
    setValidating(true);
    setPreview(null);

    try {
      const res = await fetch("/api/feeds/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedUrl: feedUrl.trim() }),
      });
      const data = await res.json();

      if (data.valid) {
        setPreview(data);
        if (!feedName) setFeedName(data.title || "");
      } else {
        setError(data.error || "Invalid feed URL");
      }
    } catch {
      setError("Failed to validate feed. Please check the URL.");
    } finally {
      setValidating(false);
    }
  };

  const addFeed = async () => {
    if (!feedUrl.trim()) return;
    clearMessages();
    setAdding(true);

    try {
      const res = await fetch("/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedUrl: feedUrl.trim(),
          name: feedName.trim() || undefined,
          categoryId: categoryId || undefined,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        const cat = categories.find((c) => c.id === categoryId);
        setFeeds((prev) => [
          ...prev,
          {
            ...data.feed,
            categories: cat ? { name: cat.name, slug: cat.slug } : null,
          },
        ]);
        setFeedUrl("");
        setFeedName("");
        setCategoryId("");
        setPreview(null);
        setSuccess(data.message || "Feed added successfully!");
      } else {
        setError(data.error || "Failed to add feed");
      }
    } catch {
      setError("Failed to add feed. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const removeFeed = async (feedId: string) => {
    clearMessages();
    setRemoving(feedId);

    try {
      const res = await fetch("/api/feeds", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedId }),
      });

      if (res.ok) {
        setFeeds((prev) => prev.filter((f) => f.id !== feedId));
        setSuccess("Feed removed.");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to remove feed");
      }
    } catch {
      setError("Failed to remove feed.");
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="space-y-12">
      {/* Add Feed Form */}
      <div className="bg-white border border-zinc-100 p-8 md:p-10">
        <h2 className="font-label text-[10px] font-black uppercase tracking-[0.2em] mb-8 border-b-2 border-black pb-2">
          Add New Feed
        </h2>

        <div className="space-y-6">
          {/* URL Input */}
          <div>
            <label className="block font-label text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
              RSS Feed URL
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                value={feedUrl}
                onChange={(e) => { setFeedUrl(e.target.value); setPreview(null); clearMessages(); }}
                placeholder="https://example.com/rss/feed.xml"
                className="flex-1 border-b-2 border-zinc-200 focus:border-primary-container bg-transparent py-3 px-1 font-body text-base outline-none transition-colors placeholder:text-zinc-300"
              />
              <button
                onClick={validateFeed}
                disabled={validating || !feedUrl.trim()}
                className="bg-zinc-100 hover:bg-zinc-200 px-6 py-3 font-label font-bold uppercase tracking-wider text-[10px] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                {validating ? (
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                    Checking
                  </span>
                ) : "Validate"}
              </button>
            </div>
          </div>

          {/* Feed Preview */}
          {preview && (
            <div className="bg-surface-container-low p-6 border-l-4 border-primary-container animate-in fade-in">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-label text-[9px] font-bold uppercase tracking-wider text-primary-container block mb-1">
                    Feed Verified
                  </span>
                  <h3 className="font-headline font-bold text-xl mb-1">{preview.title}</h3>
                  {preview.description && (
                    <p className="text-sm text-on-surface-variant line-clamp-2 mb-2">{preview.description}</p>
                  )}
                  <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    <span>{preview.itemCount} articles</span>
                    {preview.lastItem && <span>Latest: {preview.lastItem.slice(0, 50)}...</span>}
                  </div>
                </div>
                <span className="material-symbols-outlined text-primary-container text-2xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
            </div>
          )}

          {/* Name + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-label text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                Feed Name (optional)
              </label>
              <input
                type="text"
                value={feedName}
                onChange={(e) => setFeedName(e.target.value)}
                placeholder={preview?.title || "Auto-detected from feed"}
                className="w-full border-b-2 border-zinc-200 focus:border-primary-container bg-transparent py-3 px-1 font-body text-base outline-none transition-colors placeholder:text-zinc-300"
              />
            </div>
            <div>
              <label className="block font-label text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border-b-2 border-zinc-200 focus:border-primary-container bg-transparent py-3 px-1 font-body text-base outline-none transition-colors text-zinc-600"
              >
                <option value="">Uncategorized</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="flex items-center gap-3 bg-error/5 text-error px-5 py-4 text-sm font-body">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-3 bg-primary-container/5 text-primary px-5 py-4 text-sm font-body">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              {success}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={addFeed}
            disabled={adding || !feedUrl.trim()}
            className="bg-black text-white px-10 py-4 font-label font-bold uppercase tracking-[0.12em] text-sm hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {adding ? (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                Adding Feed...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">add</span>
                Add Feed
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Popular Feeds Suggestions */}
      <div>
        <h2 className="font-label text-[10px] font-black uppercase tracking-[0.2em] mb-6 border-b-2 border-black pb-2">
          Popular Feed Suggestions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Hacker News", url: "https://hnrss.org/frontpage" },
            { name: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/index" },
            { name: "NPR News", url: "https://feeds.npr.org/1001/rss.xml" },
            { name: "Wired", url: "https://www.wired.com/feed/rss" },
            { name: "The Guardian", url: "https://www.theguardian.com/world/rss" },
            { name: "NASA Breaking News", url: "https://www.nasa.gov/rss/dyn/breaking_news.rss" },
          ].filter((s) => !feeds.some((f) => f.feed_url === s.url)).map((suggestion) => (
            <button
              key={suggestion.url}
              onClick={() => { setFeedUrl(suggestion.url); setFeedName(suggestion.name); setPreview(null); clearMessages(); }}
              className="flex items-center gap-3 p-4 bg-surface-container-low hover:bg-surface-container transition-colors text-left group"
            >
              <span className="material-symbols-outlined text-primary-container text-lg">rss_feed</span>
              <div className="flex-1 min-w-0">
                <span className="font-label text-sm font-bold block group-hover:text-primary-container transition-colors">
                  {suggestion.name}
                </span>
                <span className="text-[10px] text-zinc-400 truncate block">{suggestion.url}</span>
              </div>
              <span className="material-symbols-outlined text-zinc-300 group-hover:text-primary-container transition-colors text-sm">
                arrow_forward
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Current Feeds List */}
      <div>
        <h2 className="font-label text-[10px] font-black uppercase tracking-[0.2em] mb-6 border-b-2 border-black pb-2">
          Active Feeds ({feeds.length})
        </h2>

        {feeds.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-6xl text-zinc-200 block mb-4">rss_feed</span>
            <p className="text-on-surface-variant font-body">No feeds yet. Add your first RSS feed above to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {feeds.map((feed) => (
              <div
                key={feed.id}
                className="flex items-center gap-4 p-5 bg-white border border-zinc-100 hover:border-zinc-200 transition-colors group"
              >
                <span className="material-symbols-outlined text-primary-container">rss_feed</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-headline font-bold text-base truncate">{feed.name}</h3>
                    {feed.categories && (
                      <span className="bg-primary-container/10 text-primary-container px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider shrink-0">
                        {feed.categories.name}
                      </span>
                    )}
                    {feed.is_active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Active" />
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">{feed.feed_url}</p>
                  {feed.last_fetched_at && (
                    <p className="text-[10px] text-zinc-300 mt-0.5">
                      Last fetched: {new Date(feed.last_fetched_at).toLocaleString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeFeed(feed.id)}
                  disabled={removing === feed.id}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-error/10 hover:text-error transition-all rounded-full disabled:opacity-50"
                  title="Remove feed"
                >
                  <span className="material-symbols-outlined text-sm">
                    {removing === feed.id ? "progress_activity" : "delete"}
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
