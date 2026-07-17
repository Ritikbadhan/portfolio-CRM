'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Button, CircularProgress, Alert, Snackbar } from '@mui/material';
import { useState, useEffect } from 'react';
import { seoSchema } from './settings.schema';
import { useUpdateSeoMutation, ISettings } from '../../store/features/settings/settingsApi';

interface Props {
  initialData?: ISettings['seo'];
  onDirtyChange: (isDirty: boolean) => void;
}

export function SeoForm({ initialData, onDirtyChange }: Props) {
  const [updateSeo, { isLoading, error, isSuccess }] = useUpdateSeoMutation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm({
    resolver: zodResolver(seoSchema),
    defaultValues: initialData || { metaTags: [], keywords: [] },
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
      onSubmit={handleSubmit((d) => updateSeo({ seo: d as ISettings['seo'] }))}
      sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600 }}
    >
      {!!error && <Alert severity="error">Failed to update SEO settings</Alert>}

      <Controller
        name="keywords"
        control={control}
        render={({ field }) => (
          <TextField
            label="Keywords (comma separated)"
            fullWidth
            value={field.value.join(', ')}
            onChange={(e) =>
              field.onChange(
                e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
            helperText="Enter keywords separated by commas"
          />
        )}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={!isDirty || isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          Save SEO
        </Button>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message="SEO settings updated"
      />
    </Box>
  );
}
