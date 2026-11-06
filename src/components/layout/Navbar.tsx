"use client";

import { useEffect, useState } from "react";
import { Code2, Download, Menu, X } from "lucide-react";

const links = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
] as const;

export default function Navbar() {
  const [active, setActive] = useState<string>("home");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    links.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const goTo = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${
        scrolled || open ? "bg-[#0a0a14]/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            goTo("home");
          }}
          className="flex items-center gap-2 text-xl font-semibold text-white"
        >
          <Code2 className="h-6 w-6 text-violet-400" />
          <span>
            Shorafot <span className="text-violet-400">Hoshen</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-9 md:flex">
          {links.map(({ label, id }) => (
            <li key={id} className="relative">
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  goTo(id);
                }}
                className={`text-sm transition-colors hover:text-white ${
                  active === id ? "text-violet-400" : "text-gray-300"
                }`}
              >
                {label}
              </a>
              {active === id && (
                <span className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-violet-400" />
              )}
            </li>
          ))}
        </ul>

        {/* Download CV */}
        <a
          // href="/Shorafot-Hoshen-Resume.pdf"
          download
          className="hidden items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-xs text-white transition hover:border-violet-400 hover:bg-white/5 md:inline-flex"
        >
          Download CV <Download className="h-3.5 w-3.5" />
        </a>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="text-white md:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <ul className="flex flex-col gap-1 border-t border-white/10 px-5 pb-5 pt-3 md:hidden">
          {links.map(({ label, id }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  goTo(id);
                }}
                className={`block rounded-md px-3 py-2 text-sm ${
                  active === id ? "bg-white/5 text-violet-400" : "text-gray-300"
                }`}
              >
                {label}
              </a>
            </li>
          ))}
          <li className="pt-2">
            <a
              href="/Alex-Morgan-CV.pdf"
              download
              className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-xs text-white"
            >
              Download CV <Download className="h-3.5 w-3.5" />
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}