import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  error: Error | null;
  retry?: () => void;
  title?: string;
  description?: string;
}

export default function ErrorDisplay({ 
  error, 
  retry, 
  title = "Something went wrong",
  description 
}: ErrorDisplayProps) {
  const defaultDescription = description || error?.message || "An unexpected error occurred. Please try again.";

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="bg-destructive/10 rounded-full p-4 w-fit mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {title}
        </h3>
        <p className="text-muted-foreground mb-6">
          {defaultDescription}
        </p>
        {retry && (
          <Button onClick={retry} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
