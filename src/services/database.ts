import { PrismaClient } from '@prisma/client';

// Add this type declaration for the global variable
declare global {
  var prisma: PrismaClient | undefined;
}

// Initialize Prisma client
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In development, use a global variable to prevent multiple instances
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;