'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Button, CircularProgress, Alert, Snackbar } from '@mui/material';
import { useState, useEffect } from 'react';
import { generalSchema } from './settings.schema';
import { useUpdateSettingsMutation, ISettings } from '../../store/features/settings/settingsApi';

interface Props {
  initialData?: ISettings['general'];
  onDirtyChange: (isDirty: boolean) => void;
}

export function GeneralForm({ initialData, onDirtyChange }: Props) {
  const [updateSettings, { isLoading, error, isSuccess }] = useUpdateSettingsMutation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(generalSchema),
    defaultValues: initialData || { siteName: '', siteDescription: '' },
  });

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (isSuccess) {
      setSnackbarOpen(true);
      reset(undefined, { keepValues: true }); // reset dirty state
    }
  }, [isSuccess, reset]);

  const onSubmit = async (data: ISettings['general']) => {
    await updateSettings({ general: data });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600 }}
    >
      {!!error && <Alert severity="error">Failed to update general settings</Alert>}

      <TextField
        label="Site Name"
        {...register('siteName')}
        error={!!errors.siteName}
        helperText={errors.siteName?.message as string}
        fullWidth
      />

      <TextField
        label="Site Description"
        {...register('siteDescription')}
        error={!!errors.siteDescription}
        helperText={errors.siteDescription?.message as string}
        multiline
        rows={4}
        fullWidth
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!isDirty || isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          Save Changes
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message="General Settings updated successfully"
      />
    </Box>
  );
}
