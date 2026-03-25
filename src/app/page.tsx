import { getLatestArticles, getFeaturedArticles, getBreakingNews, getTrendingArticles, getQuickBriefs } from "@/lib/data/articles";
import NewsTicker from "@/components/layout/NewsTicker";
import Sidebar from "@/components/layout/Sidebar";
import QuickBriefs from "@/components/layout/QuickBriefs";
import HeroArticle from "@/components/articles/HeroArticle";
import NewsCard from "@/components/articles/NewsCard";
import Link from "next/link";

export const revalidate = 300; // ISR: revalidate every 5 minutes

export default async function HomePage() {
  const [latestArticles, featuredArticles, breakingNews, trendingArticles, quickBriefs] =
    await Promise.all([
      getLatestArticles(10),
      getFeaturedArticles(4),
      getBreakingNews(8),
      getTrendingArticles(3),
      getQuickBriefs(4),
    ]);

  const heroArticle = featuredArticles[0] || latestArticles[0] || null;
  const newsCards = (featuredArticles.length > 1 ? featuredArticles.slice(1, 3) : latestArticles.slice(1, 3));
  const opEdArticle = latestArticles.find((a) => a.id !== heroArticle?.id) || latestArticles[2] || null;

  return (
    <>
      {/* News Ticker */}
      <NewsTicker articles={breakingNews} />

      {/* Main Editorial Grid */}
      <div className="max-w-[1440px] mx-auto px-6 py-12 newspaper-grid gap-10">
        {/* Left Sidebar: Trending */}
        <Sidebar articles={trendingArticles} />

        {/* Center: Main Stories */}
        <section className="space-y-12">
          {/* Hero */}
          <HeroArticle article={heroArticle} />

          {/* Featured Stories Grid */}
          <div className="space-y-8">
            <h2 className="font-label text-[10px] font-black uppercase tracking-[0.4em] text-primary-container">
              Featured Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {newsCards.length > 0 ? (
                newsCards.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))
              ) : (
                /* Skeleton placeholders */
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="bg-white border border-zinc-200 overflow-hidden">
                    <div className="aspect-video skeleton" />
                    <div className="p-6 space-y-3">
                      <div className="h-6 skeleton rounded w-4/5" />
                      <div className="h-4 skeleton rounded w-full" />
                      <div className="h-4 skeleton rounded w-3/4" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* More Articles */}
          {latestArticles.length > 3 && (
            <div className="space-y-8">
              <h2 className="font-label text-[10px] font-black uppercase tracking-[0.4em] text-on-surface">
                Latest
              </h2>
              <div className="space-y-6">
                {latestArticles.slice(3, 8).map((article) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.slug}`}
                    className="flex gap-6 group pb-6 border-b border-zinc-100"
                  >
                    {article.image_url && (
                      <div className="w-32 h-20 shrink-0 overflow-hidden bg-zinc-200">
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="w-full h-full object-cover img-reveal group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-headline font-bold text-lg leading-tight group-hover:text-primary-container transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mt-2 block">
                        {article.source_name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Right Sidebar: Quick Briefs */}
        <QuickBriefs articles={quickBriefs} />
      </div>

      {/* Op-Ed Banner */}
      <section className="bg-black text-white py-24">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <span className="font-label text-xs text-primary-container uppercase tracking-[0.4em] font-bold mb-8 block">
              Op-Ed: The Big Read
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-headline font-bold mb-8 leading-[0.9]">
              {opEdArticle?.title || "The Future of Collaborative Data"}
            </h2>
            <p className="text-lg md:text-xl font-body text-zinc-400 leading-relaxed mb-12 max-w-xl">
              {opEdArticle?.excerpt ||
                "How we redefined the interface for complex data analysis by introducing a semantic design language that adapts to user workflows."}
            </p>
            <div className="flex gap-6">
              <Link
                href={opEdArticle ? `/article/${opEdArticle.slug}` : "#"}
                className="bg-white text-black px-10 py-5 font-label font-bold uppercase tracking-[0.12em] text-sm hover:bg-primary-container hover:text-white transition-all"
              >
                Full Story
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 aspect-video bg-zinc-800 overflow-hidden">
            {opEdArticle?.image_url ? (
              <img
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                src={opEdArticle.image_url}
                alt={opEdArticle.title}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-zinc-600 font-label text-sm uppercase tracking-widest">
                  Featured Image
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <h2 className="text-2xl md:text-3xl font-headline font-bold mb-12 text-center uppercase tracking-[0.12em] border-y border-black py-4">
          Reader Inquiries (FAQ)
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "Where does Studio Gazette get its news?",
              a: "We aggregate from curated RSS feeds of trusted global news sources including TechCrunch, BBC, The Verge, Reuters, and more. Every article links back to its original source.",
            },
            {
              q: "How often is the content updated?",
              a: "Our RSS ingestion engine runs every 15 minutes, fetching the latest articles from all configured sources. Content is refreshed automatically.",
            },
            {
              q: "Can I bookmark articles?",
              a: "Yes! Click the bookmark icon on any article card to save it for later. Bookmarks are stored locally in your browser for privacy.",
            },
            {
              q: "Is there an RSS feed I can subscribe to?",
              a: "Absolutely. Visit /api/rss/feed to get our aggregated RSS feed that you can add to any RSS reader.",
            },
          ].map((faq, i) => (
            <details
              key={i}
              className="group border-b border-zinc-200"
              open={i === 0}
            >
              <summary className="flex justify-between items-center py-6 cursor-pointer list-none">
                <span className="text-lg md:text-xl font-headline font-bold italic pr-4">
                  {faq.q}
                </span>
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-primary-container shrink-0">
                  expand_more
                </span>
              </summary>
              <div className="pb-6 text-on-surface-variant font-body leading-relaxed max-w-2xl">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
