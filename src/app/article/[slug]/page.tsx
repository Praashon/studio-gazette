import { getArticleBySlug, getLatestArticles } from "@/lib/data/articles";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import BookmarkButton from "@/components/articles/BookmarkButton";
import ReadingProgress from "@/components/articles/ReadingProgress";
import ShareButtons from "@/components/articles/ShareButtons";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanitizeArticleHtml } from "@/lib/sanitize";

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
      <ReadingProgress />

      {/* Article Header */}
      <div className="max-w-[1440px] mx-auto px-6 pt-8 pb-12">
        <article className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-10" aria-label="Breadcrumb">
            <Link
              href="/"
              className="font-label text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400 hover:text-primary-container transition-colors"
            >
              Home
            </Link>
            <span className="text-zinc-200">&rsaquo;</span>
            {article.categories && (
              <>
                <Link
                  href={`/category/${article.categories.slug}`}
                  className="font-label text-[10px] font-bold uppercase tracking-[0.12em] text-primary-container"
                >
                  {article.categories.name}
                </Link>
                <span className="text-zinc-200">&rsaquo;</span>
              </>
            )}
            <span className="font-label text-[10px] uppercase tracking-[0.12em] text-zinc-300 truncate max-w-[200px]">
              Article
            </span>
          </nav>

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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-headline font-bold leading-[0.92] tracking-tight mb-8">
            {article.title}
          </h1>

          {/* Meta Row */}
          <div className="flex items-center gap-4 flex-wrap mb-10 pb-8 border-b border-zinc-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm text-zinc-500">person</span>
              </div>
              <div>
                <span className="font-label text-xs font-bold uppercase tracking-[0.08em] block leading-tight">
                  {article.author || article.source_name}
                </span>
                <span className="font-label text-[10px] text-zinc-400">
                  {formattedDate}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <span className="flex items-center gap-1.5 font-label text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <span className="material-symbols-outlined text-xs">schedule</span>
                {article.read_time_minutes} min read
              </span>
              <span className="text-zinc-200">|</span>
              <span className="font-label text-[10px] text-zinc-400">{timeAgo}</span>
              <BookmarkButton articleId={article.id} />
            </div>
          </div>

          {/* Featured Image */}
          {article.image_url && (
            <div className="aspect-[16/9] bg-zinc-100 overflow-hidden mb-12 -mx-4 md:-mx-12">
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
            <blockquote className="text-xl md:text-2xl font-headline italic text-on-surface-variant leading-relaxed mb-10 border-l-4 border-primary-container pl-6 py-2">
              {article.excerpt}
            </blockquote>
          )}

          {/* Content */}
          {article.content ? (
            <div
              className="article-content prose prose-lg max-w-none font-body leading-[1.8]
                prose-headings:font-headline prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:mb-6 prose-p:text-on-surface
                prose-a:text-primary-container prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-primary
                prose-img:rounded-none prose-img:my-8
                prose-blockquote:border-primary-container prose-blockquote:font-headline prose-blockquote:italic
                prose-strong:font-bold
                prose-li:mb-2
                text-on-surface"
              dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(article.content) }}
            />
          ) : (
            <div className="bg-surface-container-low p-10 text-center my-8">
              <span className="material-symbols-outlined text-4xl text-zinc-300 block mb-4">open_in_new</span>
              <p className="font-body text-on-surface-variant mb-2 text-lg">
                This article is from an external source.
              </p>
              <p className="font-body text-zinc-400 text-sm mb-6">
                Read the full story on the publisher&apos;s website.
              </p>
              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 font-label font-bold uppercase tracking-[0.12em] text-sm hover:bg-zinc-800 transition-colors"
              >
                Read on {article.source_name}
                <span className="material-symbols-outlined text-sm">arrow_outward</span>
              </a>
            </div>
          )}

          {/* Footer: Source + Share */}
          <div className="mt-14 pt-8 border-t border-zinc-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="font-label text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400 block mb-1">
                  Originally published by
                </span>
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-label text-sm font-bold text-primary-container hover:underline"
                >
                  {article.source_name}
                  <span className="material-symbols-outlined text-xs">arrow_outward</span>
                </a>
              </div>
              <ShareButtons title={article.title} url={article.source_url} />
            </div>
          </div>
        </article>
      </div>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="bg-surface-container-low py-16">
          <div className="max-w-[1440px] mx-auto px-6">
            <h2 className="font-label text-[10px] font-black uppercase tracking-[0.4em] mb-10">
              Continue Reading
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
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
