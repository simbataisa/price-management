import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Container, Box, Tabs, Tab, AppBar, Toolbar, Typography } from '@mui/material';
import PriceCalculator from './components/PriceCalculator';
import PricingConfig from './components/PricingConfig';
import PriceRulesList from './components/PriceRulesList';
import VoucherConfig from './components/voucher/VoucherConfig';
import VoucherList from './components/voucher/VoucherList';
import ComboConfig from './components/combo/ComboConfig';
import ComboList from './components/combo/ComboList';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';

// Navigation component that will be present on all pages
const Navigation = () => {
  const location = useLocation();
  const [value, setValue] = useState(() => {
    if (location.pathname.includes('/vouchers')) return 2;
    if (location.pathname.includes('/combos')) return 3;
    if (location.pathname.includes('/rules')) return 1;
    return 0;
  });
  const { showLoading, hideLoading } = useLoading();
  
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    showLoading();
    // Add a small delay to make the loading effect visible
    setTimeout(() => {
      setValue(newValue);
      hideLoading();
    }, 300);
  };

  return (
    <AppBar position="static" color="default" sx={{ mb: 3 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Pricing Management
        </Typography>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Calculator" onClick={() => window.location.href = '/'} />
          <Tab label="Price Rules" onClick={() => window.location.href = '/rules'} />
          <Tab label="Vouchers" onClick={() => window.location.href = '/vouchers'} />
          <Tab label="Combos" onClick={() => window.location.href = '/combos'} />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

function App() {
  return (
    <Router>
      <Container maxWidth="lg">
        <Navigation />
        <Box sx={{ my: 4 }}>
          <Routes>
            <Route path="/" element={<PriceCalculator />} />
            <Route path="/rules" element={<PriceRulesList />} />
            <Route path="/rules/new" element={<PricingConfig />} />
            <Route path="/rules/edit/:id" element={<PricingConfig />} />
            <Route path="/vouchers" element={<VoucherList />} />
            <Route path="/vouchers/new" element={<VoucherConfig />} />
            <Route path="/vouchers/edit/:id" element={<VoucherConfig />} />
            <Route path="/combos" element={<ComboList />} />
            <Route path="/combos/new" element={<ComboConfig />} />
            <Route path="/combos/edit/:id" element={<ComboConfig />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

// Wrap the App component with the LoadingProvider
const AppWithLoading = () => {
  return (
    <LoadingProvider>
      <App />
    </LoadingProvider>
  );
};

export default AppWithLoading;
