export interface Condition {
  type: string;
  value: any;
  operator?: 'eq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'startsWith' | 'endsWith';
}

export interface ConditionGroup {
  logic: 'AND' | 'OR' | 'XOR';
  conditions: (Condition | ConditionGroup)[];
}

export interface PriceRule {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'bulk';
  value: number;
  minQuantity?: number;
  maxQuantity?: number;
  startDate?: Date;
  endDate?: Date;
  active: boolean;
  
  // Advanced features
  priority?: number; // Lower number = higher priority
  level?: 'global' | 'customer' | 'product' | 'item' | 'service';
  stackable?: boolean; // Can be combined with other rules
  conditions?: {
    customerType?: string;
    minimumSpend?: number;
    minDuration?: number;
    maxCarAge?: number;
    minMileage?: number;
    route?: string;
    pickupLocation?: string;
    differentReturn?: boolean;
    weddingDecoration?: boolean;
    withDriver?: boolean;
    minCarQuantity?: number;
    [key: string]: any;
  };
  conditionLogic?: ConditionGroup; // New sophisticated condition logic
  productIds?: string[]; // Specific products this rule applies to
  categoryIds?: string[]; // Specific categories this rule applies to
  configurable?: boolean; // Whether this rule's value can be configured
  minValue?: number; // Minimum configurable value
  maxValue?: number; // Maximum configurable value
  valueStep?: number; // Step size for configurable values
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  priceRules: PriceRule[];
}

export interface ServiceOption {
  id: string;
  name: string;
  description: string;
  type: 'fixed' | 'percentage';
  defaultValue: number;
  minValue: number;
  maxValue: number;
  valueStep: number;
  configurable: boolean;
}

export interface PriceCalculationResult {
  originalPrice: number;
  finalPrice: number;
  appliedRules: PriceRule[];
  breakdown: {
    rule: PriceRule;
    discount: number;
  }[];
  savings: number;
  savingsPercentage: number;
}