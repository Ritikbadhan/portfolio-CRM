'use client';

import { ThemeProvider as MUIThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useMemo, useState } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          // Placeholder palette
        },
      }),
    [mode]
  );

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}
