"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, CheckCircle, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface EmailVerificationProps {
  email?: string;
  status?: 'pending' | 'success' | 'error';
  message?: string;
}

export function EmailVerification({
  email,
  status = 'pending',
  message
}: EmailVerificationProps) {
  const router = useRouter();

  const getContent = () => {
    switch (status) {
      case 'success':
        return {
          title: 'Email Verified',
          description: 'Your email has been successfully verified',
          icon: <CheckCircle className="h-12 w-12 text-green-500" />,
          message: message || 'You can now sign in to your account.',
          primaryAction: {
            label: 'Sign In',
            href: '/auth/login'
          }
        };
      case 'error':
        return {
          title: 'Verification Failed',
          description: 'We couldn\'t verify your email',
          icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
          message: message || 'The verification link may have expired or is invalid. Please try again.',
          primaryAction: {
            label: 'Go to Homepage',
            href: '/'
          },
          secondaryAction: {
            label: 'Try Sign In',
            href: '/auth/login'
          }
        };
      default:
        return {
          title: 'Verify Your Email',
          description: `We've sent a verification link to ${email || 'your email'}`,
          icon: <Mail className="h-12 w-12 text-primary" />,
          message: 'Please check your inbox and click the verification link to verify your email address. If you don\'t see the email, check your spam folder.',
          primaryAction: {
            label: 'Return to Sign In',
            href: '/auth/login'
          }
        };
    }
  };

  const content = getContent();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-6">
          {content.icon}
        </div>
        <CardTitle className="text-2xl">{content.title}</CardTitle>
        <CardDescription>{content.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {content.message}
        </p>
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        {content.primaryAction && (
          <Button asChild>
            <Link href={content.primaryAction.href}>
              {content.primaryAction.label}
            </Link>
          </Button>
        )}
        {content.secondaryAction && (
          <Button variant="outline" asChild>
            <Link href={content.secondaryAction.href}>
              {content.secondaryAction.label}
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
