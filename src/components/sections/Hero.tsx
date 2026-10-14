import Link from "next/link";
import { profile, socialLinks } from "@/data/portfolio";

export default function Hero() {
  return (
    // isolate = background gulo ei section er bhetorei thake
    <section
      id="home"
      className="relative isolate flex min-h-screen scroll-mt-24 items-center justify-center overflow-hidden px-5 py-32"
    >
      {/* ---------- Background (shudhu design, kono content nai) ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {/* halka grid, majhkhane dekha jay, kinare fade hoye jay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        {/* duita rongin glow */}
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute left-[60%] top-1/2 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      {/* ---------- Content ---------- */}
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        {/* Status pill */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-gray-700 backdrop-blur dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          4th Year CSE · {profile.university}
        </div>

        {/* Naam: gradient text */}
        <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
          Hi, I&apos;m{" "}
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-violet-400">
            {profile.name}
          </span>
        </h1>

        <p className="mt-5 text-xl font-semibold text-gray-800 sm:text-2xl dark:text-gray-200">
          {profile.role}
        </p>

        <p className="mt-4 max-w-xl text-lg text-gray-600 dark:text-gray-400">
          {profile.tagline}
        </p>

        {/* Buttons */}
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="#projects"
            className="rounded-full bg-gray-900 px-7 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-blue-600 dark:bg-white dark:text-gray-900 dark:hover:bg-blue-400"
          >
            View Projects
          </Link>
          <Link
            href="#contact"
            className="rounded-full border border-gray-300 bg-white/60 px-7 py-3 font-semibold backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-gray-700 dark:bg-gray-900/60 dark:hover:bg-gray-800"
          >
            Contact me
          </Link>
        </div>

        {/* Tech stack chips */}
        <ul className="mt-12 flex flex-wrap justify-center gap-2">
          {profile.techStack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-gray-200 bg-white/60 px-3 py-1 text-sm text-gray-600 backdrop-blur dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-400"
            >
              {tech}
            </li>
          ))}
        </ul>

        {/* Social link */}
        <div className="mt-6 flex flex-wrap justify-center gap-5 text-sm font-medium text-gray-500 dark:text-gray-400">
          {socialLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-blue-600 dark:hover:text-blue-400"
            >
              {link.label} ↗
            </Link>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <Link
        href="#about"
        aria-label="Scroll to about section"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 animate-bounce text-gray-400 hover:text-blue-600 sm:block"
      >
        ↓
      </Link>
    </section>
  );
}