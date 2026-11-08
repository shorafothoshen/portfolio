import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Education from "@/components/sections/Education";
import GithubActivity from "@/components/sections/GithubActivity";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";

import Skills from "@/components/sections/Skills";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
         <Education />
 
        {/* Skills ekhon About er niche alada section */}
        <div className="bg-[#0a0a14]">
          <div className="mx-auto max-w-6xl px-4 sm:px-5">
            <Skills />
          </div>
        </div>
 
        <Projects/>
        <GithubActivity/>
        <Contact />
        <Footer/>
      </main>
    </>
  );
}