import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Filter } from 'lucide-react';
import backend from '~backend/client';
import type { PortfolioItem } from '~backend/portfolio/list_portfolio';
import type { Category } from '~backend/portfolio/list_categories';
import { Button } from '@/components/ui/button';
import ImageLightbox from './ImageLightbox';
import PortfolioSkeleton from './skeleton/PortfolioSkeleton';
import ErrorDisplay from './ErrorDisplay';
import ErrorBoundary from './ErrorBoundary';
import { useRetry } from '../hooks/useRetry';

export default function PortfolioSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const { retry, isRetrying } = useRetry();

  const { data: categoriesData, error: categoriesError, refetch: refetchCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => backend.portfolio.listCategories(),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: portfolioData, isLoading, error: portfolioError, refetch: refetchPortfolio } = useQuery({
    queryKey: ['portfolio', selectedCategory],
    queryFn: () => backend.portfolio.listPortfolio({
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      limit: 12,
    }),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const handleRetryCategories = async () => {
    try {
      await retry(() => refetchCategories().then(result => result.data));
    } catch (err) {
      console.error('Categories retry failed:', err);
    }
  };

  const handleRetryPortfolio = async () => {
    try {
      await retry(() => refetchPortfolio().then(result => result.data));
    } catch (err) {
      console.error('Portfolio retry failed:', err);
    }
  };

  const categories = categoriesData?.categories || [];
  const portfolioItems = portfolioData?.items || [];

  const allCategories = [
    { id: 0, name: 'All', slug: 'all', description: null, created_at: new Date() },
    ...categories,
  ];

  return (
    <ErrorBoundary>
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
          {categoriesError ? (
            <div className="mb-12">
              <ErrorDisplay
                error={categoriesError as Error}
                retry={handleRetryCategories}
                title="Failed to load categories"
                description={isRetrying ? "Retrying..." : "Unable to load portfolio categories."}
              />
            </div>
          ) : (
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
                    disabled={isLoading}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio Grid */}
          {portfolioError ? (
            <ErrorDisplay
              error={portfolioError as Error}
              retry={handleRetryPortfolio}
              title="Failed to load portfolio"
              description={isRetrying ? "Retrying..." : "Unable to load portfolio items. Please try again."}
            />
          ) : isLoading ? (
            <PortfolioSkeleton />
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
    </ErrorBoundary>
  );
}

interface PortfolioCardProps {
  item: PortfolioItem;
  onImageClick: (image: string) => void;
}

function PortfolioCard({ item, onImageClick }: PortfolioCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 hover:shadow-2xl transition-all duration-300">
      <div className="aspect-square overflow-hidden">
        {imageError ? (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Image unavailable</p>
          </div>
        ) : (
          <img
            src={item.thumbnail_url || item.image_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        )}
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
              disabled={imageError}
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
