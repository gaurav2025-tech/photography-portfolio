import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, Quote } from 'lucide-react';
import backend from '~backend/client';
import type { Testimonial } from '~backend/portfolio/list_testimonials';
import TestimonialSkeleton from './skeleton/TestimonialSkeleton';
import ErrorDisplay from './ErrorDisplay';
import ErrorBoundary from './ErrorBoundary';
import { useRetry } from '../hooks/useRetry';

export default function TestimonialsSection() {
  const { retry, isRetrying } = useRetry();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => backend.portfolio.listTestimonials({ featured: true, limit: 6 }),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const handleRetry = async () => {
    try {
      await retry(() => refetch().then(result => result.data));
    } catch (err) {
      console.error('Retry failed:', err);
    }
  };

  const testimonials = data?.testimonials || [];

  if (error) {
    return (
      <section id="testimonials" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Client Testimonials
            </h2>
          </div>
          <ErrorDisplay
            error={error as Error}
            retry={handleRetry}
            title="Failed to load testimonials"
            description={isRetrying ? "Retrying..." : "We couldn't load the client testimonials. Please try again."}
          />
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section id="testimonials" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Client Testimonials
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <TestimonialSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <ErrorBoundary>
      <section id="testimonials" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Client Testimonials
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Don't just take our word for it - hear what our clients have to say
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 group">
      <div className="mb-6">
        <Quote className="w-8 h-8 text-primary/50 mb-4" />
        <p className="text-muted-foreground leading-relaxed italic">
          "{testimonial.content}"
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-foreground">{testimonial.client_name}</h4>
          {testimonial.client_role && (
            <p className="text-sm text-muted-foreground">{testimonial.client_role}</p>
          )}
        </div>

        {testimonial.rating && (
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`w-4 h-4 ${
                  index < testimonial.rating!
                    ? 'text-yellow-500 fill-current'
                    : 'text-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
