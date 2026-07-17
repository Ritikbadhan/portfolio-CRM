import { Box, Typography, Button } from '@mui/material';

export default function Home() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Portfolio CMS
      </Typography>
      <Typography variant="h6" color="text.secondary">
        The Next.js 14 App Router UI is successfully running!
      </Typography>
      <Button variant="contained" color="primary" sx={{ mt: 3 }}>
        Get Started
      </Button>
    </Box>
  );
}
