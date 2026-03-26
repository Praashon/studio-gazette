import Link from "next/link";
import type { Article } from "@/types/database";

interface NewsTickerProps {
  articles: Article[];
}

export default function NewsTicker({ articles }: NewsTickerProps) {
  const items = articles.length > 0
    ? articles
    : null;

  const headlines = items
    ? items.map((a) => ({ title: a.title, slug: a.slug }))
    : [
        { title: "Welcome to Studio Gazette \u2014 Your curated news experience", slug: "" },
        { title: "Add your own RSS feeds from the Feeds page", slug: "" },
        { title: "Premium editorial design \u2022 Real-time updates \u2022 RSS aggregation", slug: "" },
      ];

  // Double for seamless loop
  const doubled = [...headlines, ...headlines];

  return (
    <div className="bg-primary-container text-white py-2.5 overflow-hidden flex items-center">
      <span className="bg-on-surface text-white px-4 py-1 text-[9px] font-bold uppercase tracking-[0.15em] ml-6 z-10 shrink-0">
        Latest
      </span>
      <div className="marquee flex-1 ml-4">
        <div className="marquee-content font-label text-[11px] font-medium uppercase tracking-[0.08em]">
          {doubled.map((item, i) => (
            <span key={i} className="flex items-center gap-6">
              {item.slug ? (
                <Link href={`/article/${item.slug}`} className="hover:underline underline-offset-2">
                  {item.title}
                </Link>
              ) : (
                <span>{item.title}</span>
              )}
              <span className="opacity-40">&bull;</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
