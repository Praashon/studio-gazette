import type { Metadata } from "next";
import BookmarksList from "@/components/articles/BookmarksList";

export const metadata: Metadata = {
  title: "Bookmarks | Studio Gazette",
  description: "Your saved articles for later reading.",
};

export default function BookmarksPage() {
  return (
    <>
      {/* Page Header */}
      <div className="border-b border-black">
        <div className="max-w-[1440px] mx-auto px-6 py-16">
          <span className="font-label text-[10px] font-bold uppercase tracking-[0.4em] text-primary-container block mb-4">
            Your Library
          </span>
          <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter mb-4">
            Bookmarks
          </h1>
          <p className="text-lg font-body text-on-surface-variant max-w-2xl leading-relaxed">
            Articles you&apos;ve saved for later. Stored locally in your browser for privacy.
          </p>
          <div className="accent-line mt-6" />
        </div>
      </div>

      {/* Bookmarks Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <BookmarksList />
      </div>
    </>
  );
}
