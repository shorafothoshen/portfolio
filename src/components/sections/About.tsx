import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="scroll-mt-[64px] bg-[#0c0c18] py-14 sm:scroll-mt-[72px] sm:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-5 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
        {/* Left: image (mobile e text er niche, md+ e bam dike) */}
        <div className="relative order-2 mx-auto w-full max-w-sm md:order-1 md:max-w-none">
          {/* dotted accent */}
          <div
            className="absolute -left-3 -top-3 h-24 w-24 opacity-40 sm:-left-5 sm:-top-5"
            style={{
              backgroundImage: "radial-gradient(#9ca3af 1.5px, transparent 1.5px)",
              backgroundSize: "16px 16px",
            }}
          />
          {/* offset gradient frame */}
          <div className="absolute -bottom-3 -right-3 h-full w-full rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 sm:-bottom-4 sm:-right-4" />

          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#12121f]">
            <Image
              src="/about-image.png"
              alt="Shorafot Hoshen"
              fill
              sizes="(min-width: 768px) 45vw, 90vw"
              className="object-cover object-top"
            />
          </div>
        </div>

        {/* Right: content (mobile e prothome, md+ e dan dike) */}
        <div className="order-1 md:order-2">
          <p className="text-sm font-medium uppercase tracking-widest text-violet-400">
            About Me
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
            I Build the Screen and the System Behind It
          </h2>

          <div className="mt-5 space-y-4 text-sm leading-7 text-gray-300 sm:text-base sm:leading-8">
            <p>
              I&apos;m a Computer Science and Engineering student who loves coding,
              solving problems and building useful applications. I&apos;m drawn to
              full-stack development because I enjoy working on both sides of an app
              and seeing how everything fits together.
            </p>
            <p>
              On the front end, I build interactive user interfaces. On the back end,
              I develop APIs, handle authentication with JWT and role-based access
              control, and manage data with MySQL and MongoDB. I also practice Data
              Structures and Algorithms regularly to sharpen my problem-solving.
            </p>
            <p>
              Beyond web development, I work on IoT projects, exploring how software
              and hardware can solve real-world problems. I&apos;m always happy to
              connect with other developers, share ideas and work on interesting
              projects.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}