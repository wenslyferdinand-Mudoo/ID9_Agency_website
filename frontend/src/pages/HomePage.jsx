import HeroSection from "@/components/sections/HeroSection";
import AboutPreview from "@/components/sections/AboutPreview";
import ServicesGrid from "@/components/sections/ServicesGrid";
import PortfolioPreview from "@/components/sections/PortfolioPreview";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import WhyUs from "@/components/sections/WhyUs";
import Testimonials from "@/components/sections/Testimonials";
import LeadMagnet from "@/components/sections/LeadMagnet";
import FinalCTA from "@/components/sections/FinalCTA";

export default function HomePage() {
  return (
    <main data-testid="home-page">
      <HeroSection />
      <AboutPreview />
      <ServicesGrid />
      <PortfolioPreview />
      <ProcessTimeline />
      <WhyUs />
      <Testimonials />
      <LeadMagnet />
      <FinalCTA />
    </main>
  );
}
