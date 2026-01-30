import { Request, Response } from 'express';
import { inventoryService } from '../services/inventoryService';

export const analyticsController = {

  getAnalytics: (req: Request, res: Response) => {
    try {
      const analytics = inventoryService.getAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ 
        error: 'Failed to fetch analytics',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },
};