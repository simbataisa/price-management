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
      // Delete the combo
      await prisma.combo.delete({
        where: { id }
      });
      
      res.status(200).json({ message: 'Combo deleted successfully' });
    } catch (error) {
      console.error('Error deleting combo:', error);
      res.status(500).json({ error: 'Failed to delete combo', details: error });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}