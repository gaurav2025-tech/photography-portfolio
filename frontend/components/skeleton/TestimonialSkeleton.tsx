import React from 'react';

export default function TestimonialSkeleton() {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 animate-pulse">
      <div className="w-8 h-8 bg-muted rounded mb-4" />
      <div className="space-y-2 mb-6">
        <div className="w-full h-4 bg-muted rounded" />
        <div className="w-full h-4 bg-muted rounded" />
        <div className="w-3/4 h-4 bg-muted rounded" />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="w-24 h-5 bg-muted rounded mb-2" />
          <div className="w-16 h-3 bg-muted rounded" />
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-4 h-4 bg-muted rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
