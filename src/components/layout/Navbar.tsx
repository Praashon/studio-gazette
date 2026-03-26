"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface NavbarProps {
  categories?: { name: string; slug: string }[];
}

export default function Navbar({ categories = [] }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContainer = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(navContainer.current, {
      y: -80,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    })
    .from(".nav-item", {
      y: -12,
      opacity: 0,
      stagger: 0.06,
      ease: "power2.out",
      duration: 0.5
    }, "-=0.4");
  }, { scope: navContainer });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(() => {
    if (mobileOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.4, ease: "power3.out" }
      );
      gsap.fromTo(
        ".mobile-link",
        { x: -16, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.06, duration: 0.3, ease: "power2.out", delay: 0.15 }
      );
    }
  }, [mobileOpen]);

  const closeMenu = () => {
    gsap.to(mobileMenuRef.current, {
      height: 0,
      opacity: 0,
      duration: 0.3,
      ease: "power3.in",
      onComplete: () => setMobileOpen(false)
    });
  };

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
      ref={navContainer}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "glass border-b border-black/5 shadow-sm"
          : "bg-white border-b border-black"
      }`}
    >
      <div className="flex justify-between items-center max-w-[1440px] mx-auto px-6 h-[72px]">
        {/* Left */}
        <div className="flex items-center gap-6">
          <span className="nav-item text-[10px] font-label font-bold uppercase tracking-[0.15em] border-r border-zinc-200 pr-6 hidden lg:block text-zinc-400">
            Daily Edition &bull; {issueDate}
          </span>
          <div className="hidden xl:flex items-center space-x-7">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                className={`nav-item font-label text-[11px] uppercase tracking-[0.12em] transition-colors duration-200 ${
                  i === 0 ? "text-primary-container font-bold" : "text-zinc-500 hover:text-primary-container font-medium"
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
          className="nav-item text-2xl md:text-3xl font-headline font-bold tracking-tighter absolute left-1/2 -translate-x-1/2"
        >
          STUDIO <span className="font-light serif-italic">GAZETTE</span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-2">
          <Link
            href="/feeds"
            className="nav-item hidden sm:flex items-center gap-1.5 px-3 py-2 font-label text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-primary-container transition-colors"
            title="Manage Feeds"
          >
            <span className="material-symbols-outlined text-sm">rss_feed</span>
            <span className="hidden md:inline">Feeds</span>
          </Link>
          <Link
            href="/bookmarks"
            className="nav-item hidden sm:flex items-center gap-1.5 px-3 py-2 font-label text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-primary-container transition-colors"
            title="Bookmarks"
          >
            <span className="material-symbols-outlined text-sm">bookmark</span>
            <span className="hidden md:inline">Saved</span>
          </Link>
          {/* Mobile hamburger */}
          <button
            className="nav-item xl:hidden p-2 hover:bg-zinc-50 transition-colors"
            onClick={() => mobileOpen ? closeMenu() : setMobileOpen(true)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-xl">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className="xl:hidden bg-white border-t border-zinc-100 overflow-hidden"
        style={{ display: mobileOpen ? "block" : "none", opacity: 0, height: 0 }}
      >
        <div className="px-6 py-6 space-y-1">
          {navLinks.map((link) => (
            <div key={link.href} className="mobile-link">
              <Link
                className="block font-label text-sm uppercase tracking-widest text-on-surface hover:text-primary-container transition-colors py-3 border-b border-zinc-50"
                href={link.href}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            </div>
          ))}
          <div className="mobile-link pt-4 flex gap-3">
            <Link
              href="/feeds"
              className="flex-1 flex items-center justify-center gap-2 border border-zinc-200 py-3 font-label font-bold uppercase tracking-wider text-xs hover:border-primary-container hover:text-primary-container transition-colors"
              onClick={closeMenu}
            >
              <span className="material-symbols-outlined text-sm">rss_feed</span>
              Feeds
            </Link>
            <Link
              href="/bookmarks"
              className="flex-1 flex items-center justify-center gap-2 border border-zinc-200 py-3 font-label font-bold uppercase tracking-wider text-xs hover:border-primary-container hover:text-primary-container transition-colors"
              onClick={closeMenu}
            >
              <span className="material-symbols-outlined text-sm">bookmark</span>
              Saved
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
