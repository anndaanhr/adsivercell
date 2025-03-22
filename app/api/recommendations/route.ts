import { NextRequest, NextResponse } from 'next/server';
import { chatWithGrok, generateProductRecommendations } from '@/lib/grok-ai';
import { digitalProducts } from '@/lib/digital-products-data';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse the request body
    const body = await request.json();
    const { userPreferences } = body;

    if (!userPreferences) {
      return NextResponse.json(
        { error: 'No user preferences provided' },
        { status: 400 }
      );
    }

    // Get available products
    const availableProductNames = digitalProducts.map(product => product.title);

    // Generate recommendations
    const recommendedProductNames = await generateProductRecommendations(
      userPreferences,
      availableProductNames
    );

    // Get the full product details for the recommended products
    const recommendedProducts = digitalProducts.filter(product =>
      recommendedProductNames.includes(product.title)
    );

    // Return the recommendations
    return NextResponse.json({
      success: true,
      recommendations: recommendedProducts,
      userPreferences
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);

    return NextResponse.json(
      { error: 'Failed to generate recommendations', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get user preferences from query parameters
    const { searchParams } = new URL(request.url);
    const userPreferences = searchParams.get('preferences');
    const limit = parseInt(searchParams.get('limit') || '5', 10);

    if (!userPreferences) {
      // If no preferences provided, return featured or popular products
      const featuredProducts = digitalProducts
        .filter(product => product.featured || product.popular)
        .slice(0, limit);

      return NextResponse.json({
        success: true,
        recommendations: featuredProducts,
        type: 'featured'
      });
    }

    // Get available products
    const availableProductNames = digitalProducts.map(product => product.title);

    // Generate recommendations
    const recommendedProductNames = await generateProductRecommendations(
      userPreferences,
      availableProductNames
    );

    // Get the full product details for the recommended products
    const recommendedProducts = digitalProducts
      .filter(product => recommendedProductNames.includes(product.title))
      .slice(0, limit);

    // Return the recommendations
    return NextResponse.json({
      success: true,
      recommendations: recommendedProducts,
      userPreferences,
      type: 'personalized'
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);

    return NextResponse.json(
      { error: 'Failed to generate recommendations', details: (error as Error).message },
      { status: 500 }
    );
  }
}
