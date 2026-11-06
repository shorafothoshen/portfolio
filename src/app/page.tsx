import Navbar from "@/components/layout/Navbar";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        <div className="bg-[#0c0c18]">
          <div className="mx-auto grid max-w-6xl gap-x-12 px-5 md:grid-cols-[1fr_1.8fr]">
            <About />
            <Skills />
          </div>
        </div>

        <Projects />
        <Contact />
      </main>
    </>
  );
}