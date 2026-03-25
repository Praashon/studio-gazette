import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import type { Article } from "@/types/database";
import BookmarkButton from "./BookmarkButton";

interface NewsCardProps {
  article: Article;
}

interface ArticleWithCategory extends Article {
  categories?: { name: string; slug: string; color: string } | null;
}

export default function NewsCard({ article }: NewsCardProps) {
  const a = article as ArticleWithCategory;
  const timeAgo = formatDistanceToNow(new Date(a.published_at), {
    addSuffix: false,
  });

  return (
    <Link href={`/article/${a.slug}`}>
      <article className="relative flex flex-col bg-white border border-zinc-200 group cursor-pointer overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
        {/* Image Section */}
        <div className="aspect-video relative overflow-hidden">
          {a.image_url ? (
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 img-reveal"
              src={a.image_url}
              alt={a.title}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-300 to-zinc-200 flex items-center justify-center group-hover:from-zinc-200 group-hover:to-zinc-100 transition-all">
              <span className="text-zinc-400 font-label text-xs uppercase tracking-widest">
                {a.source_name}
              </span>
            </div>
          )}
          <div className="absolute inset-0 news-card-overlay opacity-80" />

          {/* Bookmark */}
          <div className="absolute top-4 right-4 z-10" onClick={(e) => e.preventDefault()}>
            <BookmarkButton articleId={a.id} variant="overlay" />
          </div>

          {/* Category Badge + Time */}
          <div className="absolute bottom-4 left-4 text-white z-10">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] mb-1">
              <span className="bg-primary-container px-2 py-0.5">
                {a.categories?.name || a.source_name}
              </span>
              <span className="opacity-80">{timeAgo} ago</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <h3 className="text-2xl md:text-3xl font-headline font-bold leading-tight mb-4 group-hover:text-primary-container transition-colors">
            {a.title}
          </h3>
          <p className="text-sm font-body text-on-surface-variant leading-relaxed line-clamp-2">
            {a.excerpt || "Read the full article for more details."}
          </p>
        </div>
      </article>
    </Link>
  );
}
