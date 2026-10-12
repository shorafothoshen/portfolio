import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

// Ei file shudhu section gulo ek jaygay sajay. Asol code shob alada file e.
export default function Home() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-5">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
