import { Condition, ConditionGroup } from '../types/pricing';

export const evaluateCondition = (condition: Condition, context: any): boolean => {
  const { type, value, operator = 'eq' } = condition;
  const contextValue = context[type];
  
  switch (operator) {
    case 'eq': return contextValue === value;
    case 'gt': return contextValue > value;
    case 'lt': return contextValue < value;
    case 'gte': return contextValue >= value;
    case 'lte': return contextValue <= value;
    case 'contains': return Array.isArray(contextValue) ? contextValue.includes(value) : String(contextValue).includes(value);
    case 'startsWith': return String(contextValue).startsWith(value);
    case 'endsWith': return String(contextValue).endsWith(value);
    default: return contextValue === value;
  }
};

export const evaluateConditionGroup = (group: ConditionGroup, context: any): boolean => {
  const { logic, conditions } = group;
  
  if (logic === 'AND') {
    return conditions.every(cond => {
      if ('logic' in cond) {
        return evaluateConditionGroup(cond as ConditionGroup, context);
      }
      return evaluateCondition(cond as Condition, context);
    });
  }
  
  if (logic === 'OR') {
    return conditions.some(cond => {
      if ('logic' in cond) {
        return evaluateConditionGroup(cond as ConditionGroup, context);
      }
      return evaluateCondition(cond as Condition, context);
    });
  }
  
  if (logic === 'XOR') {
    const trueCount = conditions.filter(cond => {
      if ('logic' in cond) {
        return evaluateConditionGroup(cond as ConditionGroup, context);
      }
      return evaluateCondition(cond as Condition, context);
    }).length;
    
    return trueCount === 1; // XOR is true when exactly one condition is true
  }
  
  return false;
};