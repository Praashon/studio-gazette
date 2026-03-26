import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-on-surface text-white py-16 px-6">
      <div className="max-w-[1440px] mx-auto">
        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 pb-12 border-b border-white/10">
          {/* Branding */}
          <div className="space-y-4">
            <Link href="/" className="text-3xl font-headline font-bold tracking-tighter block">
              STUDIO <span className="font-light serif-italic">GAZETTE</span>
            </Link>
            <p className="font-label text-[10px] uppercase tracking-[0.12em] text-zinc-500 max-w-xs leading-loose">
              Delivering curated news with editorial precision.
              <br />
              Powered by open RSS feeds from around the world.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-3 gap-12">
            <div className="space-y-3">
              <h5 className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary-container">
                Sections
              </h5>
              <nav className="flex flex-col gap-2">
                <Link className="text-xs font-medium text-zinc-400 hover:text-white transition-colors" href="/category/technology">
                  Technology
                </Link>
                <Link className="text-xs font-medium text-zinc-400 hover:text-white transition-colors" href="/category/business">
                  Business
                </Link>
                <Link className="text-xs font-medium text-zinc-400 hover:text-white transition-colors" href="/category/world">
                  World
                </Link>
                <Link className="text-xs font-medium text-zinc-400 hover:text-white transition-colors" href="/category/science">
                  Science
                </Link>
              </nav>
            </div>
            <div className="space-y-3">
              <h5 className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary-container">
                Tools
              </h5>
              <nav className="flex flex-col gap-2">
                <Link className="text-xs font-medium text-zinc-400 hover:text-white transition-colors" href="/feeds">
                  Manage Feeds
                </Link>
                <Link className="text-xs font-medium text-zinc-400 hover:text-white transition-colors" href="/bookmarks">
                  Bookmarks
                </Link>
                <Link className="text-xs font-medium text-zinc-400 hover:text-white transition-colors" href="/api/rss/feed">
                  RSS Feed
                </Link>
              </nav>
            </div>
            <div className="space-y-3">
              <h5 className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary-container">
                Connect
              </h5>
              <nav className="flex flex-col gap-2">
                <a className="text-xs font-medium text-zinc-400 hover:text-white transition-colors" href="#" target="_blank" rel="noopener">
                  Twitter / X
                </a>
                <a className="text-xs font-medium text-zinc-400 hover:text-white transition-colors" href="#" target="_blank" rel="noopener">
                  LinkedIn
                </a>
              </nav>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white/5 border border-white/10 p-6 md:w-56">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 mb-4">
              Feed Status
            </p>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-300">
                Live &mdash; Feeds Active
              </span>
            </div>
            <p className="text-[9px] text-zinc-600 leading-relaxed">
              Auto-refreshing every 15 minutes from all configured RSS sources.
            </p>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8">
          <p className="text-[10px] text-zinc-600 font-label uppercase tracking-[0.1em]">
            &copy; {new Date().getFullYear()} Studio Gazette. All rights reserved.
          </p>
          <p className="text-[10px] text-zinc-700 font-label uppercase tracking-[0.1em]">
            Built with Next.js &bull; Supabase &bull; RSS
          </p>
        </div>
      </div>
    </footer>
  );
}
