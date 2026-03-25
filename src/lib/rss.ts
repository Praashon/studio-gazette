import Parser from "rss-parser";
import { createServiceClient } from "@/lib/supabase";
import type { ArticleInsert } from "@/types/database";

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: false }],
      ["media:thumbnail", "mediaThumbnail", { keepArray: false }],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 120);
}

function estimateReadTime(content: string | undefined): number {
  if (!content) return 3;
  const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.max(2, Math.ceil(wordCount / 200));
}

function extractImageUrl(item: Record<string, unknown>): string | null {
  // Try media:content
  const mediaContent = item.mediaContent as Record<string, unknown> | undefined;
  if (mediaContent) {
    const attrs = mediaContent.$ as Record<string, string> | undefined;
    if (attrs?.url) return attrs.url;
  }

  // Try media:thumbnail
  const mediaThumbnail = item.mediaThumbnail as Record<string, unknown> | undefined;
  if (mediaThumbnail) {
    const attrs = mediaThumbnail.$ as Record<string, string> | undefined;
    if (attrs?.url) return attrs.url;
  }

  // Try enclosure
  const enclosure = item.enclosure as Record<string, string> | undefined;
  if (enclosure?.url && enclosure.type?.startsWith("image/")) {
    return enclosure.url;
  }

  // Try to extract from content:encoded or content
  const content = (item.contentEncoded || item.content || "") as string;
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
  if (imgMatch) return imgMatch[1];

  return null;
}

export interface IngestionResult {
  source: string;
  newArticles: number;
  skippedArticles: number;
  errors: string[];
}

export async function ingestAllFeeds(): Promise<IngestionResult[]> {
  const serviceClient = createServiceClient();
  const results: IngestionResult[] = [];

  // Fetch all active RSS sources
  const { data: sources, error: sourcesError } = await serviceClient
    .from("rss_sources")
    .select("*, categories(slug)")
    .eq("is_active", true);

  if (sourcesError || !sources) {
    console.error("Error fetching RSS sources:", sourcesError);
    return [{ source: "system", newArticles: 0, skippedArticles: 0, errors: [sourcesError?.message || "No sources found"] }];
  }

  for (const source of sources) {
    const result: IngestionResult = {
      source: source.name,
      newArticles: 0,
      skippedArticles: 0,
      errors: [],
    };

    try {
      const feed = await parser.parseURL(source.feed_url);
      const articles: any[] = [];

      for (const item of feed.items) {
        const title = item.title?.trim();
        if (!title) continue;

        const guid = item.guid || item.link || `${source.feed_url}::${title}`;
        const slug = slugify(title) + "-" + Date.now().toString(36).slice(-4);

        articles.push({
          title,
          slug,
          excerpt: item.contentSnippet?.slice(0, 300) || item.content?.replace(/<[^>]*>/g, "").slice(0, 300) || null,
          content: (item as any).contentEncoded as string || item.content || null,
          image_url: extractImageUrl(item as any),
          source_name: source.name,
          source_url: item.link || source.feed_url,
          author: (item as any).creator || (item as any).author || null,
          category_id: source.category_id,
          published_at: item.isoDate || new Date().toISOString(),
          is_featured: false,
          is_breaking: false,
          read_time_minutes: estimateReadTime(item.content),
          guid,
        });
      }

      // Upsert articles (deduplicate by guid)
      if (articles.length > 0) {
        const { data: upserted, error: upsertError } = await (serviceClient
          .from("articles") as any)
          .upsert(articles, { onConflict: "guid", ignoreDuplicates: true })
          .select("id");

        if (upsertError) {
          result.errors.push(upsertError.message);
        } else {
          result.newArticles = upserted?.length || 0;
          result.skippedArticles = articles.length - result.newArticles;
        }
      }

      // Update last_fetched_at
      await (serviceClient
        .from("rss_sources") as any)
        .update({ last_fetched_at: new Date().toISOString() })
        .eq("id", source.id);
    } catch (err) {
      result.errors.push(
        err instanceof Error ? err.message : "Unknown error"
      );
    }

    results.push(result);
  }

  return results;
}
