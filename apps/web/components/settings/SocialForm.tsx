'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Button, CircularProgress, Alert, Snackbar } from '@mui/material';
import { useState, useEffect } from 'react';
import { socialSchema } from './settings.schema';
import { useUpdateSocialMutation, ISettings } from '../../store/features/settings/settingsApi';

interface Props {
  initialData?: ISettings['social'];
  onDirtyChange: (isDirty: boolean) => void;
}

export function SocialForm({ initialData, onDirtyChange }: Props) {
  const [updateSocial, { isLoading, error, isSuccess }] = useUpdateSocialMutation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(socialSchema),
    defaultValues: initialData || { github: '', linkedin: '', twitter: '' },
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
      onSubmit={handleSubmit((d) => updateSocial({ social: d as ISettings['social'] }))}
      sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600 }}
    >
      {!!error && <Alert severity="error">Failed to update social settings</Alert>}
      <TextField
        label="GitHub URL"
        {...register('github')}
        error={!!errors.github}
        helperText={errors.github?.message as string}
        fullWidth
      />
      <TextField
        label="LinkedIn URL"
        {...register('linkedin')}
        error={!!errors.linkedin}
        helperText={errors.linkedin?.message as string}
        fullWidth
      />
      <TextField
        label="Twitter URL"
        {...register('twitter')}
        error={!!errors.twitter}
        helperText={errors.twitter?.message as string}
        fullWidth
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={!isDirty || isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          Save Social Links
        </Button>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message="Social links updated"
      />
    </Box>
  );
}
