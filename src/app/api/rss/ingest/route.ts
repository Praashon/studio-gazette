import { NextResponse } from "next/server";
import { ingestAllFeeds } from "@/lib/rss";

export async function POST(request: Request) {
  // Verify the secret to prevent unauthorized ingestion
  const apiKey = request.headers.get("x-api-key");
  const expectedKey = process.env.RSS_INGEST_SECRET;

  if (!expectedKey || apiKey !== expectedKey) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const results = await ingestAllFeeds();

    const summary = {
      totalSources: results.length,
      totalNewArticles: results.reduce((sum, r) => sum + r.newArticles, 0),
      totalSkipped: results.reduce((sum, r) => sum + r.skippedArticles, 0),
      errors: results.filter((r) => r.errors.length > 0).map((r) => ({
        source: r.source,
        errors: r.errors,
      })),
      details: results,
    };

    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    console.error("RSS ingestion error:", error);
    return NextResponse.json(
      { error: "Ingestion failed", message: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}

// Allow GET for Vercel cron jobs
export async function GET(request: Request) {
  // Vercel cron sends Authorization header
  const authHeader = request.headers.get("authorization");
  const expectedKey = process.env.RSS_INGEST_SECRET;

  if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return POST(request);
}
