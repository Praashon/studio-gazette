import { getArticleBySlug, getLatestArticles } from "@/lib/data/articles";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import BookmarkButton from "@/components/articles/BookmarkButton";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

interface ArticleWithCategory {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  source_name: string;
  source_url: string;
  author: string | null;
  category_id: string | null;
  published_at: string;
  read_time_minutes: number;
  categories?: { name: string; slug: string; color: string } | null;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found | Studio Gazette" };

  return {
    title: `${article.title} | Studio Gazette`,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      images: article.image_url ? [article.image_url] : [],
      type: "article",
      publishedTime: article.published_at,
      authors: article.author ? [article.author] : [],
    },
  };
}

export const revalidate = 300;

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = (await getArticleBySlug(slug)) as ArticleWithCategory | null;

  if (!article) {
    notFound();
  }

  const relatedArticles = await getLatestArticles(5);
  const related = relatedArticles.filter((a) => a.slug !== slug).slice(0, 4);

  const publishedDate = new Date(article.published_at);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });
  const formattedDate = format(publishedDate, "MMMM d, yyyy 'at' h:mm a");

  return (
    <>
      {/* Article Header */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <Link
              href="/"
              className="font-label text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500 hover:text-primary-container transition-colors"
            >
              Home
            </Link>
            <span className="text-zinc-300">/</span>
            {article.categories && (
              <>
                <Link
                  href={`/category/${article.categories.slug}`}
                  className="font-label text-[10px] font-bold uppercase tracking-[0.12em] text-primary-container"
                >
                  {article.categories.name}
                </Link>
                <span className="text-zinc-300">/</span>
              </>
            )}
            <span className="font-label text-[10px] uppercase tracking-[0.12em] text-zinc-400 truncate">
              {article.title}
            </span>
          </div>

          {/* Category Badge */}
          {article.categories && (
            <Link
              href={`/category/${article.categories.slug}`}
              className="inline-block bg-primary-container text-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] mb-6 hover:bg-primary transition-colors"
            >
              {article.categories.name}
            </Link>
          )}

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold leading-[0.9] tracking-tighter mb-8">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 flex-wrap mb-10 pb-8 border-b border-zinc-200">
            <span className="font-label text-xs font-bold uppercase tracking-[0.12em]">
              {article.author || article.source_name}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
            <span className="font-label text-xs text-zinc-500">
              {formattedDate}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
            <span className="font-label text-xs text-zinc-500">
              {article.read_time_minutes} min read
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
            <span className="font-label text-xs text-zinc-500">{timeAgo}</span>
            <div className="ml-auto">
              <BookmarkButton articleId={article.id} />
            </div>
          </div>

          {/* Featured Image */}
          {article.image_url && (
            <div className="aspect-[16/9] bg-zinc-200 overflow-hidden mb-12">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          )}

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-xl md:text-2xl font-headline italic text-on-surface-variant leading-relaxed mb-10 border-l-4 border-primary-container pl-6">
              {article.excerpt}
            </p>
          )}

          {/* Content */}
          {article.content ? (
            <div
              className="prose prose-lg max-w-none font-body leading-relaxed
                prose-headings:font-headline prose-headings:font-bold
                prose-a:text-primary-container prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-none prose-img:border prose-img:border-zinc-200
                text-on-surface"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <div className="bg-surface-container-low p-8 text-center">
              <p className="font-body text-on-surface-variant mb-4">
                This article is sourced from an external RSS feed.
              </p>
              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-black text-white px-8 py-4 font-label font-bold uppercase tracking-[0.12em] text-sm hover:bg-zinc-800 transition-colors"
              >
                Read Full Article on {article.source_name} &rarr;
              </a>
            </div>
          )}

          {/* Source Link */}
          <div className="mt-12 pt-8 border-t border-zinc-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="font-label text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400 block mb-1">
                  Source
                </span>
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-label text-sm font-bold text-primary-container hover:underline"
                >
                  {article.source_name} &nearr;
                </a>
              </div>
              {/* Share buttons */}
              <div className="flex gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(article.source_url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-zinc-100 hover:bg-zinc-200 p-3 transition-colors"
                  aria-label="Share on Twitter"
                >
                  <span className="material-symbols-outlined text-sm">share</span>
                </a>
                <button
                  className="bg-zinc-100 hover:bg-zinc-200 p-3 transition-colors"
                  aria-label="Copy link"
                  onClick={() => {}}
                >
                  <span className="material-symbols-outlined text-sm">link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="bg-surface-container-low py-16">
          <div className="max-w-[1440px] mx-auto px-6">
            <h2 className="font-label text-[10px] font-black uppercase tracking-[0.4em] mb-10">
              More Stories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((a) => (
                <Link
                  key={a.id}
                  href={`/article/${a.slug}`}
                  className="group"
                >
                  {a.image_url && (
                    <div className="aspect-video bg-zinc-200 overflow-hidden mb-4">
                      <img
                        src={a.image_url}
                        alt={a.title}
                        className="w-full h-full object-cover img-reveal group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <span className="font-label text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-400 block mb-2">
                    {a.source_name}
                  </span>
                  <h3 className="font-headline font-bold text-lg leading-tight group-hover:text-primary-container transition-colors line-clamp-2">
                    {a.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
