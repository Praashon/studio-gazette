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
    // Initial entry animation for the Navbar
    const tl = gsap.timeline();
    tl.from(navContainer.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power4.out"
    })
    .from(".nav-item", {
      y: -20,
      opacity: 0,
      stagger: 0.1,
      ease: "power2.out",
      duration: 0.6
    }, "-=0.6");
  }, { scope: navContainer });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle the Mobile Menu open animation
  useGSAP(() => {
    if (mobileOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.5, ease: "power3.out" }
      );
      gsap.fromTo(
        ".mobile-link",
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.1, duration: 0.4, ease: "power2.out", delay: 0.2 }
      );
    }
  }, [mobileOpen]);

  const closeMenu = () => {
    gsap.to(mobileMenuRef.current, {
      height: 0,
      opacity: 0,
      duration: 0.4,
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
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? "glass border-b border-black/10 shadow-sm" : "bg-white border-b border-black"
      }`}
    >
      <div className="flex justify-between items-center max-w-[1440px] mx-auto px-6 py-4">
        {/* Left */}
        <div className="flex items-center gap-6">
          <span className="nav-item text-[10px] font-label font-bold uppercase tracking-[0.15em] border-r border-zinc-300 pr-6 hidden lg:block">
            Daily Edition &bull; {issueDate}
          </span>
          <div className="hidden xl:flex items-center space-x-8">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                className={`nav-item font-label text-[11px] uppercase tracking-[0.15em] transition-colors ${
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
          className="nav-item text-3xl md:text-4xl font-headline font-bold tracking-tighter absolute left-1/2 -translate-x-1/2"
        >
          STUDIO <span className="font-light serif-italic">GAZETTE</span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-4">
          <Link
            href="/subscribe"
            className="nav-item hidden sm:block bg-black text-white px-6 py-2 font-label font-bold uppercase tracking-wider text-[10px] hover:bg-zinc-800 transition-all"
          >
            Subscribe
          </Link>
          {/* Mobile hamburger */}
          <button
            className="nav-item xl:hidden p-2"
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
        className="xl:hidden bg-white border-t border-zinc-200 overflow-hidden"
        style={{ display: mobileOpen ? "block" : "none", opacity: 0, height: 0 }}
      >
        <div className="px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <div key={link.href} className="mobile-link">
              <Link
                className="block font-label text-sm uppercase tracking-widest text-on-surface hover:text-primary-container transition-colors py-2"
                href={link.href}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            </div>
          ))}
          <div className="mobile-link mt-4">
            <Link
              href="/subscribe"
              className="block bg-black text-white px-6 py-3 font-label font-bold uppercase tracking-wider text-xs text-center hover:bg-zinc-800 transition-all"
              onClick={closeMenu}
            >
              Subscribe
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
