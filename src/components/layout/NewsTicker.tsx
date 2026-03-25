import type { Article } from "@/types/database";

interface NewsTickerProps {
  articles: Article[];
}

export default function NewsTicker({ articles }: NewsTickerProps) {
  const headlines = articles.length > 0
    ? articles.map((a) => a.title)
    : [
        "Welcome to Studio Gazette — Your curated news experience",
        "Connect your Supabase database and RSS feeds to get started",
        "Premium editorial design • Real-time updates • RSS aggregation",
      ];

  // Double the headlines for seamless loop
  const doubled = [...headlines, ...headlines];

  return (
    <div className="bg-primary-container text-white py-2.5 overflow-hidden border-b border-black flex items-center">
      <span className="bg-black text-white px-4 py-1 text-[9px] font-bold uppercase tracking-[0.15em] ml-6 z-10 shrink-0">
        Latest Updates
      </span>
      <div className="marquee flex-1 ml-4">
        <div className="marquee-content font-label text-[11px] font-bold uppercase tracking-[0.12em]">
          {doubled.map((headline, i) => (
            <span key={i} className="flex items-center gap-6">
              <span>{headline}</span>
              <span className="opacity-60">&bull;</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
