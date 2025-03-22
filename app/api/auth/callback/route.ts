import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/';
  const type = searchParams.get('type');

  // If this is an error redirect
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if (error) {
    console.error('Error in auth callback:', error, errorDescription);
    return NextResponse.redirect(
      new URL(`/auth/error?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(errorDescription || '')}`, request.url)
    );
  }

  // Handle email verification
  if (type === 'email_change' || type === 'signup') {
    return NextResponse.redirect(
      new URL('/auth/verify-email?status=success', request.url)
    );
  }

  // Handle password reset
  if (type === 'recovery') {
    return NextResponse.redirect(
      new URL('/auth/reset-password', request.url)
    );
  }

  // Handle OAuth callbacks and email confirmations
  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('Error exchanging code for session:', error);
        throw error;
      }
    } catch (error) {
      console.error('Unexpected error during auth callback:', error);
      return NextResponse.redirect(
        new URL('/auth/error', request.url)
      );
    }
  }

  // Redirect to the specified next URL or home
  return NextResponse.redirect(new URL(next, request.url));
}
