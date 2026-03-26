import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isValidUUID } from "@/lib/sanitize";

// POST - Fetch articles by IDs (for bookmarks page)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ids = body.ids as string[];

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ articles: [] });
    }

    // Limit to 50 and validate UUIDs
    const validIds = ids.slice(0, 50).filter(isValidUUID);

    if (validIds.length === 0) {
      return NextResponse.json({ articles: [] });
    }

    const { data, error } = await (supabase
      .from("articles") as any)
      .select("id, title, slug, excerpt, image_url, source_name, published_at, read_time_minutes, categories(name, slug)")
      .in("id", validIds)
      .order("published_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ articles: data || [] });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
