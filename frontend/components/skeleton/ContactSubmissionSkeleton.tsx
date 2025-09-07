import React from 'react';

export default function ContactSubmissionSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-32 h-6 bg-muted rounded" />
            <div className="w-16 h-5 bg-muted rounded" />
          </div>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-40 h-4 bg-muted rounded" />
            <div className="w-24 h-4 bg-muted rounded" />
          </div>
          <div className="w-48 h-4 bg-muted rounded" />
        </div>
        <div className="w-6 h-6 bg-muted rounded" />
      </div>
    </div>
  );
}
