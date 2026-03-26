import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
      <span className="font-headline text-[10rem] md:text-[14rem] font-bold leading-none tracking-tighter text-zinc-100 mb-4 select-none">
        404
      </span>
      <h1 className="text-3xl md:text-4xl font-headline font-bold mb-4 -mt-16">
        Story Not Found
      </h1>
      <p className="text-on-surface-variant font-body text-center max-w-md mb-10 leading-relaxed">
        The article you&apos;re looking for may have been moved, deleted, or
        never existed. Our editors are always discovering new stories.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href="/"
          className="bg-black text-white px-10 py-4 font-label font-bold uppercase tracking-[0.12em] text-sm hover:bg-zinc-800 transition-colors"
        >
          Front Page
        </Link>
        <Link
          href="/feeds"
          className="border border-zinc-300 px-10 py-4 font-label font-bold uppercase tracking-[0.12em] text-sm hover:border-primary-container hover:text-primary-container transition-colors"
        >
          Manage Feeds
        </Link>
      </div>
    </div>
  );
}
