import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEOHead({ 
  title = 'Dreams Photography - Professional Photography & Videography Services',
  description = 'Professional photography and videography services in Mumbai. Specializing in weddings, events, portraits, and commercial photography with creative excellence.',
  keywords = 'photography, videography, wedding photography, event photography, portrait photography, Mumbai photographer, professional photography services',
  image = '/og-image.jpg',
  url = '',
  type = 'website'
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // Open Graph meta tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:image', image, true);
    
    if (url) {
      updateMetaTag('og:url', url, true);
    }

    // Twitter Card meta tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Additional SEO meta tags
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('author', 'Dreams Photography');

    // Cleanup function to avoid memory leaks
    return () => {
      // Note: We don't remove meta tags on cleanup as they should persist
      // until the next page/component updates them
    };
  }, [title, description, keywords, image, url, type]);

  return null; // This component doesn't render anything
}
