import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PriceRule } from '../types/pricing';
import { priceRulesApi } from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';

const PricingConfig: React.FC = () => {
  const [priceRule, setPriceRule] = useState<Partial<PriceRule>>({
    type: 'percentage',
    active: true,
    priority: 1,
    level: 'global',
    stackable: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchRule = async () => {
        try {
          const response = await priceRulesApi.getById(id);
          setPriceRule(response.data);
        } catch (err) {
          setError('Failed to load rule details');
        }
      };
      fetchRule();
    }
  }, [id]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!priceRule.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (priceRule.value === undefined || priceRule.value <= 0) {
      newErrors.value = 'Value must be greater than 0';
    }
    
    if (priceRule.type === 'percentage' && priceRule.value !== undefined && priceRule.value > 100) {
      newErrors.value = 'Percentage cannot exceed 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (id) {
        await priceRulesApi.update(id, priceRule);
      } else {
        await priceRulesApi.create(priceRule as Omit<PriceRule, 'id'>);
      }
      navigate('/');
    } catch (err) {
      setError('Failed to save price rule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card>
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Typography variant="h5" gutterBottom>
            {id ? 'Edit' : 'Create'} Price Rule
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Rule Name"
              value={priceRule.name || ''}
              onChange={(e) => setPriceRule({ ...priceRule, name: e.target.value })}
              margin="normal"
              error={!!errors.name}
              helperText={errors.name}
            />
            
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={priceRule.description || ''}
              onChange={(e) => setPriceRule({ ...priceRule, description: e.target.value })}
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Rule Type</InputLabel>
              <Select
                value={priceRule.type}
                label="Rule Type"
                onChange={(e) => setPriceRule({ ...priceRule, type: e.target.value as PriceRule['type'] })}
              >
                <MenuItem value="percentage">Percentage Discount</MenuItem>
                <MenuItem value="fixed">Fixed Amount</MenuItem>
                <MenuItem value="bulk">Bulk Discount</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Value"
              type="number"
              value={priceRule.value || ''}
              onChange={(e) => setPriceRule({ ...priceRule, value: Number(e.target.value) })}
              margin="normal"
              error={!!errors.value}
              helperText={errors.value}
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <DatePicker
                label="Start Date"
                value={priceRule.startDate}
                onChange={(date) => setPriceRule({ ...priceRule, startDate: date || undefined })}
              />
              <DatePicker
                label="End Date"
                value={priceRule.endDate}
                onChange={(date) => setPriceRule({ ...priceRule, endDate: date || undefined })}
              />
            </Box>

            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>Advanced Settings</Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={priceRule.active || false}
                  onChange={(e) => setPriceRule({ ...priceRule, active: e.target.checked })}
                />
              }
              label="Active"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={priceRule.stackable || false}
                  onChange={(e) => setPriceRule({ ...priceRule, stackable: e.target.checked })}
                />
              }
              label="Stackable with other rules"
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                label="Priority"
                type="number"
                value={priceRule.priority || 1}
                onChange={(e) => setPriceRule({ ...priceRule, priority: Number(e.target.value) })}
                helperText="Lower number = higher priority"
                InputProps={{ inputProps: { min: 0 } }}
              />

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Rule Level</InputLabel>
                <Select
                  value={priceRule.level || 'global'}
                  label="Rule Level"
                  onChange={(e) => setPriceRule({ ...priceRule, level: e.target.value as PriceRule['level'] })}
                >
                  <MenuItem value="global">Global</MenuItem>
                  <MenuItem value="customer">Customer</MenuItem>
                  <MenuItem value="product">Product</MenuItem>
                  <MenuItem value="item">Item</MenuItem>
                  <MenuItem value="service">Service</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : (id ? 'Update' : 'Create')} Rule
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default PricingConfig;