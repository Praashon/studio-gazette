import Link from "next/link";
import type { Article } from "@/types/database";

interface SidebarProps {
  articles: Article[];
}

interface ArticleWithCategory extends Article {
  categories?: { name: string; slug: string; color: string } | null;
}

export default function Sidebar({ articles }: SidebarProps) {
  const items = articles as ArticleWithCategory[];

  return (
    <aside className="hidden lg:block vertical-rule pr-10">
      <h3 className="font-label text-[10px] font-black uppercase tracking-[0.2em] mb-8 border-b-2 border-black pb-2">
        Trending Topics
      </h3>
      <div className="space-y-10">
        {items.length > 0 ? (
          items.map((article, i) => (
            <Link
              key={article.id || i}
              href={`/article/${article.slug}`}
              className="group cursor-pointer block"
            >
              <span className="font-label text-[10px] text-primary-container font-bold uppercase tracking-[0.12em] mb-2 block">
                {String(i + 1).padStart(2, "0")} /{" "}
                {article.categories?.name || article.source_name || "News"}
              </span>
              <h4 className="font-headline font-bold text-lg leading-tight group-hover:underline decoration-primary-container">
                {article.title}
              </h4>
              <p className="text-xs text-on-surface-variant mt-2 font-body leading-relaxed line-clamp-2">
                {article.excerpt || "Read the full article for more details."}
              </p>
            </Link>
          ))
        ) : (
          /* Placeholder skeleton items */
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <span className="font-label text-[10px] text-primary-container font-bold uppercase tracking-[0.12em] block">
                {String(i + 1).padStart(2, "0")} / Loading
              </span>
              <div className="h-5 skeleton rounded w-4/5" />
              <div className="h-3 skeleton rounded w-full" />
              <div className="h-3 skeleton rounded w-3/4" />
            </div>
          ))
        )}
      </div>

      {/* Ad Space */}
      <div className="pt-8 mt-8 border-t border-zinc-200">
        <div className="bg-zinc-100 p-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500 block mb-3">
            Sponsored
          </span>
          <div className="aspect-square bg-zinc-200 mb-4 flex items-center justify-center">
            <span className="text-zinc-400 text-xs font-label uppercase tracking-widest">
              Ad Space
            </span>
          </div>
          <p className="font-headline italic text-sm text-zinc-500">
            &ldquo;The future of craft is digital.&rdquo;
          </p>
        </div>
      </div>
    </aside>
  );
}
