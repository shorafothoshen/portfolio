import Link from "next/link";
import Section from "@/components/ui/Section";
import { profile, socialLinks } from "@/data/portfolio";

export default function Contact() {
  return (
    <Section id="contact" title="Contact">
      <p className="max-w-xl text-lg text-gray-600 dark:text-gray-400">
        Want to work together or just say hi? Feel free to reach out.
      </p>

      <Link
        href={`mailto:${profile.email}`}
        className="mt-6 inline-block rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        {profile.email}
      </Link>

      <div className="mt-8 flex flex-wrap gap-3">
        {socialLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-gray-300 px-5 py-2 font-medium transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            {link.label} ↗
          </Link>
        ))}
      </div>
    </Section>
  );
}
