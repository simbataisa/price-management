import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../services/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const combos = await prisma.combo.findMany({
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
      res.status(200).json(combos);
    } catch (error) {
      console.error('Error fetching combos:', error);
      res.status(500).json({ error: 'Failed to fetch combos', details: error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}