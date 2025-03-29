import React from 'react';
import {
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Box
} from '@mui/material';

interface CarModel {
  id: string;
  name: string;
  basePrice: number;
}

interface RentalOptionsProps {
  rentalType: 'short-term' | 'long-term';
  setRentalType: (type: 'short-term' | 'long-term') => void;
  carDetails: {
    model: string;
    year: number;
    mileage: number;
  };
  setCarDetails: (details: any) => void;
  duration: number;
  setDuration: (duration: number) => void;
  route: string;
  setRoute: (route: string) => void;
  customerType: string;
  setCustomerType: (type: string) => void;
  carQuantity: number;
  setCarQuantity: (quantity: number) => void;
  carModels: CarModel[];
}

const RentalOptions: React.FC<RentalOptionsProps> = ({
  rentalType,
  setRentalType,
  carDetails,
  setCarDetails,
  duration,
  setDuration,
  route,
  setRoute,
  customerType,
  setCustomerType,
  carQuantity,
  setCarQuantity,
  carModels
}) => {
  return (
    <>
      <Typography variant="h5" gutterBottom>
        Car Rental Price Calculator
      </Typography>
      
      <ToggleButtonGroup
        value={rentalType}
        exclusive
        onChange={(e, newValue) => newValue && setRentalType(newValue)}
        sx={{ mb: 2, width: '100%' }}
      >
        <ToggleButton value="short-term" sx={{ width: '50%' }}>
          Short-term Rental
        </ToggleButton>
        <ToggleButton value="long-term" sx={{ width: '50%' }}>
          Long-term Leasing
        </ToggleButton>
      </ToggleButtonGroup>
      
      <Box component="form" sx={{ mt: 2 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Car Model</InputLabel>
          <Select
            value={carDetails.model.toLowerCase()}
            label="Car Model"
            onChange={(e) => setCarDetails({
              ...carDetails,
              model: e.target.value
            })}
          >
            {carModels.map(model => (
              <MenuItem key={model.id} value={model.id}>
                {model.name} (${model.basePrice}/{rentalType === 'short-term' ? 'day' : 'month'})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <TextField
          fullWidth
          label="Year"
          type="number"
          value={carDetails.year}
          onChange={(e) => setCarDetails({
            ...carDetails,
            year: Number(e.target.value)
          })}
          margin="normal"
        />
        
        <TextField
          fullWidth
          label="Mileage"
          type="number"
          value={carDetails.mileage}
          onChange={(e) => setCarDetails({
            ...carDetails,
            mileage: Number(e.target.value)
          })}
          margin="normal"
        />
        
        <TextField
          fullWidth
          label={rentalType === 'short-term' ? 'Duration (Days)' : 'Duration (Months)'}
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          margin="normal"
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Route Type</InputLabel>
          <Select
            value={route}
            label="Route Type"
            onChange={(e) => setRoute(e.target.value)}
          >
            <MenuItem value="local">Local</MenuItem>
            <MenuItem value="regional">Regional</MenuItem>
            <MenuItem value="interstate">Interstate</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Customer Type</InputLabel>
          <Select
            value={customerType}
            label="Customer Type"
            onChange={(e) => setCustomerType(e.target.value)}
          >
            <MenuItem value="regular">Regular</MenuItem>
            <MenuItem value="premium">Premium</MenuItem>
            <MenuItem value="business">Business</MenuItem>
          </Select>
        </FormControl>
        
        <TextField
          fullWidth
          label="Number of Cars"
          type="number"
          value={carQuantity}
          onChange={(e) => setCarQuantity(Math.max(1, Number(e.target.value)))}
          margin="normal"
          InputProps={{ inputProps: { min: 1 } }}
        />
      </Box>
    </>
  );
};

export default RentalOptions;
