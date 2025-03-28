import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Box, Tabs, Tab } from '@mui/material';
import PriceCalculator from './components/PriceCalculator';
import PricingConfig from './components/PricingConfig';
import PriceRulesList from './components/PriceRulesList';

function App() {
  return (
    <Router>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Routes>
            <Route path="/" element={<PricingDashboard />} />
            <Route path="/rules/new" element={<PricingConfig />} />
            <Route path="/rules/edit/:id" element={<PricingConfig />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

// New component that integrates all pricing components
function PricingDashboard() {
  const [tabValue, setTabValue] = useState(0);
  // Add a key to force re-render of PriceCalculator when switching tabs
  const [calculatorKey, setCalculatorKey] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // If switching to calculator tab, update the key to force refresh
    if (newValue === 0) {
      setCalculatorKey(prev => prev + 1);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Price Calculator" />
          <Tab label="Pricing Rules" />
        </Tabs>
      </Box>
      
      {tabValue === 0 && (
        <PriceCalculator key={calculatorKey} />
      )}
      
      {tabValue === 1 && (
        <Box>
          <PriceRulesList />
        </Box>
      )}
    </Box>
  );
}

export default App;
