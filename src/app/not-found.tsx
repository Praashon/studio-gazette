import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
      <span className="font-headline text-[12rem] font-bold leading-none tracking-tighter text-zinc-200 mb-4 select-none">
        404
      </span>
      <h1 className="text-3xl md:text-4xl font-headline font-bold mb-4 -mt-12">
        Story Not Found
      </h1>
      <p className="text-on-surface-variant font-body text-center max-w-md mb-10">
        The article you&apos;re looking for may have been moved, deleted, or
        never existed. Our editors are always discovering new stories.
      </p>
      <Link
        href="/"
        className="bg-black text-white px-10 py-4 font-label font-bold uppercase tracking-[0.12em] text-sm hover:bg-zinc-800 transition-colors"
      >
        Return to Front Page
      </Link>
    </div>
  );
}
