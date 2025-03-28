import { ServiceOption } from '../types/pricing';

export const serviceOptions: ServiceOption[] = [
  {
    id: 'customPickup',
    name: 'Custom Pickup Location',
    description: 'Get picked up at your preferred location',
    type: 'fixed',
    defaultValue: 25,
    minValue: 15,
    maxValue: 50,
    valueStep: 5,
    configurable: true
  },
  {
    id: 'differentReturn',
    name: 'Different Return Location',
    description: 'Return the car to a different location',
    type: 'fixed',
    defaultValue: 35,
    minValue: 20,
    maxValue: 70,
    valueStep: 5,
    configurable: true
  },
  {
    id: 'weddingDecoration',
    name: 'Wedding Decoration Package',
    description: 'Special decoration for wedding events',
    type: 'fixed',
    defaultValue: 120,
    minValue: 80,
    maxValue: 200,
    valueStep: 10,
    configurable: true
  },
  {
    id: 'withDriver',
    name: 'Professional Driver',
    description: 'Includes a professional driver',
    type: 'percentage',
    defaultValue: 30,
    minValue: 20,
    maxValue: 50,
    valueStep: 5,
    configurable: true
  },
  {
    id: 'phoneAsKey',
    name: 'Phone-As-Key Service',
    description: 'Use your smartphone to unlock and start the car',
    type: 'fixed',
    defaultValue: 15,
    minValue: 10,
    maxValue: 25,
    valueStep: 5,
    configurable: true
  }
];