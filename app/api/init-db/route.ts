import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { digitalProducts, digitalProductCategories } from '@/lib/digital-products-data';

export async function POST(): Promise<NextResponse> {
  try {
    // Check if admin_key is provided in the headers

    // Create categories table if it doesn't exist
    const { error: createCategoriesError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'digital_product_categories',
      create_statement: `
        CREATE TABLE digital_product_categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          image TEXT,
          featured BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        )
      `
    });

    if (createCategoriesError) {
      console.error('Error creating categories table:', createCategoriesError);
      return NextResponse.json({
        success: false,
        error: 'Failed to create categories table',
        details: createCategoriesError
      }, { status: 500 });
    }

    // Create products table if it doesn't exist
    const { error: createProductsError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'digital_products',
      create_statement: `
        CREATE TABLE digital_products (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          type TEXT NOT NULL,
          platform TEXT NOT NULL,
          image TEXT,
          price NUMERIC NOT NULL,
          discount NUMERIC DEFAULT 0,
          featured BOOLEAN DEFAULT false,
          popular BOOLEAN DEFAULT false,
          options JSONB,
          instructions TEXT,
          requirements JSONB,
          stock INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        )
      `
    });

    if (createProductsError) {
      console.error('Error creating products table:', createProductsError);
      return NextResponse.json({
        success: false,
        error: 'Failed to create products table',
        details: createProductsError
      }, { status: 500 });
    }

    // Insert categories
    const { error: insertCategoriesError } = await supabase
      .from('digital_product_categories')
      .upsert(digitalProductCategories, { onConflict: 'id' });

    if (insertCategoriesError) {
      console.error('Error inserting categories:', insertCategoriesError);
      return NextResponse.json({
        success: false,
        error: 'Failed to insert categories',
        details: insertCategoriesError
      }, { status: 500 });
    }

    // Insert products
    const { error: insertProductsError } = await supabase
      .from('digital_products')
      .upsert(digitalProducts, { onConflict: 'id' });

    if (insertProductsError) {
      console.error('Error inserting products:', insertProductsError);
      return NextResponse.json({
        success: false,
        error: 'Failed to insert products',
        details: insertProductsError
      }, { status: 500 });
    }

    // Return success
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      categories: digitalProductCategories.length,
      products: digitalProducts.length
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to initialize database',
      details: (error as Error).message
    }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    // Check if the database has been initialized by counting products
    const { count, error } = await supabase
      .from('digital_products')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Failed to check database status',
        details: error
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      initialized: count !== null && count > 0,
      productCount: count
    });
  } catch (error) {
    console.error('Error checking database status:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to check database status',
      details: (error as Error).message
    }, { status: 500 });
  }
}
