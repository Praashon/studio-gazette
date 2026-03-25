import { getArticlesByCategory } from "@/lib/data/articles";
import { getAllCategories } from "@/lib/data/categories";
import NewsCard from "@/components/articles/NewsCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const capitalizedName = slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    title: `${capitalizedName} | Studio Gazette`,
    description: `Latest ${capitalizedName} news and stories curated by Studio Gazette.`,
  };
}

export const revalidate = 300;

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [{ articles, category }, allCategories] = await Promise.all([
    getArticlesByCategory(slug, 20),
    getAllCategories(),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <>
      {/* Category Header */}
      <div className="border-b border-black">
        <div className="max-w-[1440px] mx-auto px-6 py-16">
          <span className="font-label text-[10px] font-bold uppercase tracking-[0.4em] text-primary-container block mb-4">
            Section
          </span>
          <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter mb-6">
            {category.name}
          </h1>
          <div className="accent-line" />

          {/* Category Navigation */}
          <div className="flex items-center gap-6 mt-10 overflow-x-auto no-scrollbar pb-2">
            <Link
              href="/"
              className="font-label text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500 hover:text-primary-container transition-colors shrink-0"
            >
              All
            </Link>
            {allCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`font-label text-[10px] font-bold uppercase tracking-[0.12em] shrink-0 transition-colors ${
                  cat.slug === slug
                    ? "text-primary-container border-b-2 border-primary-container pb-1"
                    : "text-zinc-500 hover:text-primary-container"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-[1440px] mx-auto px-6 py-16">
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <span className="material-symbols-outlined text-6xl text-zinc-300 mb-6 block">
              newspaper
            </span>
            <h2 className="text-2xl font-headline font-bold mb-4">
              No articles yet
            </h2>
            <p className="text-on-surface-variant font-body max-w-md mx-auto mb-8">
              We haven&apos;t fetched any articles for this category yet. Try
              triggering an RSS ingestion or check back later.
            </p>
            <Link
              href="/"
              className="inline-block bg-black text-white px-8 py-4 font-label font-bold uppercase tracking-[0.12em] text-sm hover:bg-zinc-800 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
