'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Link, Box, Alert } from '@mui/material';
import NextLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthLayout } from '../../../components/layouts/AuthLayout';
import { TextField } from '../../../components/ui/form/TextField';
import { PasswordField } from '../../../components/ui/form/PasswordField';
import { useLoginMutation } from '../../../store/features/auth/authApi';
import PublicRoute from '../../../components/guards/PublicRoute';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [login, { isLoading, error }] = useLoginMutation();

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data).unwrap();
      const returnUrl = searchParams.get('returnUrl') || '/dashboard';
      router.push(returnUrl);
    } catch (err) {
      // Error is handled by RTK Query and displayed in the alert
    }
  };

  return (
    <PublicRoute>
      <AuthLayout title="Welcome Back" subtitle="Log in to manage your portfolio">
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(error as any)?.data?.message || 'Login failed. Please try again.'}
            </Alert>
          )}

          <TextField
            control={control}
            name="email"
            label="Email Address"
            autoComplete="email"
            autoFocus
            margin="normal"
          />

          <PasswordField
            control={control}
            name="password"
            label="Password"
            autoComplete="current-password"
            margin="normal"
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 3 }}>
            <Link component={NextLink} href="/forgot-password" variant="body2" color="primary">
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ mb: 3 }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Link component={NextLink} href="/register" variant="body2" color="secondary">
              Don't have an account? Sign up
            </Link>
          </Box>
        </Box>
      </AuthLayout>
    </PublicRoute>
  );
}
