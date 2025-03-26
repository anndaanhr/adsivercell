'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { createAdminAccount, createSellerAccount } from '@/lib/auth-roles';

// This function creates the initial admin account
export async function initializeAdminAccount() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check if an admin already exists
    const { data: existingAdmins, error: checkError } = await supabase
      .from('user_roles')
      .select('id')
      .eq('role', 'admin')
      .limit(1);

    if (checkError) {
      throw new Error(`Error checking existing admins: ${checkError.message}`);
    }

    // If admin already exists, return
    if (existingAdmins && existingAdmins.length > 0) {
      return {
        success: true,
        message: 'Admin account already exists',
        exists: true
      };
    }

    // Create the admin account with predefined credentials
    // IMPORTANT: In a real-world application, use secure environment variables or a setup wizard
    const admin = await createAdminAccount(
      'admin@zafago.com',
      'Admin@Zafago123',  // This should be changed immediately after creation
      'Zafago Admin'
    );

    revalidatePath('/admin');

    return {
      success: true,
      message: 'Admin account created successfully',
      admin: {
        id: admin.id,
        email: admin.email
      }
    };
  } catch (error) {
    console.error('Failed to initialize admin account:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// This function creates a seller account (to be used by admin)
export async function createNewSellerAccount(
  email: string,
  fullName: string,
  companyName: string
) {
  try {
    // Generate a random password that will be reset on first login
    const tempPassword = `Seller${Math.random().toString(36).slice(2, 10)}!`;

    const seller = await createSellerAccount(
      email,
      tempPassword,
      fullName,
      companyName
    );

    // In a real-world scenario, you would send an email with password reset link
    // For this example, we'll return the temporary password

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'Seller account created successfully',
      seller: {
        id: seller.id,
        email: seller.email,
        tempPassword: tempPassword // Only for demonstration, normally would not return this
      }
    };
  } catch (error) {
    console.error('Failed to create seller account:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// This function promotes a regular user to seller
export async function promoteUserToSeller(userId: string, companyName: string) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Update user role
    const { error: roleError } = await supabase
      .from('user_roles')
      .update({ role: 'seller', updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (roleError) {
      throw new Error(`Error updating user role: ${roleError.message}`);
    }

    // Create seller profile
    const { error: profileError } = await supabase
      .from('seller_profiles')
      .insert({
        id: userId,
        company_name: companyName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();

    if (profileError) {
      // Revert role change if profile creation fails
      await supabase
        .from('user_roles')
        .update({ role: 'user', updated_at: new Date().toISOString() })
        .eq('id', userId);

      throw new Error(`Error creating seller profile: ${profileError.message}`);
    }

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User promoted to seller successfully',
    };
  } catch (error) {
    console.error('Failed to promote user to seller:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Sample test demo accounts for the platform (for development purposes)
export async function createDemoAccounts() {
  try {
    // Create demo admin if none exists
    await initializeAdminAccount();

    // Create a demo seller account
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check if demo seller already exists
    const { data: existingSeller, error: checkError } = await supabase
      .from('user_roles')
      .select('id')
      .eq('role', 'seller')
      .limit(1);

    if (checkError) {
      throw new Error(`Error checking existing sellers: ${checkError.message}`);
    }

    // If seller already exists, return
    if (existingSeller && existingSeller.length > 0) {
      return {
        success: true,
        message: 'Demo accounts already exist',
        exists: true
      };
    }

    // Create the demo seller account
    await createNewSellerAccount(
      'seller@zafago.com',
      'Demo Seller',
      'Zafago Games'
    );

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'Demo accounts created successfully',
    };
  } catch (error) {
    console.error('Failed to create demo accounts:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
