import React from 'react';
import {
  Typography,
  Box,
  Divider,
  Card,
  CardContent,
  Chip,
  Paper
} from '@mui/material';
import { PriceCalculationResult } from '../../types/pricing';

interface CalculationResultProps {
  calculation: PriceCalculationResult | null;
}

const CalculationResult: React.FC<CalculationResultProps> = ({ calculation }) => {
  if (!calculation) return null;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Price Calculation Result
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">
          Base Price: ${calculation.originalPrice.toFixed(2)}
        </Typography>
        <Typography variant="h6" color="primary">
          Final Price: ${calculation.finalPrice.toFixed(2)}
        </Typography>
      </Box>
      
      {calculation.savings > 0 ? (
        <Typography variant="subtitle1" color="success.main" gutterBottom>
          You Save: ${calculation.savings.toFixed(2)} ({calculation.savingsPercentage.toFixed(1)}%)
        </Typography>
      ) : (
        <Typography variant="subtitle1" color="error.main" gutterBottom>
          Additional Charges: ${Math.abs(calculation.savings).toFixed(2)} ({Math.abs(calculation.savingsPercentage).toFixed(1)}%)
        </Typography>
      )}
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="h6" gutterBottom>
        Applied Rules:
      </Typography>
      
      {calculation.breakdown.length === 0 ? (
        <Typography>No rules were applied</Typography>
      ) : (
        calculation.breakdown.map((item, index) => (
          <Card key={index} sx={{ mb: 2, bgcolor: 'background.default' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1">{item.rule.name}</Typography>
                <Typography 
                  variant="subtitle1" 
                  color={item.discount > 0 ? "success.main" : "error.main"}
                >
                  {item.discount > 0 ? "-" : "+"}${Math.abs(item.discount).toFixed(2)}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {item.rule.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Chip size="small" label={`Level: ${item.rule.level}`} />
                <Chip size="small" label={`Priority: ${item.rule.priority}`} />
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Paper>
  );
};

export default CalculationResult;