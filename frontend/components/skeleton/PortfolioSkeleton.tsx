import React from 'react';

export default function PortfolioSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="aspect-square bg-card/50 rounded-2xl animate-pulse border border-border/50" />
      ))}
    </div>
  );
}
