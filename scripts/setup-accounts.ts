/**
 * Zafago Account Setup Script
 *
 * This script is used to create initial admin and seller accounts for the Zafago platform.
 * It should be run once during initial setup or for demo purposes.
 *
 * To run this script:
 * 1. Make sure your .env file is set up with Supabase credentials
 * 2. Run: `npx tsx scripts/setup-accounts.ts`
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import readline from 'readline';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Create Supabase client with service role key (admin privileges)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Setup readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt user for input
const prompt = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

// Create admin user
async function createAdminUser(email: string, password: string, fullName: string) {
  try {
    // Check if admin already exists
    const { data: existingAdmins, error: checkError } = await supabase
      .from('user_roles')
      .select('id')
      .eq('role', 'admin')
      .limit(1);

    if (checkError) {
      throw new Error(`Error checking existing admins: ${checkError.message}`);
    }

    if (existingAdmins && existingAdmins.length > 0) {
      console.log('⚠️ Admin account already exists! Skipping admin creation...');
      return;
    }

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

    console.log(`✅ Admin account created successfully! Email: ${authData.user.email}`);
    return authData.user.id;
  } catch (error) {
    console.error('Failed to create admin account:', error);
    throw error;
  }
}

// Create seller user
async function createSellerUser(email: string, password: string, fullName: string, companyName: string) {
  try {
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
        company_name: companyName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      throw new Error(`Error creating seller profile: ${profileError.message}`);
    }

    console.log(`✅ Seller account created successfully! Email: ${authData.user.email}`);
    return authData.user.id;
  } catch (error) {
    console.error('Failed to create seller account:', error);
    throw error;
  }
}

// Create demo user
async function createNormalUser(email: string, password: string, fullName: string) {
  try {
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
      throw new Error(`Error creating user: ${authError?.message}`);
    }

    console.log(`✅ Regular user account created successfully! Email: ${authData.user.email}`);
    return authData.user.id;
  } catch (error) {
    console.error('Failed to create user account:', error);
    throw error;
  }
}

// Main function
async function main() {
  console.log('🚀 Zafago Account Setup Script');
  console.log('==============================\n');

  try {
    // Verify Supabase connection
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw new Error(`Supabase connection error: ${error.message}`);
    }

    console.log('Connected to Supabase successfully!\n');

    // Ask whether to create demo accounts or custom accounts
    const createDemo = await prompt('Do you want to create demo accounts with default credentials? (y/n): ');

    if (createDemo.toLowerCase() === 'y') {
      // Create demo accounts
      await createAdminUser('admin@zafago.com', 'Admin@Zafago123', 'Zafago Admin');
      await createSellerUser('seller@zafago.com', 'Seller@Zafago123', 'Demo Seller', 'Zafago Games');
      await createNormalUser('user@zafago.com', 'User@Zafago123', 'Demo User');

      console.log('\n📝 Demo Account Credentials:');
      console.log('---------------------------');
      console.log('Admin Email: admin@zafago.com');
      console.log('Admin Password: Admin@Zafago123');
      console.log('');
      console.log('Seller Email: seller@zafago.com');
      console.log('Seller Password: Seller@Zafago123');
      console.log('');
      console.log('User Email: user@zafago.com');
      console.log('User Password: User@Zafago123');
    } else {
      // Create custom admin account
      console.log('\n📝 Create Admin Account:');
      const adminEmail = await prompt('Enter admin email: ');
      const adminPassword = await prompt('Enter admin password (min 8 chars, must include uppercase, lowercase, number): ');
      const adminName = await prompt('Enter admin full name: ');

      await createAdminUser(adminEmail, adminPassword, adminName);

      // Ask whether to create a seller account
      const createSeller = await prompt('\nDo you want to create a seller account? (y/n): ');

      if (createSeller.toLowerCase() === 'y') {
        console.log('\n📝 Create Seller Account:');
        const sellerEmail = await prompt('Enter seller email: ');
        const sellerPassword = await prompt('Enter seller password (min 8 chars, must include uppercase, lowercase, number): ');
        const sellerName = await prompt('Enter seller full name: ');
        const companyName = await prompt('Enter company name: ');

        await createSellerUser(sellerEmail, sellerPassword, sellerName, companyName);
      }
    }

    console.log('\n✅ Account setup completed successfully!');
    console.log('You can now login to the Zafago platform with these accounts.');

  } catch (error) {
    console.error('\n❌ Error during account setup:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the main function
main();
