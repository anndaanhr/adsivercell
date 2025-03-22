"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Database, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function InitializeDbButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const checkDbStatus = async () => {
    try {
      const response = await fetch('/api/init-db');
      const data = await response.json();

      if (data.success && data.initialized) {
        setStatus('success');
        setMessage(`Database is already initialized with ${data.productCount} products.`);
      }
    } catch (error) {
      console.error('Error checking database status:', error);
    }
  };

  // Check the database status on mount
  useState(() => {
    checkDbStatus();
  });

  const initializeDatabase = async () => {
    try {
      setIsLoading(true);
      setStatus('idle');
      setMessage('');

      const response = await fetch('/api/init-db', {
        method: 'POST'
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(`Database initialized successfully with ${data.categories} categories and ${data.products} products.`);
        toast({
          title: 'Success',
          description: 'Database initialized successfully.',
        });
      } else {
        setStatus('error');
        setMessage(`Error: ${data.error}`);
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      setStatus('error');
      setMessage(`Error: ${(error as Error).message}`);
      toast({
        title: 'Error',
        description: 'Failed to initialize database. See console for details.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={initializeDatabase}
        disabled={isLoading || status === 'success'}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Initializing...
          </>
        ) : (
          <>
            <Database className="mr-2 h-4 w-4" />
            Initialize Database
          </>
        )}
      </Button>

      {status === 'success' && (
        <Alert variant="default" className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {status === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
