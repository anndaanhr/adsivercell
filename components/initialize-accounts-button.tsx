'use client';

import { useState } from 'react';
import { RefreshCw, User, Shield, ShieldCheck, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { createDemoAccounts, initializeAdminAccount, createNewSellerAccount } from '@/app/actions/create-special-accounts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface InitializeAccountsButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
}

export function InitializeAccountsButton({ variant = 'default' }: InitializeAccountsButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    admin?: { id: string; email: string };
    seller?: { id: string; email: string; tempPassword: string };
    exists?: boolean;
  } | null>(null);

  const handleInitializeAdmin = async () => {
    setIsLoading(true);
    try {
      const response = await initializeAdminAccount();
      setResult(response);
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDemoAccounts = async () => {
    setIsLoading(true);
    try {
      const response = await createDemoAccounts();
      setResult(response);
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button
          onClick={handleInitializeAdmin}
          disabled={isLoading}
          variant={variant}
          className="flex-1"
        >
          {isLoading ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Shield className="mr-2 h-4 w-4" />
          )}
          Initialize Admin Account
        </Button>

        <Button
          onClick={handleCreateDemoAccounts}
          disabled={isLoading}
          variant="secondary"
          className="flex-1"
        >
          {isLoading ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Store className="mr-2 h-4 w-4" />
          )}
          Create Demo Accounts
        </Button>
      </div>

      {result && (
        <Card className={result.success ? 'border-green-500' : 'border-red-500'}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Account Initialization {result.success ? 'Success' : 'Failed'}</CardTitle>
            <CardDescription>{result.message}</CardDescription>
          </CardHeader>

          {result.success && (
            <CardContent>
              {result.exists ? (
                <Alert>
                  <ShieldCheck className="h-4 w-4" />
                  <AlertTitle>Accounts already exist</AlertTitle>
                  <AlertDescription>
                    The required accounts already exist in the database. No new accounts were created.
                  </AlertDescription>
                </Alert>
              ) : (
                <Accordion type="single" collapsible>
                  {result.admin && (
                    <AccordionItem value="admin">
                      <AccordionTrigger className="text-sm font-medium">
                        <div className="flex items-center">
                          <ShieldCheck className="mr-2 h-4 w-4 text-blue-500" />
                          Admin Account Created
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 rounded-md bg-muted p-3 text-sm">
                          <div><strong>Email:</strong> admin@zafago.com</div>
                          <div><strong>Password:</strong> Admin@Zafago123</div>
                          <div className="text-xs text-muted-foreground">
                            For security, please change this password after your first login.
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {result.seller && (
                    <AccordionItem value="seller">
                      <AccordionTrigger className="text-sm font-medium">
                        <div className="flex items-center">
                          <Store className="mr-2 h-4 w-4 text-green-500" />
                          Seller Account Created
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 rounded-md bg-muted p-3 text-sm">
                          <div><strong>Email:</strong> seller@zafago.com</div>
                          <div><strong>Password:</strong> {result.seller.tempPassword}</div>
                          <div className="text-xs text-muted-foreground">
                            This is a temporary password. In a real application, a password reset link would be sent to the user's email.
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              )}
            </CardContent>
          )}

          <CardFooter className="pt-2">
            <div className="text-sm text-muted-foreground">
              {result.success
                ? 'You can now log in with these accounts. Admin has full access to manage the platform, and sellers can list products.'
                : 'Please check the error message and try again. Contact support if the issue persists.'}
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
