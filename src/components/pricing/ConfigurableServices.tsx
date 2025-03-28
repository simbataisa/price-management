import React from 'react';
import {
  Typography,
  Box,
  Card,
  FormControlLabel,
  Checkbox,
  Chip
} from '@mui/material';
import { ServiceOption } from '../../types/pricing';

interface ConfigurableServicesProps {
  serviceOptions: ServiceOption[];
  selectedServices: string[];
  serviceValues: Record<string, number>;
  handleServiceToggle: (serviceId: string) => void;
  handleServiceValueChange: (serviceId: string, value: number) => void;
}

const ConfigurableServices: React.FC<ConfigurableServicesProps> = ({
  serviceOptions,
  selectedServices,
  serviceValues,
  handleServiceToggle,
  handleServiceValueChange
}) => {
  return (
    <>
      <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
        Configurable Services
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {serviceOptions.map(service => (
          <Card key={service.id} sx={{ p: 2, border: selectedServices.includes(service.id) ? '1px solid #1976d2' : '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={selectedServices.includes(service.id)}
                    onChange={() => handleServiceToggle(service.id)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle1">{service.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{service.description}</Typography>
                  </Box>
                }
              />
              <Chip 
                label={service.type === 'fixed' 
                  ? `$${serviceValues[service.id]}` 
                  : `${serviceValues[service.id]}%`
                } 
                color="primary" 
                variant={selectedServices.includes(service.id) ? "filled" : "outlined"}
              />
            </Box>
            
            {service.configurable && selectedServices.includes(service.id) && (
              <Box sx={{ mt: 2, px: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Adjust {service.type === 'fixed' ? 'fee' : 'rate'}:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2">{service.minValue}</Typography>
                  <input
                    type="range"
                    min={service.minValue}
                    max={service.maxValue}
                    step={service.valueStep}
                    value={serviceValues[service.id]}
                    onChange={(e) => handleServiceValueChange(service.id, Number(e.target.value))}
                    style={{ flexGrow: 1 }}
                  />
                  <Typography variant="body2">{service.maxValue}</Typography>
                </Box>
              </Box>
            )}
          </Card>
        ))}
      </Box>
    </>
  );
};

export default ConfigurableServices;