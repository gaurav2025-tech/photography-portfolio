import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import backend from '~backend/client';
import SEOHead from '../components/SEOHead';
import BlogPostSkeleton from '../components/skeleton/BlogPostSkeleton';
import ErrorDisplay from '../components/ErrorDisplay';
import ErrorBoundary from '../components/ErrorBoundary';
import { useRetry } from '../hooks/useRetry';
import type { BlogPost } from '~backend/portfolio/list_blog';

export default function BlogPage() {
  const { retry, isRetrying } = useRetry();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['blog'],
    queryFn: () => backend.portfolio.listBlog({ published: true }),
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

  if (error) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen pt-20">
          <SEOHead
            title="Blog | Dreams Photography - Photography Tips & Insights"
            description="Explore our photography blog for professional tips, behind-the-scenes stories, and insights from Dreams Photography. Learn about wedding photography, portrait sessions, and more."
            keywords="photography blog, photography tips, wedding photography tips, portrait photography, Dreams Photography blog, photography tutorials"
            url={`${window.location.origin}/blog`}
          />
          
          <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Our Blog
                </h1>
                <p className="text-xl text-muted-foreground">
                  Insights, tips, and stories from the world of photography and videography
                </p>
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="container mx-auto px-4">
              <ErrorDisplay
                error={error as Error}
                retry={handleRetry}
                title="Failed to load blog posts"
                description={isRetrying ? "Retrying..." : "We couldn't load the blog posts. Please try again."}
              />
            </div>
          </section>
        </div>
      </ErrorBoundary>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20">
        <SEOHead
          title="Blog | Dreams Photography - Photography Tips & Insights"
          description="Explore our photography blog for professional tips, behind-the-scenes stories, and insights from Dreams Photography. Learn about wedding photography, portrait sessions, and more."
          keywords="photography blog, photography tips, wedding photography tips, portrait photography, Dreams Photography blog, photography tutorials"
          url={`${window.location.origin}/blog`}
        />
        
        <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Our Blog
              </h1>
              <p className="text-xl text-muted-foreground">
                Insights, tips, and stories from the world of photography and videography
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <BlogPostSkeleton key={index} />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  const posts = data?.posts || [];

  return (
    <ErrorBoundary>
      <div className="min-h-screen pt-20">
        <SEOHead
          title="Blog | Dreams Photography - Photography Tips & Insights"
          description="Explore our photography blog for professional tips, behind-the-scenes stories, and insights from Dreams Photography. Learn about wedding photography, portrait sessions, and more."
          keywords="photography blog, photography tips, wedding photography tips, portrait photography, Dreams Photography blog, photography tutorials"
          url={`${window.location.origin}/blog`}
        />
        
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Our Blog
              </h1>
              <p className="text-xl text-muted-foreground">
                Insights, tips, and stories from the world of photography and videography
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">No blog posts available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </ErrorBoundary>
  );
}

interface BlogPostCardProps {
  post: BlogPost;
}

function BlogPostCard({ post }: BlogPostCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const formatDate = (date: string | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <article className="group bg-card rounded-2xl overflow-hidden border border-border/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
      {post.featured_image_url && !imageError && (
        <div className="aspect-video overflow-hidden">
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Calendar className="w-4 h-4" />
          {formatDate(post.published_at)}
        </div>
        <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}
        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
        >
          Read More
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
