'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Button, CircularProgress, Alert, Snackbar } from '@mui/material';
import { useState, useEffect } from 'react';
import { contactSchema } from './settings.schema';
import { useUpdateContactMutation, ISettings } from '../../store/features/settings/settingsApi';

interface Props {
  initialData?: ISettings['contact'];
  onDirtyChange: (isDirty: boolean) => void;
}

export function ContactForm({ initialData, onDirtyChange }: Props) {
  const [updateContact, { isLoading, error, isSuccess }] = useUpdateContactMutation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: initialData || { email: '', phone: '', address: '' },
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
      onSubmit={handleSubmit((d) => updateContact({ contact: d as ISettings['contact'] }))}
      sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600 }}
    >
      {!!error && <Alert severity="error">Failed to update contact settings</Alert>}
      <TextField
        label="Contact Email"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message as string}
        fullWidth
      />
      <TextField
        label="Phone Number"
        {...register('phone')}
        error={!!errors.phone}
        helperText={errors.phone?.message as string}
        fullWidth
      />
      <TextField
        label="Address"
        {...register('address')}
        error={!!errors.address}
        helperText={errors.address?.message as string}
        multiline
        rows={3}
        fullWidth
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={!isDirty || isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          Save Contact
        </Button>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message="Contact settings updated"
      />
    </Box>
  );
}
