import type { ReactNode } from "react";

// Shob section er common wrapper: id + title + spacing ekhane thake
type Props = {
  id: string;
  title: string;
  children: ReactNode;
};

export default function Section({ id, title, children }: Props) {
  return (
    // scroll-mt-24 = navbar er niche jeno title na dhoke jay
    <section id={id} className="scroll-mt-24 py-20">
      <h2 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {children}
    </section>
  );
}
