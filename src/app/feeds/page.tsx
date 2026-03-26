import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { getAllCategories } from "@/lib/data/categories";
import FeedManager from "@/components/feeds/FeedManager";

export const metadata: Metadata = {
  title: "Manage Feeds | Studio Gazette",
  description: "Add, manage, and discover RSS feeds to customize your news experience.",
};

export const revalidate = 60;

interface FeedWithCategory {
  id: string;
  name: string;
  feed_url: string;
  is_active: boolean;
  last_fetched_at: string | null;
  category_id: string | null;
  categories: { name: string; slug: string } | null;
}

export default async function FeedsPage() {
  const [feedsResult, categories] = await Promise.all([
    supabase
      .from("rss_sources")
      .select("id, name, feed_url, is_active, last_fetched_at, category_id, categories(name, slug)")
      .order("name"),
    getAllCategories(),
  ]);

  const feeds = (feedsResult.data || []) as unknown as FeedWithCategory[];

  return (
    <>
      {/* Page Header */}
      <div className="border-b border-black">
        <div className="max-w-[1440px] mx-auto px-6 py-16">
          <span className="font-label text-[10px] font-bold uppercase tracking-[0.4em] text-primary-container block mb-4">
            Customize
          </span>
          <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter mb-4">
            Your Feeds
          </h1>
          <p className="text-lg font-body text-on-surface-variant max-w-2xl leading-relaxed">
            Add any RSS feed to bring in news from your favorite sources.
            Paste a feed URL below and we&apos;ll validate and start fetching articles automatically.
          </p>
          <div className="accent-line mt-6" />
        </div>
      </div>

      {/* Feed Manager Client Component */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <FeedManager initialFeeds={feeds} categories={categories} />
      </div>
    </>
  );
}
