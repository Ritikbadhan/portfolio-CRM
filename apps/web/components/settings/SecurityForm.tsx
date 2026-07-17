'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, TextField, Button, CircularProgress, Alert, Snackbar } from '@mui/material';
import { useState, useEffect } from 'react';
import { useChangePasswordMutation } from '../../store/features/auth/authApi';

const securitySchema = z
  .object({
    currentPassword: z.string().min(6, 'Must be at least 6 characters'),
    newPassword: z.string().min(6, 'Must be at least 6 characters'),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

interface Props {
  onDirtyChange: (isDirty: boolean) => void;
}

export function SecurityForm({ onDirtyChange }: Props) {
  const [changePassword, { isLoading, error, isSuccess }] = useChangePasswordMutation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(securitySchema),
    defaultValues: { currentPassword: '', newPassword: '' },
  });

  useEffect(() => onDirtyChange(isDirty), [isDirty, onDirtyChange]);
  useEffect(() => {
    if (isSuccess) {
      setSnackbarOpen(true);
      reset({ currentPassword: '', newPassword: '' });
    }
  }, [isSuccess, reset]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit((d) => changePassword(d))}
      sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600 }}
    >
      {!!error && (
        <Alert severity="error">
          Failed to change password. Ensure current password is correct.
        </Alert>
      )}
      <TextField
        type="password"
        label="Current Password"
        {...register('currentPassword')}
        error={!!errors.currentPassword}
        helperText={errors.currentPassword?.message as string}
        fullWidth
      />
      <TextField
        type="password"
        label="New Password"
        {...register('newPassword')}
        error={!!errors.newPassword}
        helperText={errors.newPassword?.message as string}
        fullWidth
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={!isDirty || isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          Change Password
        </Button>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message="Password changed successfully"
      />
    </Box>
  );
}
