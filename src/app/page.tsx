import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";


const placeholders = ["about", "skills", "projects", "contact"] as const;

export default function Home() {
  return (
    <>
     <Navbar/>
      <main>
       <Hero/>
        {placeholders.map((id) => (
          <section
            key={id}
            id={id}
            className="flex min-h-[60vh] scroll-mt-[72px] items-center justify-center bg-[#0c0c18] text-2xl capitalize text-white even:bg-[#0a0a14]"
          >
            {id} section
          </section>
        ))}
      </main>
    </>
  );
}