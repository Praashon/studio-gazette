import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white py-16 px-6 border-t-4 border-black">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        {/* Branding */}
        <div className="space-y-4">
          <Link href="/" className="text-4xl font-headline font-bold tracking-tighter block">
            STUDIO <span className="font-light serif-italic">GAZETTE</span>
          </Link>
          <p className="font-label text-[10px] uppercase tracking-[0.12em] text-zinc-400 max-w-xs leading-loose">
            &copy; {new Date().getFullYear()} Studio Gazette. All rights
            reserved.
            <br />
            Delivering curated news with editorial precision.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-3">
            <h5 className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary-container">
              Sections
            </h5>
            <nav className="flex flex-col gap-2">
              <Link className="text-xs font-bold uppercase hover:underline" href="/category/technology">
                Technology
              </Link>
              <Link className="text-xs font-bold uppercase hover:underline" href="/category/business">
                Business
              </Link>
              <Link className="text-xs font-bold uppercase hover:underline" href="/category/world">
                World
              </Link>
              <Link className="text-xs font-bold uppercase hover:underline" href="/category/science">
                Science
              </Link>
            </nav>
          </div>
          <div className="space-y-3">
            <h5 className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary-container">
              Connect
            </h5>
            <nav className="flex flex-col gap-2">
              <a className="text-xs font-bold uppercase hover:underline" href="#" target="_blank" rel="noopener">
                Twitter / X
              </a>
              <a className="text-xs font-bold uppercase hover:underline" href="#" target="_blank" rel="noopener">
                LinkedIn
              </a>
              <Link className="text-xs font-bold uppercase hover:underline" href="/api/rss/feed">
                RSS Feed
              </Link>
            </nav>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-black text-white p-6 md:w-64">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-4">
            Feed Status
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em]">
              Live &mdash; Feeds Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
