import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import type { Article } from "@/types/database";
import BookmarkButton from "./BookmarkButton";

interface HeroArticleProps {
  article: Article | null;
}

interface ArticleWithCategory extends Article {
  categories?: { name: string; slug: string; color: string } | null;
}

export default function HeroArticle({ article }: HeroArticleProps) {
  if (!article) {
    return (
      <article className="border-b border-zinc-200 pb-12">
        <span className="inline-block bg-primary-container text-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] mb-6">
          Main Feature
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-bold leading-[0.85] tracking-tighter mb-8">
          Innovating at the <br />
          <span className="serif-italic font-medium">Technologies</span> <br />
          and Design No One Expected
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-10">
          <div>
            <p className="text-xl md:text-2xl font-headline italic text-on-surface-variant leading-tight">
              &ldquo;Crafting curated digital news experiences by blending
              editorial intuition with real-time data aggregation.&rdquo;
            </p>
            <div className="flex items-center gap-4 mt-6">
              <span className="font-label text-xs font-bold uppercase tracking-[0.12em]">
                By Studio Gazette Team
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
              <span className="font-label text-xs uppercase text-zinc-500">
                5 Min Read
              </span>
            </div>
          </div>
          <div className="aspect-[16/9] bg-zinc-200 overflow-hidden relative">
            <div className="w-full h-full bg-gradient-to-br from-zinc-300 to-zinc-200 flex items-center justify-center">
              <span className="text-zinc-400 font-label text-sm uppercase tracking-widest">
                Featured Image
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="bg-black text-white px-8 py-4 font-label font-bold uppercase tracking-[0.12em] text-sm hover:bg-zinc-800 transition-colors">
            Read Full Article
          </button>
          <button className="border border-black px-8 py-4 font-label font-bold uppercase tracking-[0.12em] text-sm hover:bg-black hover:text-white transition-all">
            Browse Archive
          </button>
        </div>
      </article>
    );
  }

  const a = article as ArticleWithCategory;
  const timeAgo = formatDistanceToNow(new Date(a.published_at), { addSuffix: true });

  return (
    <article className="border-b border-zinc-200 pb-12">
      <span className="inline-block bg-primary-container text-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] mb-6">
        Main Feature
      </span>
      <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-headline font-bold leading-[0.88] tracking-tighter mb-8">
        {a.title}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-10">
        <div>
          <p className="text-lg md:text-2xl font-headline italic text-on-surface-variant leading-tight">
            &ldquo;{a.excerpt || a.title}&rdquo;
          </p>
          <div className="flex items-center gap-4 mt-6 flex-wrap">
            <span className="font-label text-xs font-bold uppercase tracking-[0.12em]">
              {a.author || a.source_name}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
            <span className="font-label text-xs uppercase text-zinc-500">
              {a.read_time_minutes} Min Read
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
            <span className="font-label text-xs uppercase text-zinc-500">
              {timeAgo}
            </span>
          </div>
        </div>
        <div className="aspect-[16/9] bg-zinc-200 overflow-hidden relative group cursor-pointer">
          {a.image_url ? (
            <img
              alt={a.title}
              className="w-full h-full object-cover img-reveal group-hover:scale-105 transition-transform duration-700"
              src={a.image_url}
              loading="eager"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-300 to-zinc-200 flex items-center justify-center">
              <span className="text-zinc-400 font-label text-sm uppercase tracking-widest">
                {a.source_name}
              </span>
            </div>
          )}
          <div className="absolute top-4 right-4">
            <BookmarkButton articleId={a.id} />
          </div>
        </div>
      </div>
      <div className="flex gap-4 flex-wrap">
        <Link
          href={`/article/${a.slug}`}
          className="bg-black text-white px-8 py-4 font-label font-bold uppercase tracking-[0.12em] text-sm hover:bg-zinc-800 transition-colors"
        >
          Read Full Article
        </Link>
        {a.categories && (
          <Link
            href={`/category/${a.categories.slug}`}
            className="border border-black px-8 py-4 font-label font-bold uppercase tracking-[0.12em] text-sm hover:bg-black hover:text-white transition-all"
          >
            {a.categories.name}
          </Link>
        )}
      </div>
    </article>
  );
}
