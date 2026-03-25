import Link from "next/link";
import type { Article } from "@/types/database";

interface QuickBriefsProps {
  articles: Article[];
}

interface ArticleWithCategory extends Article {
  categories?: { name: string; slug: string } | null;
}

export default function QuickBriefs({ articles }: QuickBriefsProps) {
  const items = articles as ArticleWithCategory[];

  return (
    <aside className="hidden lg:block border-l border-zinc-200 pl-10">
      <h3 className="font-label text-[10px] font-black uppercase tracking-[0.2em] mb-8 border-b-2 border-black pb-2">
        Quick Briefs
      </h3>
      <div className="space-y-8">
        {items.length > 0 ? (
          items.map((article, i) => (
            <Link
              key={article.id || i}
              href={`/article/${article.slug}`}
              className="block pb-6 border-b border-zinc-100 group"
            >
              <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-400 mb-1 block">
                {article.categories?.name || article.source_name}
              </span>
              <h5 className="font-headline font-bold text-base leading-tight mb-2 group-hover:text-primary-container transition-colors">
                {article.title}
              </h5>
              <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                {article.excerpt || "Tap to read the full article."}
              </p>
            </Link>
          ))
        ) : (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="pb-6 border-b border-zinc-100 space-y-2">
              <div className="h-3 skeleton rounded w-1/3" />
              <div className="h-4 skeleton rounded w-full" />
              <div className="h-3 skeleton rounded w-4/5" />
            </div>
          ))
        )}

        {/* Staff Insights */}
        <div className="pt-6">
          <h4 className="font-label text-[10px] font-black uppercase tracking-[0.12em] mb-6">
            Staff Insights
          </h4>
          <div className="space-y-6">
            {[
              { icon: "monitoring", title: "Data Precision", desc: "Leveraging advanced analytics for curation." },
              { icon: "design_services", title: "Intuitive UI", desc: "Balancing beauty with functionality." },
              { icon: "rss_feed", title: "Live Feeds", desc: "Real-time RSS aggregation from top sources." },
            ].map((insight) => (
              <div key={insight.icon} className="flex gap-4 items-start">
                <span className="material-symbols-outlined text-sm text-primary-container">
                  {insight.icon}
                </span>
                <div>
                  <h6 className="text-xs font-bold uppercase tracking-wider mb-1">
                    {insight.title}
                  </h6>
                  <p className="text-[10px] text-zinc-500 leading-tight">
                    {insight.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
