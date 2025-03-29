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
  Card,
  CardContent,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Info as InfoIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../../contexts/LoadingContext';

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
  const [error, _setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  
  // Add effect to hide loading after navigation
  useEffect(() => {
    return () => {
      // Hide loading when component unmounts (during navigation)
      hideLoading();
    };
  }, [hideLoading]);

  // Update navigation functions to show loading
  const handleNavigate = (path: string) => {
    showLoading();
    // Add a small timeout to make the navigation feel smoother
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this combo?')) {
      showLoading();
      // Simulate API call with a small delay
      setTimeout(() => {
        setCombos(combos.filter(combo => combo.id !== id));
        hideLoading();
      }, 300);
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

  // Add the missing truncateText function
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <Card sx={{ maxWidth: '100%', overflow: 'hidden' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Typography variant="h5">Combo Packages</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleNavigate('/combos/new')}
            sx={{ whiteSpace: 'nowrap' }}
          >
            New Combo
          </Button>
        </Box>
        
        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table sx={{ minWidth: { xs: 500, sm: 650 } }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {combos.map((combo) => (
                <TableRow key={combo.id}>
                  <TableCell>{combo.name}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{truncateText(combo.description, 50)}</TableCell>
                  <TableCell>${calculateDiscountedPrice(combo).toFixed(2)}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Chip 
                      label={combo.active ? 'Active' : 'Inactive'} 
                      color={combo.active ? 'success' : 'default'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton size="small" onClick={() => handleNavigate(`/combos/${combo.id}`)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(combo.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default ComboList;