import React from 'react';

export default function BlogPostSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border/50 animate-pulse">
      <div className="aspect-video bg-muted" />
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 bg-muted rounded" />
          <div className="w-20 h-4 bg-muted rounded" />
        </div>
        <div className="w-3/4 h-6 bg-muted rounded mb-3" />
        <div className="space-y-2 mb-4">
          <div className="w-full h-4 bg-muted rounded" />
          <div className="w-2/3 h-4 bg-muted rounded" />
        </div>
        <div className="w-20 h-4 bg-muted rounded" />
      </div>
    </div>
  );
}
