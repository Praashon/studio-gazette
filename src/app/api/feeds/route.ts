import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import { isValidUrl } from "@/lib/sanitize";
import Parser from "rss-parser";

const parser = new Parser({ timeout: 10000 });

// GET - List all active RSS sources
export async function GET() {
  const { data, error } = await supabase
    .from("rss_sources")
    .select("id, name, feed_url, is_active, last_fetched_at, category_id, categories(name, slug)")
    .order("name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ feeds: data || [] });
}

// POST - Add a new RSS feed
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const feedUrl = (body.feedUrl as string)?.trim();
    const name = (body.name as string)?.trim();
    const categoryId = body.categoryId as string | undefined;

    if (!feedUrl) {
      return NextResponse.json({ error: "feedUrl is required" }, { status: 400 });
    }

    if (!isValidUrl(feedUrl)) {
      return NextResponse.json({ error: "Invalid URL format. Must be http or https." }, { status: 400 });
    }

    // Validate that the URL is actually an RSS feed
    try {
      const feed = await parser.parseURL(feedUrl);
      const feedName = name || feed.title || new URL(feedUrl).hostname;

      const serviceClient = createServiceClient();
      const { data, error } = await (serviceClient
        .from("rss_sources") as any)
        .insert({
          name: feedName.slice(0, 100),
          feed_url: feedUrl,
          category_id: categoryId || null,
          is_active: true,
        })
        .select("id, name, feed_url, is_active")
        .single();

      if (error) {
        if (error.code === "23505") {
          return NextResponse.json(
            { error: "This feed URL already exists" },
            { status: 409 }
          );
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        feed: data,
        feedTitle: feed.title,
        itemCount: feed.items?.length || 0,
        message: `Feed "${feedName}" added successfully with ${feed.items?.length || 0} articles found.`,
      }, { status: 201 });

    } catch {
      return NextResponse.json(
        { error: "Could not parse the URL as an RSS feed. Please check the URL and try again." },
        { status: 422 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

// DELETE - Remove an RSS feed by id
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const feedId = body.feedId as string;

    if (!feedId) {
      return NextResponse.json({ error: "feedId is required" }, { status: 400 });
    }

    const serviceClient = createServiceClient();
    const { error } = await serviceClient
      .from("rss_sources")
      .delete()
      .eq("id", feedId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: "removed" });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
