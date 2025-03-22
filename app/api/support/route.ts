import { NextRequest, NextResponse } from 'next/server';
import { generateSupportResponse } from '@/lib/grok-ai';
import { SITE } from '@/lib/config';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse the request body
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'No support query provided' },
        { status: 400 }
      );
    }

    // Store policies that the AI can reference
    const storeDetails = {
      name: SITE.NAME,
      supportEmail: SITE.SUPPORT_EMAIL,
      refundPolicy: 'Digital goods are eligible for a refund within 24 hours of purchase if they have not been redeemed or used. For game codes and digital currencies, we cannot offer refunds once the code has been revealed or redeemed. For subscription services, refunds are processed on a pro-rata basis for the unused portion of the subscription.'
    };

    // Generate a response to the customer's query
    const response = await generateSupportResponse(query, storeDetails);

    // Return the AI-generated support response
    return NextResponse.json({
      success: true,
      query,
      response
    });
  } catch (error) {
    console.error('Error generating support response:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate support response',
        details: (error as Error).message,
        fallbackResponse: `We apologize for the inconvenience. Our AI support system is currently unavailable. Please contact our support team directly at ${SITE.SUPPORT_EMAIL} for assistance with your query.`
      },
      { status: 500 }
    );
  }
}

// Basic FAQ endpoints for common questions
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get the FAQ type from query parameters
    const { searchParams } = new URL(request.url);
    const faqType = searchParams.get('type') || 'general';

    // Define common FAQs by type
    const faqs: Record<string, Array<{ question: string; answer: string }>> = {
      general: [
        {
          question: 'How do I redeem my game code?',
          answer: 'After purchasing a game code, you will receive it in your email and in your account dashboard. To redeem, log in to the respective platform (Steam, Epic Games, etc.), find the "Redeem Code" option, and enter your code.'
        },
        {
          question: 'Are the products region-locked?',
          answer: 'Yes, some digital products are region-specific. Please check the product description for any region restrictions before purchasing.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept credit/debit cards, PayPal, and various cryptocurrencies for all purchases.'
        }
      ],
      refunds: [
        {
          question: 'What is your refund policy?',
          answer: 'Digital goods are eligible for a refund within 24 hours of purchase if they have not been redeemed or used. For game codes and digital currencies, we cannot offer refunds once the code has been revealed or redeemed.'
        },
        {
          question: 'How do I request a refund?',
          answer: `Contact our support team at ${SITE.SUPPORT_EMAIL} with your order number and reason for the refund request.`
        }
      ],
      technical: [
        {
          question: 'The code I received does not work, what should I do?',
          answer: `If your code doesn't work, please double-check that you're entering it correctly and on the right platform. If the issue persists, contact our support at ${SITE.SUPPORT_EMAIL} with your order details.`
        },
        {
          question: 'I didn\'t receive my purchase confirmation email',
          answer: 'Please check your spam folder. If you still don\'t see it, you can view your purchase in your account dashboard. For further assistance, contact our support team.'
        }
      ]
    };

    // Return the FAQs for the requested type
    return NextResponse.json({
      success: true,
      faqs: faqs[faqType] || faqs.general
    });
  } catch (error) {
    console.error('Error retrieving FAQs:', error);

    return NextResponse.json(
      { error: 'Failed to retrieve FAQs', details: (error as Error).message },
      { status: 500 }
    );
  }
}
