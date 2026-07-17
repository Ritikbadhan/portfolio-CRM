'use client';

import { Box, Typography, Button, Paper } from '@mui/material';
import NextLink from 'next/link';

export default function UnauthorizedPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at top right, #3f51b5, #000000 70%)',
        p: 2,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          p: { xs: 4, md: 6 },
          textAlign: 'center',
          maxWidth: 500,
          borderRadius: 3,
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(18, 18, 18, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <Typography variant="h1" color="error" fontWeight={900} sx={{ mb: 2 }}>
          403
        </Typography>
        <Typography variant="h4" color="text.primary" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          You do not have the required clearance or permissions to view this resource. Please
          contact your administrator if you believe this is a mistake.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          component={NextLink}
          href="/dashboard"
          size="large"
        >
          Return to Dashboard
        </Button>
      </Paper>
    </Box>
  );
}
