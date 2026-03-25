import { supabase } from "@/lib/supabase";
import type { Category } from "@/types/database";

export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data || [];
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching category:", error);
    return null;
  }
  return data;
}
