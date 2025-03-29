import React from 'react';
import type { AppProps } from 'next/app';
import { AppBar, Toolbar, Typography, Tabs, Tab, Container, Box } from '@mui/material';
import { useRouter } from 'next/router';
import { LoadingProvider } from '../contexts/LoadingContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [value, setValue] = React.useState(() => {
    if (router.pathname.includes('/vouchers')) return 2;
    if (router.pathname.includes('/combos')) return 3;
    if (router.pathname.includes('/rules')) return 1;
    return 0;
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    // Navigate based on tab index
    switch (newValue) {
      case 0:
        router.push('/');
        break;
      case 1:
        router.push('/rules');
        break;
      case 2:
        router.push('/vouchers');
        break;
      case 3:
        router.push('/combos');
        break;
      default:
        router.push('/');
    }
    setValue(newValue);
  };

  return (
    <LoadingProvider>
      <Container maxWidth="lg">
        <AppBar position="static" color="default" sx={{ mb: 3 }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Pricing Management
            </Typography>
            <Tabs value={value} onChange={handleChange}>
              <Tab label="Calculator" />
              <Tab label="Price Rules" />
              <Tab label="Vouchers" />
              <Tab label="Combos" />
            </Tabs>
          </Toolbar>
        </AppBar>
        <Box sx={{ my: 4 }}>
          <Component {...pageProps} />
        </Box>
      </Container>
    </LoadingProvider>
  );
}

export default MyApp;