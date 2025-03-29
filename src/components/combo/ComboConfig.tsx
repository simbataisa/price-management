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
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';

// Create a wrapper component for Grid to fix the typing issues
const Grid = MuiGrid as any;

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
}

interface ComboItem {
  productId: string;
  quantity: number;
}

interface Combo {
  id: string;
  name: string;
  description: string;
  items: ComboItem[];
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate?: Date;
  endDate?: Date;
  active: boolean;
  minDuration?: number;
  stackable: boolean;
  stackPriority?: number;
  applicableServices?: string[];
  applicableAddOns?: string[];
}

// Mock products data
const mockProducts: Product[] = [
  { id: 'car1', name: 'Economy Car', description: 'Small economy car', basePrice: 50, category: 'car' },
  { id: 'car2', name: 'SUV', description: 'Sport utility vehicle', basePrice: 80, category: 'car' },
  { id: 'car3', name: 'Luxury Sedan', description: 'Premium sedan', basePrice: 120, category: 'car' },
  { id: 'service1', name: 'GPS Navigation', description: 'GPS navigation system', basePrice: 10, category: 'service' },
  { id: 'service2', name: 'Child Seat', description: 'Child safety seat', basePrice: 15, category: 'service' },
  { id: 'service3', name: 'Additional Driver', description: 'Additional driver service', basePrice: 20, category: 'service' },
];

// Mock API for combos
const comboApi = {
  getById: (id: string) => Promise.resolve({ 
    data: {
      id,
      name: 'Family Package',
      description: 'SUV with child seat and GPS',
      items: [
        { productId: 'car2', quantity: 1 },
        { productId: 'service1', quantity: 1 },
        { productId: 'service2', quantity: 1 },
      ],
      discountType: 'percentage',
      discountValue: 15,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      active: true,
      minDuration: 3,
    } as Combo
  }),
  create: (combo: Omit<Combo, 'id'>) => 
    Promise.resolve({ data: { ...combo, id: Date.now().toString() } }),
  update: (id: string, combo: Partial<Combo>) => 
    Promise.resolve({ data: { ...combo, id } }),
};

// Add these mock data arrays
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

const ComboConfig: React.FC = () => {
  const [combo, setCombo] = useState<Partial<Combo>>({
    discountType: 'percentage',
    discountValue: 10,
    active: true,
    items: [],
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
  
  // For adding new items
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      const fetchCombo = async () => {
        try {
          const response = await comboApi.getById(id);
          setCombo(response.data);
        } catch (err) {
          setError('Failed to load combo details');
        }
      };
      fetchCombo();
    }
  }, [id]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!combo.name?.trim()) {
      newErrors.name = 'Combo name is required';
    }
    
    if (!combo.items || combo.items.length === 0) {
      newErrors.items = 'At least one product must be added to the combo';
    }
    
    if (combo.discountValue === undefined || combo.discountValue <= 0) {
      newErrors.discountValue = 'Discount value must be greater than 0';
    }
    
    if (combo.discountType === 'percentage' && combo.discountValue !== undefined && combo.discountValue > 100) {
      newErrors.discountValue = 'Percentage cannot exceed 100%';
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
        await comboApi.update(id, combo);
      } else {
        await comboApi.create(combo as Omit<Combo, 'id'>);
      }
      navigate('/combos');
    } catch (err) {
      setError('Failed to save combo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    if (!selectedProduct) return;
    
    const items = [...(combo.items || [])];
    const existingItemIndex = items.findIndex(item => item.productId === selectedProduct);
    
    if (existingItemIndex >= 0) {
      items[existingItemIndex].quantity += quantity;
    } else {
      items.push({ productId: selectedProduct, quantity });
    }
    
    setCombo({ ...combo, items });
    setSelectedProduct('');
    setQuantity(1);
  };

  const removeItem = (productId: string) => {
    const items = (combo.items || []).filter(item => item.productId !== productId);
    setCombo({ ...combo, items });
  };

  const getProductName = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const calculateTotalPrice = () => {
    if (!combo.items || combo.items.length === 0) return 0;
    
    return combo.items.reduce((total, item) => {
      const product = mockProducts.find(p => p.id === item.productId);
      return total + (product ? product.basePrice * item.quantity : 0);
    }, 0);
  };

  const calculateDiscountedPrice = () => {
    const totalPrice = calculateTotalPrice();
    
    if (combo.discountType === 'percentage') {
      return totalPrice * (1 - (combo.discountValue || 0) / 100);
    } else {
      return Math.max(0, totalPrice - (combo.discountValue || 0));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card>
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Typography variant="h5" gutterBottom>
            {id ? 'Edit' : 'Create'} Combo Package
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Combo Name"
                  value={combo.name || ''}
                  onChange={(e) => setCombo({ ...combo, name: e.target.value })}
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  value={combo.description || ''}
                  onChange={(e) => setCombo({ ...combo, description: e.target.value })}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Discount Type</InputLabel>
                  <Select
                    value={combo.discountType}
                    label="Discount Type"
                    onChange={(e) => setCombo({ ...combo, discountType: e.target.value as 'percentage' | 'fixed' })}
                  >
                    <MenuItem value="percentage">Percentage Discount</MenuItem>
                    <MenuItem value="fixed">Fixed Amount</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Discount Value"
                  type="number"
                  value={combo.discountValue || ''}
                  onChange={(e) => setCombo({ ...combo, discountValue: Number(e.target.value) })}
                  margin="normal"
                  error={!!errors.discountValue}
                  helperText={errors.discountValue || (combo.discountType === 'percentage' ? 'Percentage value (0-100)' : 'Amount in currency')}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Start Date"
                  value={combo.startDate}
                  onChange={(date) => setCombo({ ...combo, startDate: date || undefined })}
                  sx={{ width: '100%', mt: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="End Date"
                  value={combo.endDate}
                  onChange={(date) => setCombo({ ...combo, endDate: date || undefined })}
                  sx={{ width: '100%', mt: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Minimum Duration (days)"
                  type="number"
                  value={combo.minDuration || ''}
                  onChange={(e) => setCombo({ ...combo, minDuration: Number(e.target.value) })}
                  margin="normal"
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={combo.active || false}
                      onChange={(e) => setCombo({ ...combo, active: e.target.checked })}
                    />
                  }
                  label="Active"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>Combo Items</Typography>
            
            {errors.items && (
              <Alert severity="error" sx={{ mb: 2 }}>{errors.items}</Alert>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, mb: 2 }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Product</InputLabel>
                <Select
                  value={selectedProduct}
                  label="Product"
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <MenuItem value="" disabled>Select a product</MenuItem>
                  <MenuItem value="" disabled>-- Cars --</MenuItem>
                  {mockProducts.filter(p => p.category === 'car').map(product => (
                    <MenuItem key={product.id} value={product.id}>{product.name} (${product.basePrice})</MenuItem>
                  ))}
                  <MenuItem value="" disabled>-- Services --</MenuItem>
                  {mockProducts.filter(p => p.category === 'service').map(product => (
                    <MenuItem key={product.id} value={product.id}>{product.name} (${product.basePrice})</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                InputProps={{ inputProps: { min: 1 } }}
                sx={{ width: 100 }}
              />
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addItem}
                disabled={!selectedProduct}
              >
                Add
              </Button>
            </Box>
            
            <Paper variant="outlined" sx={{ mb: 3 }}>
              {(!combo.items || combo.items.length === 0) ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography color="text.secondary">No items added to this combo yet</Typography>
                </Box>
              ) : (
                <List>
                  {combo.items.map((item) => (
                    <ListItem
                      key={item.productId}
                      secondaryAction={
                        <IconButton edge="end" onClick={() => removeItem(item.productId)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={getProductName(item.productId)}
                        secondary={`Quantity: ${item.quantity}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
            
            <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1, mb: 3 }}>
              <Typography variant="subtitle1">
                Total Regular Price: ${calculateTotalPrice().toFixed(2)}
              </Typography>
              <Typography variant="subtitle1" color="primary">
                Combo Price: ${calculateDiscountedPrice().toFixed(2)}
              </Typography>
              <Typography variant="body2" color="success.main">
                Savings: ${(calculateTotalPrice() - calculateDiscountedPrice()).toFixed(2)} 
                ({combo.discountType === 'percentage' ? `${combo.discountValue}%` : 'Fixed discount'})
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate('/combos')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : (id ? 'Update' : 'Create')} Combo
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default ComboConfig;