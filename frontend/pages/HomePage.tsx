import React from 'react';
import SEOHead from '../components/SEOHead';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import PortfolioSection from '../components/PortfolioSection';
import TestimonialsSection from '../components/TestimonialsSection';
import BlogSection from '../components/BlogSection';
import ContactSection from '../components/ContactSection';

export default function HomePage() {
  return (
    <div>
      <SEOHead
        title="Dreams Photography - Professional Photography & Videography Services in Mumbai"
        description="Dreams Photography offers professional photography and videography services in Mumbai. Specializing in weddings, events, portraits, and commercial photography with creative excellence and artistic vision."
        keywords="photography Mumbai, wedding photography, event photography, portrait photography, commercial photography, videography services, professional photographer Mumbai, Dreams Photography"
        url={window.location.origin}
      />
      
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PortfolioSection />
      <TestimonialsSection />
      <BlogSection />
      <ContactSection />
    </div>
  );
}
