import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import EcosystemCurtain from '@/components/landing/EcosystemCurtain';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FaqSection from '@/components/landing/FaqSection';
import StickyMobileCTA from '@/components/landing/StickyMobileCTA';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden font-sans selection:bg-[#2CB78A] selection:text-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Grid */}
      <FeaturesSection />

      {/* Curtain Reveal Experience (Design Option 3) */}
      <EcosystemCurtain />

      {/* Social Proof Section (New) */}
      <TestimonialsSection />

      {/* FAQ Section (New) */}
      <FaqSection />

      {/* Footer */}
      <Footer />

      {/* Mobile Conversion Booster (New) */}
      <StickyMobileCTA />
    </div>
  );
}
