import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

// Role types
export type UserRole = 'user' | 'seller' | 'admin';

// Create a server-side Supabase client
const createServerSupabaseClient = () => {
  const cookieStore = cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: '', ...options });
      },
    },
  });
};

// Get current authenticated user
export const getCurrentUser = cache(async () => {
  const supabase = createServerSupabaseClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    return null;
  }

  return session.user;
});

// Get user role
export const getUserRole = cache(async (): Promise<UserRole | null> => {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || !data) {
    console.error('Error fetching user role:', error);
    return null;
  }

  return data.role as UserRole;
});

// Role-based route protection
export async function requireAuth(
  redirectTo: string = '/auth/login'
) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(redirectTo);
  }

  return user;
}

export async function requireAdmin(
  redirectTo: string = '/unauthorized'
) {
  await requireAuth('/auth/login');

  const role = await getUserRole();

  if (role !== 'admin') {
    redirect(redirectTo);
  }

  return true;
}

export async function requireSeller(
  redirectTo: string = '/unauthorized'
) {
  await requireAuth('/auth/login');

  const role = await getUserRole();

  if (role !== 'seller' && role !== 'admin') {
    redirect(redirectTo);
  }

  return true;
}

// Client-side role checks using React hooks
export const useIsAdmin = async (): Promise<boolean> => {
  const role = await getUserRole();
  return role === 'admin';
};

export const useIsSeller = async (): Promise<boolean> => {
  const role = await getUserRole();
  return role === 'seller' || role === 'admin';
};

// Function to create admin account (for developer use)
export async function createAdminAccount(
  email: string,
  password: string,
  fullName: string
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Create the user with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName
    }
  });

  if (authError || !authData.user) {
    throw new Error(`Error creating admin user: ${authError?.message}`);
  }

  // Set the user's role to admin
  const { error: roleError } = await supabase
    .from('user_roles')
    .update({ role: 'admin' })
    .eq('id', authData.user.id);

  if (roleError) {
    throw new Error(`Error setting admin role: ${roleError.message}`);
  }

  return authData.user;
}

// Function to create seller account (for developer use)
export async function createSellerAccount(
  email: string,
  password: string,
  fullName: string,
  companyName: string
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Create the user with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName
    }
  });

  if (authError || !authData.user) {
    throw new Error(`Error creating seller user: ${authError?.message}`);
  }

  // Set the user's role to seller
  const { error: roleError } = await supabase
    .from('user_roles')
    .update({ role: 'seller' })
    .eq('id', authData.user.id);

  if (roleError) {
    throw new Error(`Error setting seller role: ${roleError.message}`);
  }

  // Create seller profile
  const { error: profileError } = await supabase
    .from('seller_profiles')
    .insert({
      id: authData.user.id,
      company_name: companyName
    });

  if (profileError) {
    throw new Error(`Error creating seller profile: ${profileError.message}`);
  }

  return authData.user;
}
