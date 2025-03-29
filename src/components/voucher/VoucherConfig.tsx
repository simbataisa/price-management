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
  Grid as MuiGrid,
  Chip,
} from '@mui/material';

// Create a wrapper for Grid to fix TypeScript errors
const Grid = MuiGrid as any;

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate, useParams } from 'react-router-dom';

interface Voucher {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchaseAmount?: number;
  maxUsage?: number;
  usageCount: number;
  startDate?: Date;
  endDate?: Date;
  active: boolean;
  customerRestriction?: 'new' | 'existing' | 'all';
  productRestriction?: string[];
  categoryRestriction?: string[];
  stackable: boolean;
  stackPriority?: number;
  applicableServices?: string[];
  applicableAddOns?: string[];
}

// Mock API for vouchers
const voucherApi = {
  getById: (id: string) => Promise.resolve({ 
    data: {
      id,
      code: 'SAMPLE10',
      description: 'Sample voucher',
      type: 'percentage',
      value: 10,
      minPurchaseAmount: 100,
      maxUsage: 1,
      usageCount: 0,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      active: true,
      customerRestriction: 'all',
    } as Voucher
  }),
  create: (voucher: Omit<Voucher, 'id'>) => 
    Promise.resolve({ data: { ...voucher, id: Date.now().toString() } }),
  update: (id: string, voucher: Partial<Voucher>) => 
    Promise.resolve({ data: { ...voucher, id } }),
};

// Mock data for services and add-ons
const availableServices = [
  { id: 'service1', name: 'GPS Navigation', category: 'electronics' },
  { id: 'service2', name: 'Child Seat', category: 'safety' },
  { id: 'service3', name: 'Additional Driver', category: 'personnel' },
  { id: 'service4', name: 'Roadside Assistance', category: 'safety' },
  { id: 'service5', name: 'Wifi Hotspot', category: 'electronics' },
];

const availableAddOns = [
  { id: 'addon1', name: 'Full Insurance Coverage', category: 'insurance' },
  { id: 'addon2', name: 'Fuel Pre-purchase', category: 'fuel' },
  { id: 'addon3', name: 'Airport Pickup', category: 'convenience' },
  { id: 'addon4', name: 'Late Return', category: 'flexibility' },
  { id: 'addon5', name: 'One-way Rental', category: 'flexibility' },
];

const VoucherConfig: React.FC = () => {
  const [voucher, setVoucher] = useState<Partial<Voucher>>({
    type: 'percentage',
    active: true,
    usageCount: 0,
    customerRestriction: 'all',
    stackable: true,
    stackPriority: 1,
    applicableServices: [],
    applicableAddOns: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchVoucher = async () => {
        try {
          const response = await voucherApi.getById(id);
          setVoucher(response.data);
        } catch (err) {
          setError('Failed to load voucher details');
        }
      };
      fetchVoucher();
    }
  }, [id]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!voucher.code?.trim()) {
      newErrors.code = 'Voucher code is required';
    }
    
    if (voucher.value === undefined || voucher.value <= 0) {
      newErrors.value = 'Value must be greater than 0';
    }
    
    if (voucher.type === 'percentage' && voucher.value !== undefined && voucher.value > 100) {
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
        await voucherApi.update(id, voucher);
      } else {
        await voucherApi.create(voucher as Omit<Voucher, 'id'>);
      }
      navigate('/vouchers');
    } catch (err) {
      setError('Failed to save voucher. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card sx={{ maxWidth: '100%', overflow: 'hidden' }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Typography variant="h5" gutterBottom>
            {id ? 'Edit' : 'Create'} Voucher
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={{ xs: 1, sm: 2 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Voucher Code"
                  value={voucher.code || ''}
                  onChange={(e) => setVoucher({ ...voucher, code: e.target.value.toUpperCase() })}
                  margin="normal"
                  error={!!errors.code}
                  helperText={errors.code}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Voucher Type</InputLabel>
                  <Select
                    value={voucher.type}
                    label="Voucher Type"
                    onChange={(e) => setVoucher({ ...voucher, type: e.target.value as 'percentage' | 'fixed' })}
                  >
                    <MenuItem value="percentage">Percentage Discount</MenuItem>
                    <MenuItem value="fixed">Fixed Amount</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Value"
                  type="number"
                  value={voucher.value || ''}
                  onChange={(e) => setVoucher({ ...voucher, value: Number(e.target.value) })}
                  margin="normal"
                  error={!!errors.value}
                  helperText={errors.value || (voucher.type === 'percentage' ? 'Percentage value (0-100)' : 'Amount in currency')}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Minimum Purchase Amount"
                  type="number"
                  value={voucher.minPurchaseAmount || ''}
                  onChange={(e) => setVoucher({ ...voucher, minPurchaseAmount: Number(e.target.value) })}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Maximum Usage"
                  type="number"
                  value={voucher.maxUsage || ''}
                  onChange={(e) => setVoucher({ ...voucher, maxUsage: Number(e.target.value) })}
                  margin="normal"
                  helperText="Leave empty for unlimited usage"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Current Usage Count"
                  type="number"
                  value={voucher.usageCount || 0}
                  onChange={(e) => setVoucher({ ...voucher, usageCount: Number(e.target.value) })}
                  margin="normal"
                  disabled={!id}
                  helperText="Number of times this voucher has been used"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Start Date"
                  value={voucher.startDate}
                  onChange={(date) => setVoucher({ ...voucher, startDate: date || undefined })}
                  sx={{ width: '100%', mt: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="End Date"
                  value={voucher.endDate}
                  onChange={(date) => setVoucher({ ...voucher, endDate: date || undefined })}
                  sx={{ width: '100%', mt: 2 }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: { xs: 2, sm: 3 } }} />
            <Typography variant="h6" gutterBottom>Restrictions</Typography>

            <Grid container spacing={{ xs: 1, sm: 2 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Customer Restriction</InputLabel>
                  <Select
                    value={voucher.customerRestriction || 'all'}
                    label="Customer Restriction"
                    onChange={(e) => setVoucher({ ...voucher, customerRestriction: e.target.value as 'new' | 'existing' | 'all' })}
                  >
                    <MenuItem value="all">All Customers</MenuItem>
                    <MenuItem value="new">New Customers Only</MenuItem>
                    <MenuItem value="existing">Existing Customers Only</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={voucher.stackable || false}
                      onChange={(e) => setVoucher({ ...voucher, stackable: e.target.checked })}
                    />
                  }
                  label="Stackable with other vouchers/discounts"
                />
              </Grid>
              
              {voucher.stackable && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Stack Priority"
                    type="number"
                    value={voucher.stackPriority || 1}
                    onChange={(e) => setVoucher({ ...voucher, stackPriority: Number(e.target.value) })}
                    margin="normal"
                    helperText="Lower number = higher priority (applied first)"
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
              )}
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={voucher.active || false}
                      onChange={(e) => setVoucher({ ...voucher, active: e.target.checked })}
                    />
                  }
                  label="Active"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: { xs: 2, sm: 3 } }} />
            <Typography variant="h6" gutterBottom>Applicable Services & Add-ons</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              If none selected, voucher applies to all services and add-ons
            </Typography>
            
            <Grid container spacing={{ xs: 1, sm: 2 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="applicable-services-label">Applicable Services</InputLabel>
                  <Select
                    labelId="applicable-services-label"
                    multiple
                    value={voucher.applicableServices || []}
                    onChange={(e) => setVoucher({ 
                      ...voucher, 
                      applicableServices: e.target.value as string[] 
                    })}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.length > 0 ? selected.map((value) => {
                          const service = availableServices.find(s => s.id === value);
                          return <Chip key={value} label={service ? service.name : value} size="small" />;
                        }) : <em>All services</em>}
                      </Box>
                    )}
                    sx={{ 
                      minHeight: '56px', 
                      minWidth: { xs: '100%', sm: '220px' },
                      '& .MuiSelect-select': {
                        overflow: 'auto',
                        maxHeight: '100px'
                      }
                    }}
                  >
                    {availableServices.map((service) => (
                      <MenuItem key={service.id} value={service.id}>
                        {service.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="applicable-addons-label">Applicable Add-ons</InputLabel>
                  <Select
                    labelId="applicable-addons-label"
                    multiple
                    value={voucher.applicableAddOns || []}
                    onChange={(e) => setVoucher({ 
                      ...voucher, 
                      applicableAddOns: e.target.value as string[] 
                    })}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.length > 0 ? selected.map((value) => {
                          const addon = availableAddOns.find(a => a.id === value);
                          return <Chip key={value} label={addon ? addon.name : value} size="small" />;
                        }) : <em>All add-ons</em>}
                      </Box>
                    )}
                    sx={{ 
                      minHeight: '56px', 
                      minWidth: { xs: '100%', sm: '220px' },
                      '& .MuiSelect-select': {
                        overflow: 'auto',
                        maxHeight: '100px'
                      }
                    }}
                  >
                    {availableAddOns.map((addon) => (
                      <MenuItem key={addon.id} value={addon.id}>
                        {addon.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2, 
              mt: 3,
              '& .MuiButton-root': {
                width: { xs: '100%', sm: 'auto' }
              }
            }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate('/vouchers')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : (id ? 'Update' : 'Create')} Voucher
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default VoucherConfig;