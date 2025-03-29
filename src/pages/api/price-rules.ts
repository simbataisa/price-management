import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../services/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    console.log(`[${new Date().toISOString()}] GET request to /api/price-rules`);
    try {
      const rules = await prisma.priceRule.findMany();
      
      console.log(`[${new Date().toISOString()}] Successfully fetched ${rules.length} price rules`);
      res.status(200).json(rules);
    } catch (error) {
      console.error('Error fetching price rules:', error);
      res.status(500).json({ error: 'Failed to fetch price rules', details: error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}