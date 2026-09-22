import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/sections/Hero";
import { ProblemSolution } from "../components/sections/ProblemSolution";
import { HowItWorks } from "../components/sections/HowItWorks";
import { AudienceSplit } from "../components/sections/AudienceSplit";
import { Monetization } from "../components/sections/Monetization";
import { FAQ } from "../components/sections/FAQ";
import { FinalCTA } from "../components/sections/FinalCTA";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />
      <main>
        <Hero />
        <ProblemSolution />
        <HowItWorks />
        <AudienceSplit />
        <Monetization />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
