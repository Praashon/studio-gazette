"use client";

import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  return (
    <div className="flex gap-3">
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-zinc-100 hover:bg-zinc-200 p-3 transition-colors"
        aria-label="Share on Twitter"
      >
        <span className="material-symbols-outlined text-sm">share</span>
      </a>
      <button
        onClick={copyLink}
        className="bg-zinc-100 hover:bg-zinc-200 p-3 transition-colors relative"
        aria-label="Copy link"
      >
        <span className="material-symbols-outlined text-sm">
          {copied ? "check" : "link"}
        </span>
        {copied && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 whitespace-nowrap">
            Copied!
          </span>
        )}
      </button>
    </div>
  );
}
