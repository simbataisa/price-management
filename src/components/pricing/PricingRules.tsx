import React from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Chip,
  Tooltip,
  IconButton,
  Paper
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { PriceRule, ConditionGroup } from '../../types/pricing';

interface PricingRulesProps {
  availableRules: PriceRule[];
  selectedRules: string[];
  handleRuleToggle: (ruleId: string) => void;
}

const PricingRules: React.FC<PricingRulesProps> = ({
  availableRules,
  selectedRules,
  handleRuleToggle
}) => {
  // Helper function to render condition logic in a readable format
  const renderConditionLogic = (group: ConditionGroup): React.ReactElement => {
    return (
      <Box sx={{ ml: 2 }}>
        <Typography variant="body2" fontWeight="bold">
          {group.logic}
        </Typography>
        <Box sx={{ ml: 2 }}>
          {group.conditions.map((cond, idx) => {
            if ('logic' in cond) {
              return (
                <Box key={idx} sx={{ mt: 1 }}>
                  {renderConditionLogic(cond as ConditionGroup)}
                </Box>
              );
            } else {
              const condition = cond as any;
              return (
                <Typography key={idx} variant="body2">
                  {condition.type} {condition.operator || '='} {String(condition.value)}
                </Typography>
              );
            }
          })}
        </Box>
      </Box>
    );
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Applicable Pricing Rules
      </Typography>
      {availableRules.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No pricing rules available. Add rules in the Pricing Rules tab.
        </Typography>
      ) : (
        <List>
          {availableRules.filter(rule => rule.active).map((rule) => (
            <ListItem 
              key={rule.id}
              disablePadding
              sx={{ 
                mb: 1,
                borderRadius: 1,
              }}
            >
              <ListItemButton
                onClick={() => handleRuleToggle(rule.id)}
                selected={selectedRules.includes(rule.id)}
                sx={{ 
                  border: '1px solid #eee',
                  borderRadius: 1,
                  bgcolor: selectedRules.includes(rule.id) ? 'rgba(0, 0, 255, 0.05)' : 'transparent',
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {rule.name}
                      <Chip 
                        size="small" 
                        label={`Priority: ${rule.priority}`} 
                        color="primary" 
                        variant="outlined"
                      />
                      <Chip 
                        size="small" 
                        label={rule.level} 
                        color="secondary" 
                        variant="outlined"
                      />
                      {rule.value < 0 && (
                        <Chip 
                          size="small" 
                          label="Surcharge" 
                          color="error" 
                          variant="outlined"
                        />
                      )}
                      {rule.conditionLogic && (
                        <Tooltip title={
                          <Box>
                            {renderConditionLogic(rule.conditionLogic)}
                          </Box>
                        }>
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  }
                  secondary={rule.description}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default PricingRules;