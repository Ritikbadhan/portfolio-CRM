'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { maintenanceSchema } from './settings.schema';
import { useUpdateSettingsMutation, ISettings } from '../../store/features/settings/settingsApi';

interface Props {
  initialData?: ISettings['maintenance'];
  onDirtyChange: (isDirty: boolean) => void;
}

export function MaintenanceForm({ initialData, onDirtyChange }: Props) {
  const [updateSettings, { isLoading, error, isSuccess }] = useUpdateSettingsMutation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: initialData || { enabled: false, message: '' },
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
      onSubmit={handleSubmit((d) => updateSettings({ maintenance: d as ISettings['maintenance'] }))}
      sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600 }}
    >
      {!!error && <Alert severity="error">Failed to update maintenance settings</Alert>}

      <Controller
        name="enabled"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
            }
            label="Enable Maintenance Mode"
          />
        )}
      />

      <TextField
        label="Maintenance Message"
        {...register('message')}
        error={!!errors.message}
        helperText={errors.message?.message as string}
        multiline
        rows={4}
        fullWidth
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={!isDirty || isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          Save Maintenance
        </Button>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message="Maintenance mode updated"
      />
    </Box>
  );
}
