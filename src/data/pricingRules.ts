import { PriceRule } from '../types/pricing';

export const availableRules: PriceRule[] = [
  {
    id: '1',
    name: 'Long Duration Discount',
    description: '15% off for rentals longer than 7 days or 3 months',
    type: 'percentage',
    value: 15,
    active: true,
    priority: 1,
    level: 'global',
    stackable: true,
    conditionLogic: {
      logic: 'OR',
      conditions: [
        {
          logic: 'AND',
          conditions: [
            { type: 'rentalType', value: 'short-term', operator: 'eq' },
            { type: 'duration', value: 7, operator: 'gte' }
          ]
        },
        {
          logic: 'AND',
          conditions: [
            { type: 'rentalType', value: 'long-term', operator: 'eq' },
            { type: 'duration', value: 3, operator: 'gte' }
          ]
        }
      ]
    }
  },
  {
    id: '2',
    name: 'New Car Premium',
    description: '10% premium for cars less than 2 years old',
    type: 'percentage',
    value: -10, // Negative value means increase
    active: true,
    priority: 2,
    level: 'product',
    stackable: true,
    conditionLogic: {
      logic: 'AND',
      conditions: [
        { type: 'carAge', value: 2, operator: 'lt' }
      ]
    }
  },
  {
    id: '3',
    name: 'High Mileage Discount',
    description: '5% off for cars with over 50,000 miles',
    type: 'percentage',
    value: 5,
    active: true,
    priority: 3,
    level: 'product',
    stackable: true,
    conditionLogic: {
      logic: 'AND',
      conditions: [
        { type: 'mileage', value: 50000, operator: 'gte' }
      ]
    }
  },
  {
    id: '4',
    name: 'Premium Customer',
    description: '10% off for premium customers',
    type: 'percentage',
    value: 10,
    active: true,
    priority: 2,
    level: 'customer',
    stackable: true,
    conditionLogic: {
      logic: 'AND',
      conditions: [
        { type: 'customerType', value: 'premium', operator: 'eq' }
      ]
    }
  },
  {
    id: '5',
    name: 'Interstate Route Fee',
    description: '15% surcharge for interstate routes',
    type: 'percentage',
    value: -15, // Negative value means increase
    active: true,
    priority: 1,
    level: 'product',
    stackable: true,
    conditionLogic: {
      logic: 'AND',
      conditions: [
        { type: 'route', value: 'interstate', operator: 'eq' }
      ]
    }
  },
  {
    id: '6',
    name: 'Custom Pickup Fee',
    description: 'Additional fee for custom pickup location',
    type: 'fixed',
    value: -25, // Negative value means increase
    active: true,
    priority: 1,
    level: 'service',
    stackable: true,
    conditionLogic: {
      logic: 'AND',
      conditions: [
        { type: 'pickupLocation', value: 'custom', operator: 'eq' }
      ]
    }
  },
  {
    id: '7',
    name: 'Different Return Location Fee',
    description: 'Fee for returning to a different location',
    type: 'fixed',
    value: -35,
    active: true,
    priority: 1,
    level: 'service',
    stackable: true,
    conditionLogic: {
      logic: 'XOR',
      conditions: [
        { type: 'pickupLocation', value: 'returnLocation', operator: 'eq' },
        { type: 'differentReturn', value: true, operator: 'eq' }
      ]
    }
  },
  {
    id: '8',
    name: 'Wedding Decoration Package',
    description: 'Special decoration for wedding events',
    type: 'fixed',
    value: -120,
    active: true,
    priority: 1,
    level: 'service',
    stackable: true,
    conditionLogic: {
      logic: 'AND',
      conditions: [
        { type: 'weddingDecoration', value: true, operator: 'eq' }
      ]
    }
  },
  {
    id: '9',
    name: 'Professional Driver',
    description: 'Includes a professional driver',
    type: 'percentage',
    value: -30, // 30% increase for driver
    active: true,
    priority: 1,
    level: 'service',
    stackable: true,
    conditionLogic: {
      logic: 'AND',
      conditions: [
        { type: 'withDriver', value: true, operator: 'eq' }
      ]
    }
  },
  {
    id: '10',
    name: 'Multi-Car Discount',
    description: '10% off when renting 3 or more cars',
    type: 'percentage',
    value: 10,
    active: true,
    priority: 2,
    level: 'global',
    stackable: true,
    conditionLogic: {
      logic: 'AND',
      conditions: [
        { type: 'carQuantity', value: 3, operator: 'gte' }
      ]
    }
  },
  // New complex rules
  {
    id: '11',
    name: 'Weekend Special',
    description: '20% off for weekend rentals of luxury cars',
    type: 'percentage',
    value: 20,
    active: true,
    priority: 1,
    level: 'product',
    stackable: true,
    conditionLogic: {
      logic: 'AND',
      conditions: [
        { type: 'isWeekend', value: true, operator: 'eq' },
        { type: 'carModel', value: 'luxury', operator: 'eq' }
      ]
    }
  },
  {
    id: '12',
    name: 'Family Package',
    description: '15% off when renting an SUV with child seat',
    type: 'percentage',
    value: 15,
    active: true,
    priority: 2,
    level: 'product',
    stackable: true,
    conditionLogic: {
      logic: 'AND',
      conditions: [
        { type: 'carModel', value: 'suv', operator: 'eq' },
        { type: 'addOns', value: 'childSeat', operator: 'contains' }
      ]
    }
  },
  {
    id: '13',
    name: 'Business Travel Package',
    description: '10% off for business customers with WiFi and GPS',
    type: 'percentage',
    value: 10,
    active: true,
    priority: 2,
    level: 'customer',
    stackable: true,
    conditionLogic: {
      logic: 'AND',
      conditions: [
        { type: 'customerType', value: 'business', operator: 'eq' },
        {
          logic: 'AND',
          conditions: [
            { type: 'addOns', value: 'wifi', operator: 'contains' },
            { type: 'addOns', value: 'gps', operator: 'contains' }
          ]
        }
      ]
    }
  },
  {
    id: '14',
    name: 'Seasonal Promotion',
    description: '25% off for summer rentals longer than 14 days',
    type: 'percentage',
    value: 25,
    active: true,
    priority: 1,
    level: 'global',
    stackable: false,
    conditionLogic: {
      logic: 'AND',
      conditions: [
        { type: 'isSummer', value: true, operator: 'eq' },
        { type: 'rentalType', value: 'short-term', operator: 'eq' },
        { type: 'duration', value: 14, operator: 'gte' }
      ]
    }
  },
  {
    id: '15',
    name: 'Complete Package Discount',
    description: '30% off when all services are selected',
    type: 'percentage',
    value: 30,
    active: true,
    priority: 1,
    level: 'global',
    stackable: false,
    conditionLogic: {
      logic: 'AND',
      conditions: [
        { type: 'withDriver', value: true, operator: 'eq' },
        { type: 'weddingDecoration', value: true, operator: 'eq' },
        {
          logic: 'OR',
          conditions: [
            { type: 'selectedServices', value: 'phoneAsKey', operator: 'contains' },
            { type: 'selectedServices', value: 'customPickup', operator: 'contains' }
          ]
        }
      ]
    }
  }
];