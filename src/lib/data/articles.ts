import { supabase } from "@/lib/supabase";
import type { Article, Category } from "@/types/database";

export async function getLatestArticles(
  limit = 20,
  offset = 0
): Promise<Article[]> {
  const { data, error } = await (supabase
    .from("articles") as any)
    .select("*, categories(name, slug, color)")
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching latest articles:", error);
    return [];
  }
  return (data as unknown as Article[]) || [];
}

export async function getFeaturedArticles(limit = 4): Promise<Article[]> {
  const { data, error } = await (supabase
    .from("articles") as any)
    .select("*, categories(name, slug, color)")
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured articles:", error);
    return [];
  }
  return (data as unknown as Article[]) || [];
}

export async function getBreakingNews(limit = 10): Promise<Article[]> {
  const { data, error } = await (supabase
    .from("articles") as any)
    .select("title, slug, source_name, published_at")
    .eq("is_breaking", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching breaking news:", error);
    // Fallback to latest articles
    const { data: fallbackData } = await (supabase
      .from("articles") as any)
      .select("title, slug, source_name, published_at")
      .order("published_at", { ascending: false })
      .limit(limit);
    return (fallbackData as unknown as Article[]) || [];
  }
  return (data as unknown as Article[]) || [];
}

export async function getArticleBySlug(
  slug: string
): Promise<Article | null> {
  const { data, error } = await (supabase
    .from("articles") as any)
    .select("*, categories(name, slug, color)")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching article:", error);
    return null;
  }
  return data as unknown as Article;
}

export async function getArticlesByCategory(
  categorySlug: string,
  limit = 20,
  offset = 0
): Promise<{ articles: Article[]; category: Category | null }> {
  // First get the category
  const { data: category } = await (supabase
    .from("categories") as any)
    .select("*")
    .eq("slug", categorySlug)
    .single();

  if (!category) return { articles: [], category: null };

  const { data, error } = await (supabase
    .from("articles") as any)
    .select("*, categories(name, slug, color)")
    .eq("category_id", category.id)
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching category articles:", error);
    return { articles: [], category };
  }
  return { articles: (data as unknown as Article[]) || [], category };
}

export async function getTrendingArticles(limit = 5): Promise<Article[]> {
  // Get one recent article per category for diversity
  const { data, error } = await (supabase
    .from("articles") as any)
    .select("*, categories(name, slug, color)")
    .order("published_at", { ascending: false })
    .limit(limit * 3);

  if (error) {
    console.error("Error fetching trending:", error);
    return [];
  }

  // Deduplicate by category for variety
  const seen = new Set<string>();
  const trending: Article[] = [];
  for (const article of (data as unknown as Article[]) || []) {
    const catId = (article as Record<string, unknown>).category_id as string;
    if (!seen.has(catId)) {
      seen.add(catId);
      trending.push(article);
    }
    if (trending.length >= limit) break;
  }
  return trending;
}

export async function getQuickBriefs(limit = 4): Promise<Article[]> {
  const { data, error } = await (supabase
    .from("articles") as any)
    .select("title, slug, excerpt, source_name, published_at, categories(name, slug)")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching quick briefs:", error);
    return [];
  }
  return (data as unknown as Article[]) || [];
}
