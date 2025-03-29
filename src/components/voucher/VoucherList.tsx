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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

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
}

// Mock vouchers data
const mockVouchers: Voucher[] = [
  {
    id: '1',
    code: 'WELCOME10',
    description: '10% off for new customers',
    type: 'percentage',
    value: 10,
    minPurchaseAmount: 50,
    maxUsage: 1,
    usageCount: 0,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    active: true,
    customerRestriction: 'new',
  },
  {
    id: '2',
    code: 'SUMMER25',
    description: '25% off summer rentals',
    type: 'percentage',
    value: 25,
    minPurchaseAmount: 100,
    maxUsage: 100,
    usageCount: 12,
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-08-31'),
    active: true,
    customerRestriction: 'all',
  },
  {
    id: '3',
    code: 'FIXED50',
    description: '$50 off luxury rentals',
    type: 'fixed',
    value: 50,
    minPurchaseAmount: 200,
    usageCount: 5,
    active: false,
    customerRestriction: 'all',
  },
];

const VoucherList: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>(mockVouchers);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this voucher?')) {
      setVouchers(vouchers.filter(voucher => voucher.id !== id));
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Vouchers</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/vouchers/new')}
        >
          Create Voucher
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Usage</TableCell>
              <TableCell>Valid Period</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vouchers.map((voucher) => (
              <TableRow key={voucher.id}>
                <TableCell>
                  <Typography fontWeight="bold">{voucher.code}</Typography>
                </TableCell>
                <TableCell>{voucher.description}</TableCell>
                <TableCell>
                  {voucher.type === 'percentage' ? `${voucher.value}%` : `$${voucher.value}`}
                </TableCell>
                <TableCell>
                  {voucher.usageCount} / {voucher.maxUsage || '∞'}
                </TableCell>
                <TableCell>
                  {formatDate(voucher.startDate)} - {formatDate(voucher.endDate)}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={voucher.active ? 'Active' : 'Inactive'} 
                    color={voucher.active ? 'success' : 'default'} 
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton 
                    size="small" 
                    onClick={() => navigate(`/vouchers/edit/${voucher.id}`)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDelete(voucher.id)}
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

export default VoucherList;