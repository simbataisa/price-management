import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Alert,
  Tooltip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Info as InfoIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

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
}

interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
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

// Mock combos data
const mockCombos: Combo[] = [
  {
    id: '1',
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
  },
  {
    id: '2',
    name: 'Business Trip',
    description: 'Luxury sedan with GPS and additional driver',
    items: [
      { productId: 'car3', quantity: 1 },
      { productId: 'service1', quantity: 1 },
      { productId: 'service3', quantity: 1 },
    ],
    discountType: 'fixed',
    discountValue: 30,
    active: true,
  },
  {
    id: '3',
    name: 'Economy Special',
    description: 'Economy car with GPS',
    items: [
      { productId: 'car1', quantity: 1 },
      { productId: 'service1', quantity: 1 },
    ],
    discountType: 'percentage',
    discountValue: 10,
    active: false,
  },
];

const ComboList: React.FC = () => {
  const [combos, setCombos] = useState<Combo[]>(mockCombos);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this combo?')) {
      setCombos(combos.filter(combo => combo.id !== id));
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  const getProductName = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const calculateTotalPrice = (combo: Combo) => {
    return combo.items.reduce((total, item) => {
      const product = mockProducts.find(p => p.id === item.productId);
      return total + (product ? product.basePrice * item.quantity : 0);
    }, 0);
  };

  const calculateDiscountedPrice = (combo: Combo) => {
    const totalPrice = calculateTotalPrice(combo);
    
    if (combo.discountType === 'percentage') {
      return totalPrice * (1 - combo.discountValue / 100);
    } else {
      return Math.max(0, totalPrice - combo.discountValue);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Combo Packages</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/combos/new')}
        >
          Create Combo
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Pricing</TableCell>
              <TableCell>Valid Period</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {combos.map((combo) => (
              <TableRow key={combo.id}>
                <TableCell>
                  <Typography fontWeight="bold">{combo.name}</Typography>
                </TableCell>
                <TableCell>{combo.description}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {combo.items.map((item, index) => (
                      <Typography key={index} variant="body2">
                        {item.quantity}x {getProductName(item.productId)}
                      </Typography>
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Tooltip title={
                    <Box>
                      <Typography variant="body2">Regular: ${calculateTotalPrice(combo).toFixed(2)}</Typography>
                      <Typography variant="body2">Discount: {combo.discountType === 'percentage' ? `${combo.discountValue}%` : `$${combo.discountValue}`}</Typography>
                      <Typography variant="body2">Final: ${calculateDiscountedPrice(combo).toFixed(2)}</Typography>
                    </Box>
                  }>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        ${calculateDiscountedPrice(combo).toFixed(2)}
                      </Typography>
                      <InfoIcon fontSize="small" color="action" />
                    </Box>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  {formatDate(combo.startDate)} - {formatDate(combo.endDate)}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={combo.active ? 'Active' : 'Inactive'} 
                    color={combo.active ? 'success' : 'default'} 
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton 
                    size="small" 
                    onClick={() => navigate(`/combos/edit/${combo.id}`)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDelete(combo.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ComboList;