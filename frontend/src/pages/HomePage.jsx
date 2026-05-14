import HeroSection from "@/components/sections/HeroSection";
import AboutPreview from "@/components/sections/AboutPreview";
import ServicesGrid from "@/components/sections/ServicesGrid";
import PortfolioPreview from "@/components/sections/PortfolioPreview";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import WhyUs from "@/components/sections/WhyUs";
import Testimonials from "@/components/sections/Testimonials";
import LeadMagnet from "@/components/sections/LeadMagnet";
import FinalCTA from "@/components/sections/FinalCTA";
import MarqueeDivider from "@/components/site/MarqueeDivider";

export default function HomePage() {
  return (
    <main data-testid="home-page">
      <HeroSection />
      <AboutPreview />
      <MarqueeDivider items={["Brand", "Web", "Motion", "Strategy", "Story", "Identity", "Growth"]} />
      <ServicesGrid />
      <PortfolioPreview />
      <ProcessTimeline />
      <MarqueeDivider items={["Discover", "Strategy", "Design", "Develop", "Launch", "Scale"]} speed={45} />
      <WhyUs />
      <Testimonials />
      <LeadMagnet />
      <FinalCTA />
    </main>
  );
}
