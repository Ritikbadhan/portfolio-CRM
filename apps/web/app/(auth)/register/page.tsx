'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Link, Box, Alert } from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '../../../components/layouts/AuthLayout';
import { TextField } from '../../../components/ui/form/TextField';
import { PasswordField } from '../../../components/ui/form/PasswordField';
import { useRegisterMutation } from '../../../store/features/auth/authApi';
import PublicRoute from '../../../components/guards/PublicRoute';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [register, { isLoading, error }] = useRegisterMutation();

  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await register(data).unwrap();
      router.push('/dashboard');
    } catch (err) {
      // Error handled by RTK Query
    }
  };

  return (
    <PublicRoute>
      <AuthLayout title="Create an Account" subtitle="Join to start managing your portfolio">
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(error as any)?.data?.message || 'Registration failed. Please try again.'}
            </Alert>
          )}

          <TextField
            control={control}
            name="name"
            label="Full Name"
            autoComplete="name"
            autoFocus
            margin="normal"
          />

          <TextField
            control={control}
            name="email"
            label="Email Address"
            autoComplete="email"
            margin="normal"
          />

          <PasswordField
            control={control}
            name="password"
            label="Password"
            autoComplete="new-password"
            margin="normal"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ mt: 2, mb: 3 }}
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Link component={NextLink} href="/login" variant="body2" color="secondary">
              Already have an account? Sign in
            </Link>
          </Box>
        </Box>
      </AuthLayout>
    </PublicRoute>
  );
}
