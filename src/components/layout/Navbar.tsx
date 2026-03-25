"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface NavbarProps {
  categories?: { name: string; slug: string }[];
}

export default function Navbar({ categories = [] }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = categories.length > 0
    ? categories.slice(0, 5).map((c) => ({ label: c.name, href: `/category/${c.slug}` }))
    : [
        { label: "Technology", href: "/category/technology" },
        { label: "Business", href: "/category/business" },
        { label: "World", href: "/category/world" },
        { label: "Science", href: "/category/science" },
      ];

  const today = new Date();
  const issueDate = today.toLocaleDateString("en-US", { month: "short", year: "numeric" });

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-black/10 shadow-sm" : "bg-white border-b border-black"
      }`}
    >
      <div className="flex justify-between items-center max-w-[1440px] mx-auto px-6 py-4">
        {/* Left */}
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-label font-bold uppercase tracking-[0.15em] border-r border-zinc-300 pr-6 hidden md:block">
            Daily Edition &bull; {issueDate}
          </span>
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                className={`font-label text-[11px] uppercase tracking-[0.15em] transition-colors ${
                  i === 0 ? "text-primary-container font-bold" : "text-zinc-600 hover:text-primary-container font-medium"
                }`}
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Center Logo */}
        <Link
          href="/"
          className="text-3xl md:text-4xl font-headline font-bold tracking-tighter absolute left-1/2 -translate-x-1/2"
        >
          STUDIO <span className="font-light serif-italic">GAZETTE</span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-4">
          <Link
            href="/subscribe"
            className="hidden sm:block bg-black text-white px-6 py-2 font-label font-bold uppercase tracking-wider text-[10px] hover:bg-zinc-800 transition-all"
          >
            Subscribe
          </Link>
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-xl">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-zinc-200 px-6 py-6 space-y-4 animate-in slide-in-from-top">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              className="block font-label text-sm uppercase tracking-widest text-on-surface hover:text-primary-container transition-colors py-2"
              href={link.href}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/subscribe"
            className="block bg-black text-white px-6 py-3 font-label font-bold uppercase tracking-wider text-xs text-center hover:bg-zinc-800 transition-all mt-4"
          >
            Subscribe
          </Link>
        </div>
      )}
    </nav>
  );
}
