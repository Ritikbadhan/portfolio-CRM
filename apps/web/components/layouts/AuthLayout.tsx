'use client';

import { Box, Paper, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(circle at top left, ${theme.palette.primary.dark}, ${theme.palette.background.default} 60%)`,
        p: 2,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          p: { xs: 4, md: 6 },
          width: '100%',
          maxWidth: 450,
          borderRadius: 3,
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(18, 18, 18, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom color="primary">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {children}
      </Paper>
    </Box>
  );
}
