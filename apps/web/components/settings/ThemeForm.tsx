'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Button, CircularProgress, Alert, Snackbar, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import { themeSchema } from './settings.schema';
import { useUpdateThemeMutation, ISettings } from '../../store/features/settings/settingsApi';

interface Props {
  initialData?: ISettings['theme'];
  onDirtyChange: (isDirty: boolean) => void;
}

export function ThemeForm({ initialData, onDirtyChange }: Props) {
  const [updateTheme, { isLoading, error, isSuccess }] = useUpdateThemeMutation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<ISettings['theme']>({
    resolver: zodResolver(themeSchema),
    defaultValues: initialData || {
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      mode: 'system',
    },
  });

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  useEffect(() => {
    if (isSuccess) {
      setSnackbarOpen(true);
      reset(undefined, { keepValues: true });
    }
  }, [isSuccess, reset]);

  const onSubmit = async (data: ISettings['theme']) => {
    await updateTheme({ theme: data });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600 }}
    >
      {!!error && <Alert severity="error">Failed to update theme settings</Alert>}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Primary Color"
          type="color"
          {...register('primaryColor')}
          error={!!errors.primaryColor}
          helperText={errors.primaryColor?.message as string}
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{ '& input': { height: 50, cursor: 'pointer' } }}
        />
        <TextField
          label="Secondary Color"
          type="color"
          {...register('secondaryColor')}
          error={!!errors.secondaryColor}
          helperText={errors.secondaryColor?.message as string}
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{ '& input': { height: 50, cursor: 'pointer' } }}
        />
      </Box>

      <Controller
        name="mode"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            select
            label="Default Theme Mode"
            fullWidth
            error={!!errors.mode}
            helperText={errors.mode?.message as string}
          >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
            <MenuItem value="system">System Default</MenuItem>
          </TextField>
        )}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={!isDirty || isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          Save Theme
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message="Theme updated successfully"
      />
    </Box>
  );
}
