// Enhanced price calculation with priority and stacking rules
import { Product, PriceRule, PriceCalculationResult } from '../types/pricing';

// Enhanced mock data with priority and hierarchy
const mockRules: PriceRule[] = [
  {
    id: '1',
    name: 'Summer Sale',
    description: '20% off for summer',
    type: 'percentage',
    value: 20,
    active: true,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-08-31'),
    priority: 1,
    level: 'global',
    stackable: true,
  },
  {
    id: '2',
    name: 'Bulk Discount',
    description: '10% off for orders over 5 items',
    type: 'bulk',
    value: 10,
    minQuantity: 5,
    active: true,
    priority: 2,
    level: 'product',
    stackable: true,
  },
  {
    id: '3',
    name: 'VIP Customer',
    description: '15% off for VIP customers',
    type: 'percentage',
    value: 15,
    active: true,
    priority: 3,
    level: 'customer',
    stackable: true,
    conditions: {
      customerType: 'vip'
    }
  },
  {
    id: '4',
    name: 'Flash Sale',
    description: '30% off for specific products',
    type: 'percentage',
    value: 30,
    active: true,
    priority: 0, // Highest priority
    level: 'product',
    stackable: false, // Cannot be combined with other discounts
    productIds: ['prod1', 'prod2']
  },
];

// Mock API implementation
import prisma from './database';

// Example of updated API service
export const priceRulesApi = {
  getAll: async () => {
    const rules = await prisma.combo.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    return { data: rules };
  },
  
  getById: (id: string) => Promise.resolve({ 
    data: mockRules.find(rule => rule.id === id) || mockRules[0] 
  }),
  create: (rule: Omit<PriceRule, 'id'>) => {
    const newRule = { ...rule, id: Date.now().toString() };
    mockRules.push(newRule as PriceRule);
    return Promise.resolve({ data: newRule });
  },
  update: (id: string, rule: Partial<PriceRule>) => {
    const index = mockRules.findIndex(r => r.id === id);
    if (index >= 0) {
      mockRules[index] = { ...mockRules[index], ...rule };
    }
    return Promise.resolve({ data: mockRules[index] });
  },
  delete: (id: string) => {
    const index = mockRules.findIndex(r => r.id === id);
    if (index >= 0) {
      mockRules.splice(index, 1);
    }
    return Promise.resolve({ data: {} });
  },
};

// Enhanced price calculation with priority and stacking rules
export const calculatePrice = (
  product: Product, 
  duration: number, 
  context: any
): PriceCalculationResult => {
  // Sort rules by priority (lower number = higher priority)
  const sortedRules = [...product.priceRules].sort((a, b) => 
    (a.priority || 999) - (b.priority || 999)
  );
  
  // Base price calculation
  let basePrice = product.basePrice * duration;
  let finalPrice = basePrice;
  
  // Track applied rules and breakdown
  const appliedRules: PriceRule[] = [];
  const breakdown: { rule: PriceRule; discount: number }[] = [];
  
  // Apply non-stackable rules first (only the highest priority one)
  const nonStackableRules = sortedRules.filter(rule => !rule.stackable && rule.active);
  if (nonStackableRules.length > 0) {
    const highestPriorityRule = nonStackableRules[0];
    
    let discount = 0;
    if (highestPriorityRule.type === 'percentage') {
      discount = (basePrice * highestPriorityRule.value) / 100;
    } else if (highestPriorityRule.type === 'fixed') {
      discount = highestPriorityRule.value;
    }
    
    finalPrice -= discount;
    appliedRules.push(highestPriorityRule);
    breakdown.push({ rule: highestPriorityRule, discount });
  }
  
  // Apply stackable rules
  const stackableRules = sortedRules.filter(rule => rule.stackable && rule.active);
  for (const rule of stackableRules) {
    let discount = 0;
    
    if (rule.type === 'percentage') {
      discount = (basePrice * rule.value) / 100;
    } else if (rule.type === 'fixed') {
      discount = rule.value;
    }
    
    finalPrice -= discount;
    appliedRules.push(rule);
    breakdown.push({ rule, discount });
  }
  
  return {
    originalPrice: basePrice,
    finalPrice: Math.max(0, finalPrice), // Ensure price doesn't go below zero
    appliedRules,
    breakdown,
    savings: basePrice - finalPrice,
    savingsPercentage: ((basePrice - finalPrice) / basePrice) * 100
  };
};