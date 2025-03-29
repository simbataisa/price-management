import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../services/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const vouchers = await prisma.voucher.findMany();
      res.status(200).json(vouchers);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      res.status(500).json({ error: 'Failed to fetch vouchers' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}