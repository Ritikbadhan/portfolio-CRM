'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Link, Box, Alert } from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '../../../../components/layouts/AuthLayout';
import { PasswordField } from '../../../../components/ui/form/PasswordField';
import { useResetPasswordMutation } from '../../../../store/features/auth/authApi';
import PublicRoute from '../../../../components/guards/PublicRoute';

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [resetPassword, { isLoading, error, isSuccess }] = useResetPasswordMutation();

  const { control, handleSubmit } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      await resetPassword({ token: params.token, password: data.password }).unwrap();
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      // Error handled by RTK
    }
  };

  return (
    <PublicRoute>
      <AuthLayout title="Create New Password" subtitle="Please enter your new password below">
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(error as any)?.data?.message ||
                'Failed to reset password. The link might be expired.'}
            </Alert>
          )}

          {isSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Password reset successfully! Redirecting to your dashboard...
            </Alert>
          )}

          <PasswordField
            control={control}
            name="password"
            label="New Password"
            margin="normal"
            disabled={isLoading || isSuccess}
          />

          <PasswordField
            control={control}
            name="confirmPassword"
            label="Confirm New Password"
            margin="normal"
            disabled={isLoading || isSuccess}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading || isSuccess}
            sx={{ mt: 2, mb: 3 }}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
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
