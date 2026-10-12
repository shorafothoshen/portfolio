export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-24">
      <section id="home" className="flex min-h-screen scroll-mt-24 flex-col justify-center">
        <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-7xl">
          Hi, I&apos;m Your Name.
          <br />I build things for the web.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-400">
          Ekhane tomar kaj er ek line summary lekho.
        </p>
      </section>

      <section id="about" className="min-h-[70vh] scroll-mt-24 pt-24">
        <h2 className="mb-4 text-4xl font-bold tracking-tight">About</h2>
        <p className="max-w-xl text-lg text-gray-600 dark:text-gray-400">
          Ekhane nijer somporke likho: tumi ke, ki koro, ki bhalobasho.
        </p>
      </section>

      <section id="projects" className="min-h-[70vh] scroll-mt-24 pt-24">
        <h2 className="mb-4 text-4xl font-bold tracking-tight">Projects</h2>
        <p className="max-w-xl text-lg text-gray-600 dark:text-gray-400">
          Tomar shera projects gulo ekhane dekhao.
        </p>
      </section>

      <section id="skills" className="min-h-[70vh] scroll-mt-24 pt-24">
        <h2 className="mb-4 text-4xl font-bold tracking-tight">Skills</h2>
        <p className="max-w-xl text-lg text-gray-600 dark:text-gray-400">
          Tumi je language ar tool gulo jano shegulo ekhane likho.
        </p>
      </section>

      <section id="contact" className="min-h-[70vh] scroll-mt-24 pt-24">
        <h2 className="mb-4 text-4xl font-bold tracking-tight">Contact</h2>
        <p className="max-w-xl text-lg text-gray-600 dark:text-gray-400">
          Tomar email ar social link ekhane daw.
        </p>
      </section>
    </main>
  );
}