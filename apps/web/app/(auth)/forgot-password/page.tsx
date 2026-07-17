'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Link, Box, Alert } from '@mui/material';
import NextLink from 'next/link';
import { AuthLayout } from '../../../components/layouts/AuthLayout';
import { TextField } from '../../../components/ui/form/TextField';
import { useForgotPasswordMutation } from '../../../store/features/auth/authApi';
import PublicRoute from '../../../components/guards/PublicRoute';
import { useState } from 'react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();
  const [isSuccess, setIsSuccess] = useState(false);

  const { control, handleSubmit } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await forgotPassword(data).unwrap();
      setIsSuccess(true);
    } catch (err) {
      setIsSuccess(false);
    }
  };

  return (
    <PublicRoute>
      <AuthLayout title="Reset Password" subtitle="Enter your email to receive a reset link">
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          {error && !isSuccess && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(error as any)?.data?.message || 'Failed to send reset email.'}
            </Alert>
          )}

          {isSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              If an account with that email exists, we have sent a password reset link.
            </Alert>
          )}

          <TextField
            control={control}
            name="email"
            label="Email Address"
            autoComplete="email"
            autoFocus
            margin="normal"
            disabled={isSuccess || isLoading}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading || isSuccess}
            sx={{ mt: 2, mb: 3 }}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Link component={NextLink} href="/login" variant="body2" color="secondary">
              Back to Login
            </Link>
          </Box>
        </Box>
      </AuthLayout>
    </PublicRoute>
  );
}
