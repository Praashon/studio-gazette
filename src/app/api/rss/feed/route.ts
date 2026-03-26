import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { escapeXml } from "@/lib/sanitize";

export async function GET() {
  const { data: articles, error } = await supabase
    .from("articles")
    .select("title, slug, excerpt, source_name, source_url, published_at, author, image_url")
    .order("published_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://studio-gazette.vercel.app";

  const items = (articles || [])
    .map(
      (a: Record<string, string | null>) => `    <item>
      <title><![CDATA[${(a.title || "").replace(/]]>/g, "]]]]><![CDATA[>")}]]></title>
      <link>${escapeXml(a.source_url || "")}</link>
      <guid isPermaLink="false">${escapeXml(a.slug || "")}</guid>
      <description><![CDATA[${(a.excerpt || "").replace(/]]>/g, "]]]]><![CDATA[>")}]]></description>
      <pubDate>${new Date(a.published_at || Date.now()).toUTCString()}</pubDate>
      <source url="${escapeXml(a.source_url || "")}">${escapeXml(a.source_name || "")}</source>
      ${a.author ? `<author>${escapeXml(a.author)}</author>` : ""}
      ${a.image_url ? `<enclosure url="${escapeXml(a.image_url)}" type="image/jpeg" />` : ""}
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Studio Gazette</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>Curated news with editorial precision — powered by Studio Gazette</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(siteUrl)}/api/rss/feed" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
    },
  });
}
