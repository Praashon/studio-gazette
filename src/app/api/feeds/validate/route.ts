import { NextResponse } from "next/server";
import { isValidUrl } from "@/lib/sanitize";
import Parser from "rss-parser";

const parser = new Parser({ timeout: 10000 });

// POST - Validate an RSS feed URL without adding it
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const feedUrl = (body.feedUrl as string)?.trim();

    if (!feedUrl) {
      return NextResponse.json({ error: "feedUrl is required" }, { status: 400 });
    }

    if (!isValidUrl(feedUrl)) {
      return NextResponse.json({ valid: false, error: "Invalid URL format" }, { status: 400 });
    }

    try {
      const feed = await parser.parseURL(feedUrl);
      return NextResponse.json({
        valid: true,
        title: feed.title || "Untitled Feed",
        description: feed.description || null,
        itemCount: feed.items?.length || 0,
        lastItem: feed.items?.[0]?.title || null,
        link: feed.link || null,
      });
    } catch {
      return NextResponse.json(
        { valid: false, error: "Could not parse as RSS feed. Please check the URL." },
        { status: 422 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
