
import { Request, Response } from 'express';
import { inventoryService } from '../services/inventoryService';

export const historyController = {

  getHistory: (req: Request, res: Response) => {
    try {
      const { productId, limit } = req.query;
      let history = inventoryService.getStockHistory(productId as string);
      
     
      if (limit && !isNaN(Number(limit))) {
        history = history.slice(0, Number(limit));
      }
      
      res.json(history);
    } catch (error) {
      console.error('Error fetching stock history:', error);
      res.status(500).json({ 
        error: 'Failed to fetch stock history',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },
};