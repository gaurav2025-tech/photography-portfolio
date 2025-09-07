import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Camera } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: 'Home', path: '/' },
    { href: '#about', label: 'About', path: '/' },
    { href: '#services', label: 'Services', path: '/' },
    { href: '#portfolio', label: 'Portfolio', path: '/' },
    { href: '#testimonials', label: 'Testimonials', path: '/' },
    { href: '/blog', label: 'Blog', path: '/blog' },
    { href: '#contact', label: 'Contact', path: '/' },
  ];

  const handleNavClick = (href: string, path: string) => {
    setIsMobileMenuOpen(false);
    
    if (path !== location.pathname) {
      return; // Let React Router handle navigation
    }
    
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-md border-b border-border/50' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
              <Camera className="w-8 h-8" />
              <span>DreamsPhoto</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                link.path === '/blog' ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href, link.path)}
                    className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                  >
                    {link.label}
                  </button>
                )
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-16 left-0 right-0 bg-background border-b border-border p-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                link.path === '/blog' ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href, link.path)}
                    className="text-left text-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                  >
                    {link.label}
                  </button>
                )
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
