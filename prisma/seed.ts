import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.comboItem.deleteMany({});
  await prisma.combo.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.priceRule.deleteMany({});
  
  // Create sample products
  const products = [
    {
      id: 'car1',
      name: 'Economy Car',
      description: 'Small economy car',
      basePrice: 50,
      category: 'car'
    },
    {
      id: 'car2',
      name: 'SUV',
      description: 'Sport utility vehicle',
      basePrice: 80,
      category: 'car'
    },
    {
      id: 'car3',
      name: 'Luxury Sedan',
      description: 'Premium sedan',
      basePrice: 120,
      category: 'car'
    },
    {
      id: 'service1',
      name: 'GPS Navigation',
      description: 'GPS navigation system',
      basePrice: 10,
      category: 'service'
    },
    {
      id: 'service2',
      name: 'Child Seat',
      description: 'Child safety seat',
      basePrice: 15,
      category: 'service'
    },
    {
      id: 'service3',
      name: 'Additional Driver',
      description: 'Additional driver service',
      basePrice: 20,
      category: 'service'
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }

  // Create sample combos
  const combos = [
    {
      id: '1',
      name: 'Family Package',
      description: 'SUV with child seat and GPS',
      discountType: 'percentage',
      discountValue: 15,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      active: true,
      minDuration: 3,
      items: {
        create: [
          { productId: 'car2', quantity: 1 },
          { productId: 'service1', quantity: 1 },
          { productId: 'service2', quantity: 1 }
        ]
      }
    },
    {
      id: '2',
      name: 'Business Trip',
      description: 'Luxury sedan with GPS and additional driver',
      discountType: 'fixed',
      discountValue: 30,
      active: true,
      items: {
        create: [
          { productId: 'car3', quantity: 1 },
          { productId: 'service1', quantity: 1 },
          { productId: 'service3', quantity: 1 }
        ]
      }
    },
    {
      id: '3',
      name: 'Economy Special',
      description: 'Economy car with GPS',
      discountType: 'percentage',
      discountValue: 10,
      active: false,
      items: {
        create: [
          { productId: 'car1', quantity: 1 },
          { productId: 'service1', quantity: 1 }
        ]
      }
    }
  ];

  for (const combo of combos) {
    await prisma.combo.create({
      data: combo
    });
  }

  // Create sample price rules
  const priceRules = [
    {
      name: 'Weekend Discount',
      description: 'Special discount for weekend rentals',
      type: 'percentage',
      value: 10.0,
      active: true,
      priority: 1,
      level: 'global',
      conditions: JSON.stringify({
        logic: 'AND',
        conditions: [
          { type: 'day_of_week', operator: 'in', value: ['Saturday', 'Sunday'] }
        ]
      })
    },
    {
      name: 'Senior Citizen Discount',
      description: '15% off for senior citizens',
      type: 'percentage',
      value: 15.0,
      active: true,
      priority: 2,
      level: 'customer',
      conditions: JSON.stringify({
        logic: 'AND',
        conditions: [
          { type: 'age', operator: '>=', value: 65 }
        ]
      })
    },
    {
      name: 'Long-term Rental Discount',
      description: '20% off for rentals longer than 7 days',
      type: 'percentage',
      value: 20.0,
      active: true,
      priority: 3,
      level: 'global',
      conditions: JSON.stringify({
        logic: 'AND',
        conditions: [
          { type: 'rental_days', operator: '>=', value: 7 }
        ]
      })
    },
    {
      name: 'Holiday Surcharge',
      description: 'Additional fee during holiday periods',
      type: 'percentage',
      value: -15.0, // Negative value for surcharge
      active: true,
      priority: 4,
      level: 'global',
      conditions: JSON.stringify({
        logic: 'OR',
        conditions: [
          { type: 'holiday', operator: '=', value: true }
        ]
      })
    },
    {
      name: 'Loyalty Program Discount',
      description: 'Discount for loyalty program members',
      type: 'fixed',
      value: 25.0,
      active: true,
      priority: 5,
      level: 'customer',
      conditions: JSON.stringify({
        logic: 'AND',
        conditions: [
          { type: 'loyalty_level', operator: '>=', value: 'silver' }
        ]
      })
    }
  ];

  for (const rule of priceRules) {
    await prisma.priceRule.create({
      data: rule,
    });
  }

  // Clear existing vouchers
  await prisma.voucher.deleteMany({});
  
  // Create sample vouchers
  const vouchers = [
    {
      id: '1',
      code: 'WELCOME10',
      description: '10% off for new customers',
      type: 'percentage',
      value: 10,
      minPurchaseAmount: 50,
      maxUsage: 1,
      usageCount: 0,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      active: true,
      customerRestriction: 'new',
    },
    {
      id: '2',
      code: 'SUMMER25',
      description: '25% off summer rentals',
      type: 'percentage',
      value: 25,
      minPurchaseAmount: 100,
      maxUsage: 100,
      usageCount: 12,
      startDate: new Date('2023-06-01'),
      endDate: new Date('2023-08-31'),
      active: true,
      customerRestriction: 'all',
    },
    {
      id: '3',
      code: 'FIXED50',
      description: '$50 off luxury rentals',
      type: 'fixed',
      value: 50,
      minPurchaseAmount: 200,
      usageCount: 5,
      active: false,
      customerRestriction: 'all',
    },
    {
      id: '4',
      code: 'HOLIDAY20',
      description: '20% off holiday bookings',
      type: 'percentage',
      value: 20,
      minPurchaseAmount: 75,
      maxUsage: 50,
      usageCount: 8,
      startDate: new Date('2023-11-15'),
      endDate: new Date('2024-01-15'),
      active: true,
      customerRestriction: 'all',
    },
    {
      id: '5',
      code: 'LOYAL15',
      description: '15% off for existing customers',
      type: 'percentage',
      value: 15,
      minPurchaseAmount: 0,
      maxUsage: null,
      usageCount: 27,
      active: true,
      customerRestriction: 'existing',
    }
  ];

  for (const voucher of vouchers) {
    await prisma.voucher.create({
      data: voucher,
    });
  }

  console.log('Voucher seed data created successfully');
  
  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });