import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';
import backend from '~backend/client';
import SEOHead from '../components/SEOHead';
import ErrorDisplay from '../components/ErrorDisplay';
import ErrorBoundary from '../components/ErrorBoundary';
import { useRetry } from '../hooks/useRetry';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { retry, isRetrying } = useRetry();
  
  const { data: post, isLoading, error, refetch } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => backend.portfolio.getBlogPost({ slug: slug! }),
    enabled: !!slug,
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

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20">
        <article className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="w-20 h-6 bg-muted rounded animate-pulse mb-8" />
            
            <header className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 bg-muted rounded animate-pulse" />
                <div className="w-24 h-4 bg-muted rounded animate-pulse" />
              </div>
              <div className="w-3/4 h-16 bg-muted rounded animate-pulse mb-6" />
              <div className="space-y-2">
                <div className="w-full h-4 bg-muted rounded animate-pulse" />
                <div className="w-2/3 h-4 bg-muted rounded animate-pulse" />
              </div>
            </header>

            <div className="aspect-video bg-muted rounded-2xl animate-pulse mb-12" />

            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="w-full h-4 bg-muted rounded animate-pulse" />
                  <div className="w-4/5 h-4 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen pt-20">
          <article className="py-20">
            <div className="container mx-auto px-4 max-w-4xl">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>

              <ErrorDisplay
                error={error as Error}
                retry={handleRetry}
                title="Failed to load blog post"
                description={isRetrying ? "Retrying..." : "We couldn't load this blog post. It may not exist or there was a connection issue."}
              />
            </div>
          </article>
        </div>
      </ErrorBoundary>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Blog post not found</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (date: string | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Generate SEO data
  const seoTitle = post.meta_title || `${post.title} | Dreams Photography Blog`;
  const seoDescription = post.meta_description || post.excerpt || `Read ${post.title} on Dreams Photography blog. Professional photography and videography insights, tips, and stories.`;
  const seoKeywords = post.meta_keywords || 'photography blog, photography tips, Dreams Photography, professional photography, videography';
  const currentUrl = `${window.location.origin}/blog/${post.slug}`;

  return (
    <ErrorBoundary>
      <div className="min-h-screen pt-20">
        <SEOHead
          title={seoTitle}
          description={seoDescription}
          keywords={seoKeywords}
          image={post.featured_image_url || '/og-image.jpg'}
          url={currentUrl}
          type="article"
        />
        
        <article className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            <header className="mb-12">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar className="w-4 h-4" />
                {formatDate(post.published_at)}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
              )}
            </header>

            {post.featured_image_url && (
              <div className="mb-12 rounded-2xl overflow-hidden">
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            )}

            <div 
              className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </div>
    </ErrorBoundary>
  );
}
