import Link from "next/link";
import { profile } from "@/data/portfolio";

export default function Hero() {
  return (
    <section id="home" className="flex min-h-screen scroll-mt-24 flex-col justify-center py-20">
      <p className="mb-4 font-medium text-blue-600 dark:text-blue-400">Hi, I&apos;m</p>
      <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-7xl">
        {profile.name}
      </h1>
      <p className="mt-3 text-2xl font-semibold text-gray-500 dark:text-gray-400">
        {profile.role}
      </p>
      <p className="mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-400">
        {profile.tagline}
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="#projects"
          className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          View Projects
        </Link>
        <Link
          href="#contact"
          className="rounded-full border border-gray-300 px-6 py-3 font-semibold transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          Contact me
        </Link>
      </div>
    </section>
  );
}
