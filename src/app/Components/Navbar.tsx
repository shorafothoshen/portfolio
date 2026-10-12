"use client"; // eta lage karon scroll ar button click browser e kaj kore

import Link from "next/link"; // Next.js er link component (<a> er bodole eta use hoy)
import { useEffect, useState } from "react";

// Menu er link gulo ekhane lekha. Nam bodlate chaile ekhanei bodlao.
// href er naam tomar page er section er id er sathe mil thakte hobe.
const links = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  // mobile menu khola ache kina (true = khola, false = bondho)
  const [menuOpen, setMenuOpen] = useState(false);

  // ekhon kon section e acho (link highlight korar jonno)
  const [active, setActive] = useState("#home");

  // page scroll korle ei code cholbe, ar bole dibe kon section dekha jacche
  useEffect(() => {
    const handleScroll = () => {
      let current = "#home";

      for (const link of links) {
        const section = document.querySelector(link.href) as HTMLElement | null;
        // section er upor ongsho jodi screen er upore chole ashe, tahole oitai active
        if (section && section.offsetTop <= window.scrollY + 140) {
          current = link.href;
        }
      }
      setActive(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    // component bondho hole listener muche felo (cleanup)
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // fixed = scroll korleo upore thake
    <header className="fixed left-0 right-0 top-0 z-50 flex justify-center px-4 py-4">
      <nav className="relative flex w-full max-w-3xl items-center justify-between rounded-full border border-gray-200 bg-white/80 px-3 py-2 shadow-lg backdrop-blur dark:border-gray-700 dark:bg-gray-900/80">
        {/* Logo / naam */}
        <Link href="#home" className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-sm text-white">
            SH
          </span>
          <span>SHORAFOT HOSHEN</span>
        </Link>

        {/* Desktop menu: choto screen e hide, boro screen (md) e dekha jay */}
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active === link.href
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" // active link
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800" // baki link
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Contact button: shudhu desktop e */}
        <Link
          href="#contact"
          className="hidden rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 md:block dark:bg-white dark:text-gray-900 dark:hover:bg-blue-400"
        >
          Contact me
        </Link>

        {/* Hamburger button: shudhu mobile e */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="grid h-10 w-10 place-items-center rounded-full text-gray-900 hover:bg-gray-100 md:hidden dark:text-white dark:hover:bg-gray-800"
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Mobile menu: menuOpen true hole dekhabe */}
        {menuOpen && (
          <ul className="absolute left-0 right-0 top-full mt-3 flex flex-col gap-1 rounded-3xl border border-gray-200 bg-white p-3 shadow-xl md:hidden dark:border-gray-700 dark:bg-gray-900">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)} // link e click korle menu bondho
                  className={`block rounded-2xl px-4 py-3 font-medium ${
                    active === link.href
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}