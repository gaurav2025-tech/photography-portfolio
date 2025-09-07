import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Filter } from 'lucide-react';
import backend from '~backend/client';
import type { PortfolioItem } from '~backend/portfolio/list_portfolio';
import type { Category } from '~backend/portfolio/list_categories';
import { Button } from '@/components/ui/button';
import ImageLightbox from './ImageLightbox';

export default function PortfolioSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => backend.portfolio.listCategories(),
  });

  const { data: portfolioData, isLoading } = useQuery({
    queryKey: ['portfolio', selectedCategory],
    queryFn: () => backend.portfolio.listPortfolio({
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      limit: 12,
    }),
  });

  const categories = categoriesData?.categories || [];
  const portfolioItems = portfolioData?.items || [];

  const allCategories = [
    { id: 0, name: 'All', slug: 'all', description: null, created_at: new Date() },
    ...categories,
  ];

  return (
    <section id="portfolio" className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Our Portfolio
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Explore our collection of stunning photography and videography work
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Filter className="w-4 h-4" />
            Filter by category:
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {allCategories.map((category) => (
              <Button
                key={category.slug}
                variant={selectedCategory === category.slug ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.slug)}
                className="rounded-full transition-all duration-300"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="aspect-square bg-card/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : portfolioItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No portfolio items found for this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {portfolioItems.map((item) => (
              <PortfolioCard
                key={item.id}
                item={item}
                onImageClick={setLightboxImage}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <ImageLightbox
          image={lightboxImage}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </section>
  );
}

interface PortfolioCardProps {
  item: PortfolioItem;
  onImageClick: (image: string) => void;
}

function PortfolioCard({ item, onImageClick }: PortfolioCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 hover:shadow-2xl transition-all duration-300">
      <div className="aspect-square overflow-hidden">
        <img
          src={item.thumbnail_url || item.image_url}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
          {item.description && (
            <p className="text-white/80 text-sm mb-4 line-clamp-2">{item.description}</p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-xs uppercase tracking-wider">
              {item.category_name}
            </span>
            <button
              onClick={() => onImageClick(item.image_url)}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
