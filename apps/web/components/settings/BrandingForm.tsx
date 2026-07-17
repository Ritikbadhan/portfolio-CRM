'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Typography,
  Stack,
  Avatar,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { brandingSchema } from './settings.schema';
import {
  useUpdateBrandingMutation,
  useUploadLogoMutation,
  useUploadFaviconMutation,
  ISettings,
} from '../../store/features/settings/settingsApi';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface Props {
  initialData?: ISettings['branding'];
  onDirtyChange: (isDirty: boolean) => void;
}

export function BrandingForm({ initialData, onDirtyChange }: Props) {
  const [updateBranding, { isLoading, error, isSuccess }] = useUpdateBrandingMutation();
  const [uploadLogo, { isLoading: logoLoading }] = useUploadLogoMutation();
  const [uploadFavicon, { isLoading: favLoading }] = useUploadFaviconMutation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(brandingSchema),
    defaultValues: initialData || { logoUrl: '', faviconUrl: '' },
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

  const onSubmit = async (data: ISettings['branding']) => {
    await updateBranding({ branding: data });
  };

  const handleUploadLogo = async () => {
    await uploadLogo().unwrap();
  };

  const handleUploadFavicon = async () => {
    await uploadFavicon().unwrap();
  };

  const logoPreview = watch('logoUrl');

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 600 }}
    >
      {!!error && <Alert severity="error">Failed to update branding settings</Alert>}

      <Box sx={{ p: 3, border: '1px dashed grey', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Logo
        </Typography>
        <Stack direction="row" spacing={3} alignItems="center">
          <Avatar src={logoPreview || undefined} sx={{ width: 80, height: 80 }} variant="rounded">
            LOGO
          </Avatar>
          <Stack spacing={2} flexGrow={1}>
            <TextField
              label="Logo URL"
              {...register('logoUrl')}
              error={!!errors.logoUrl}
              helperText={errors.logoUrl?.message as string}
              fullWidth
              size="small"
            />
            <Button
              variant="outlined"
              startIcon={logoLoading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
              onClick={handleUploadLogo}
              disabled={logoLoading}
            >
              Simulate Upload Logo
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ p: 3, border: '1px dashed grey', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Favicon
        </Typography>
        <Stack direction="row" spacing={3} alignItems="center">
          <Stack spacing={2} flexGrow={1}>
            <TextField
              label="Favicon URL"
              {...register('faviconUrl')}
              error={!!errors.faviconUrl}
              helperText={errors.faviconUrl?.message as string}
              fullWidth
              size="small"
            />
            <Button
              variant="outlined"
              startIcon={favLoading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
              onClick={handleUploadFavicon}
              disabled={favLoading}
            >
              Simulate Upload Favicon
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={!isDirty || isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          Save Branding
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message="Branding updated successfully"
      />
    </Box>
  );
}
