'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, TextField, Button, CircularProgress, Alert, Snackbar } from '@mui/material';
import { useState, useEffect } from 'react';
import { useUpdateProfileMutation } from '../../store/features/auth/authApi';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
});

interface Props {
  initialData?: { name: string; email: string };
  onDirtyChange: (isDirty: boolean) => void;
}

export function ProfileForm({ initialData, onDirtyChange }: Props) {
  const [updateProfile, { isLoading, error, isSuccess }] = useUpdateProfileMutation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData || { name: '', email: '' },
  });

  useEffect(() => onDirtyChange(isDirty), [isDirty, onDirtyChange]);
  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);
  useEffect(() => {
    if (isSuccess) {
      setSnackbarOpen(true);
      reset(undefined, { keepValues: true });
    }
  }, [isSuccess, reset]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit((d) => updateProfile(d))}
      sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600 }}
    >
      {!!error && <Alert severity="error">Failed to update profile</Alert>}
      <TextField
        label="Full Name"
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message as string}
        fullWidth
      />
      <TextField
        label="Email Address"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message as string}
        fullWidth
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={!isDirty || isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          Save Profile
        </Button>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message="Profile updated"
      />
    </Box>
  );
}
