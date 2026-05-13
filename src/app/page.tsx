import Navigation from '@/components/Navigation';
import HeroBanner from '@/components/HeroBanner';
import PortfolioSection from '@/components/PortfolioSection';
import ExperienceSection from '@/components/ExperienceSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import WatermarkParallax from '@/components/WatermarkParallax';

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="flex flex-col relative">
        <WatermarkParallax />
        <HeroBanner />
        <PortfolioSection />
        <ExperienceSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
