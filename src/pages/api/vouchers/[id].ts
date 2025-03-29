import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../services/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.voucher.delete({
        where: { id }
      });
      
      res.status(200).json({ message: 'Voucher deleted successfully' });
    } catch (error) {
      console.error('Error deleting voucher:', error);
      res.status(500).json({ error: 'Failed to delete voucher' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}