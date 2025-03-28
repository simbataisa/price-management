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
  Alert
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PriceRule } from '../types/pricing';
import { priceRulesApi } from '../services/api';

const PriceRulesList: React.FC = () => {
  const [rules, setRules] = useState<PriceRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await priceRulesApi.getAll();
        setRules(response.data);
      } catch (err) {
        setError('Failed to load pricing rules');
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      try {
        await priceRulesApi.delete(id);
        setRules(rules.filter(rule => rule.id !== id));
      } catch (err) {
        setError('Failed to delete rule');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Pricing Rules</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/rules/new')}
        >
          Add New Rule
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Typography>Loading rules...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>{rule.name}</TableCell>
                  <TableCell>
                    {rule.type === 'percentage' ? 'Percentage' : 
                     rule.type === 'fixed' ? 'Fixed Amount' : 'Bulk Discount'}
                  </TableCell>
                  <TableCell>
                    {rule.type === 'percentage' ? `${rule.value}%` : `$${rule.value}`}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={rule.active ? 'Active' : 'Inactive'} 
                      color={rule.active ? 'success' : 'default'} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{rule.priority}</TableCell>
                  <TableCell>
                    <Chip 
                      label={rule.level} 
                      color="primary" 
                      variant="outlined" 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      onClick={() => navigate(`/rules/edit/${rule.id}`)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDelete(rule.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default PriceRulesList;