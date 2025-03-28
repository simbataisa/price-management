import React from 'react';
import {
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

interface AddOn {
  id: string;
  name: string;
  price: number;
}

interface AddOnsProps {
  addOns: string[];
  handleAddOnToggle: (addOnId: string) => void;
  availableAddOns: AddOn[];
  rentalType: 'short-term' | 'long-term';
  pickupLocation: string;
  setPickupLocation: (location: string) => void;
  returnLocation: string;
  setReturnLocation: (location: string) => void;
  withDriver: boolean;
  setWithDriver: (withDriver: boolean) => void;
  weddingDecoration: boolean;
  setWeddingDecoration: (weddingDecoration: boolean) => void;
}

const AddOns: React.FC<AddOnsProps> = ({
  addOns,
  handleAddOnToggle,
  availableAddOns,
  rentalType,
  pickupLocation,
  setPickupLocation,
  returnLocation,
  setReturnLocation,
  withDriver,
  setWithDriver,
  weddingDecoration,
  setWeddingDecoration
}) => {
  return (
    <>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
        Add-on Services
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {availableAddOns.map(addOn => (
          <FormControlLabel
            key={addOn.id}
            control={
              <Checkbox 
                checked={addOns.includes(addOn.id)}
                onChange={() => handleAddOnToggle(addOn.id)}
              />
            }
            label={`${addOn.name} (+$${addOn.price}/${rentalType === 'short-term' ? 'day' : 'month'})`}
          />
        ))}
      </Box>
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Pickup Location</InputLabel>
        <Select
          value={pickupLocation}
          label="Pickup Location"
          onChange={(e) => setPickupLocation(e.target.value)}
        >
          <MenuItem value="office">Rental Office</MenuItem>
          <MenuItem value="airport">Airport</MenuItem>
          <MenuItem value="hotel">Hotel</MenuItem>
          <MenuItem value="custom">Custom Address (+$25)</MenuItem>
        </Select>
      </FormControl>
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Return Location</InputLabel>
        <Select
          value={returnLocation}
          label="Return Location"
          onChange={(e) => setReturnLocation(e.target.value)}
        >
          <MenuItem value="office">Rental Office</MenuItem>
          <MenuItem value="airport">Airport</MenuItem>
          <MenuItem value="hotel">Hotel</MenuItem>
          <MenuItem value="custom">Custom Address</MenuItem>
        </Select>
      </FormControl>
      
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <FormControlLabel
          control={
            <Checkbox 
              checked={withDriver}
              onChange={(e) => setWithDriver(e.target.checked)}
            />
          }
          label="Include Professional Driver (+30%)"
        />
        
        <FormControlLabel
          control={
            <Checkbox 
              checked={weddingDecoration}
              onChange={(e) => setWeddingDecoration(e.target.checked)}
            />
          }
          label="Wedding Decoration (+$120)"
        />
      </Box>
    </>
  );
};

export default AddOns;