'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Shield, Store, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function UserRoleBadge() {
  const supabase = createClientComponentClient();
  const [role, setRole] = useState<'admin' | 'seller' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUserRole() {
      try {
        setLoading(true);

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setRole(null);
          return;
        }

        // Get user role from user_roles table
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          setRole(null);
          return;
        }

        setRole(data.role as 'admin' | 'seller' | 'user');
      } catch (error) {
        console.error('Error in getUserRole:', error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    getUserRole();
  }, [supabase]);

  if (loading || !role) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant={role === 'admin' ? 'destructive' : role === 'seller' ? 'default' : 'secondary'}
            className="gap-1"
          >
            {role === 'admin' && <Shield className="h-3 w-3" />}
            {role === 'seller' && <Store className="h-3 w-3" />}
            {role === 'user' && <User className="h-3 w-3" />}
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {role === 'admin' && 'You have administrator privileges'}
          {role === 'seller' && 'You have seller privileges'}
          {role === 'user' && 'You have standard user privileges'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
