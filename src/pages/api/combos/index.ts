import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllCombos, createCombo } from '../../../repositories/comboRepository';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const combos = getAllCombos();
        res.status(200).json(combos);
      } catch (error) {
        console.error('Error fetching combos:', error);
        res.status(500).json({ error: 'Failed to fetch combos' });
      }
      break;
    case 'POST':
      try {
        const newCombo = createCombo(req.body);
        res.status(201).json(newCombo);
      } catch (error) {
        console.error('Error creating combo:', error);
        res.status(500).json({ error: 'Failed to create combo' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}