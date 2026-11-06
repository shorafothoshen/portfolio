import type { ReactNode } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";

type Info = { icon: ReactNode; label: string; value: string };

// নিজের তথ্য দিয়ে replace করো
const info: Info[] = [
  { icon: <Mail className="h-3.5 w-3.5" />, label: "Email", value: "you@example.com" },
  { icon: <Phone className="h-3.5 w-3.5" />, label: "Phone", value: "+880 1XXX-XXXXXX" },
  { icon: <MapPin className="h-3.5 w-3.5" />, label: "Location", value: "Dhaka, Bangladesh" },
];

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-[72px] bg-[#0a0a14] py-14">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_2fr_auto]">
          {/* Heading */}
          <div className="flex items-start gap-4">
            <Mail className="mt-1 h-7 w-7 shrink-0 text-violet-400" />
            <div>
              <h2 className="text-lg font-semibold text-white">Let&apos;s Work Together!</h2>
              <p className="mt-2 text-xs leading-5 text-gray-300">
                I&apos;m currently available for freelance work. Let&apos;s build something
                great together.
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="grid gap-5 sm:grid-cols-3">
            {info.map((i) => (
              <div key={i.label}>
                <p className="flex items-center gap-2 text-xs text-violet-400">
                  {i.icon} {i.label}
                </p>
                <p className="mt-2 text-xs text-white">{i.value}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a
            href="mailto:you@example.com"
            className="inline-flex items-center justify-center gap-3 rounded-md bg-violet-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-violet-600"
          >
            Get in Touch <Send className="h-4 w-4" />
          </a>
        </div>

        <p className="mt-12 border-t border-white/10 pt-6 text-xs text-gray-400">
          © {new Date().getFullYear()} Shorafot Hoshen. All rights reserved.
        </p>
      </div>
    </section>
  );
}