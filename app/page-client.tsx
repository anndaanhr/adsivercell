'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { PersonalizedRecommendations } from '@/components/personalized-recommendations';
import { RecentlyViewed } from '@/components/recently-viewed';
import { InitializeAccountsButton } from '@/components/initialize-accounts-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export function ClientRecommendations() {
  const { user } = useAuth();
  const [showSetup, setShowSetup] = useState(false);

  return (
    <>
      {user && (
        <section className="container px-4">
          <RecentlyViewed userId={user.id} />
        </section>
      )}

      <section className="container px-4">
        <PersonalizedRecommendations />
      </section>

      {/* Dev tools for account initialization - only visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <section className="container px-4 mt-8">
          <Card className="border-dashed border-muted">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg text-muted-foreground">Developer Tools</CardTitle>
                </div>
                <button
                  onClick={() => setShowSetup(!showSetup)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {showSetup ? 'Hide' : 'Show'}
                </button>
              </div>
              <CardDescription>
                Tools for setting up and testing the platform (only visible in development mode)
              </CardDescription>
            </CardHeader>
            {showSetup && (
              <CardContent>
                <InitializeAccountsButton />
              </CardContent>
            )}
          </Card>
        </section>
      )}
    </>
  );
}
