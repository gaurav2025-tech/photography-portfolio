import { useState, useCallback } from 'react';

interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: boolean;
}

export function useRetry() {
  const [isRetrying, setIsRetrying] = useState(false);

  const retry = useCallback(async <T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> => {
    const { maxAttempts = 3, delay = 1000, backoff = true } = options;
    
    setIsRetrying(true);
    
    let attempt = 1;
    
    while (attempt <= maxAttempts) {
      try {
        const result = await fn();
        setIsRetrying(false);
        return result;
      } catch (error) {
        if (attempt === maxAttempts) {
          setIsRetrying(false);
          throw error;
        }
        
        const waitTime = backoff ? delay * Math.pow(2, attempt - 1) : delay;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        attempt++;
      }
    }
    
    setIsRetrying(false);
    throw new Error('Max retry attempts reached');
  }, []);

  return { retry, isRetrying };
}
