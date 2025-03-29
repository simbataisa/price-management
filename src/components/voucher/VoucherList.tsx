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
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';

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

const VoucherList: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await fetch('/api/vouchers');
        if (!response.ok) {
          throw new Error('Failed to fetch vouchers');
        }
        const data = await response.json();
        setVouchers(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load vouchers');
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this voucher?')) {
      try {
        setLoading(true);
        const response = await fetch(`/api/vouchers/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete voucher');
        }
        
        setVouchers(vouchers.filter(voucher => voucher.id !== id));
      } catch (err) {
        setError('Failed to delete voucher');
      } finally {
        setLoading(false);
      }
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
          onClick={() => router.push('/vouchers/new')}
        >
          Create Voucher
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
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
              {vouchers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">No vouchers found</TableCell>
                </TableRow>
              ) : (
                vouchers.map((voucher) => (
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
                        onClick={() => router.push(`/vouchers/edit/${voucher.id}`)}
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
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default VoucherList;