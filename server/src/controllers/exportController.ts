
import { Request, Response } from 'express';
import { inventoryService } from '../services/inventoryService';

export const exportController = {

  exportCSV: (req: Request, res: Response) => {
    try {
      const { 
        startDate, 
        endDate, 
        includeOutOfStock = 'true', 
        includeLowStock = 'true' 
      } = req.query;

      const options = {
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        includeOutOfStock: includeOutOfStock === 'true',
        includeLowStock: includeLowStock === 'true',
      };

      const products = inventoryService.getProductsForExport(options);
      
      
      const headers = ['Name', 'SKU', 'Category', 'Price', 'Current Stock', 'Min Stock', 'Status', 'Value'];
      
      const csvRows = [
        headers.join(','),
        ...products.map(product => {
          const status = product.stock === 0 ? 'Out of Stock' : 
                        product.stock <= product.minStock ? 'Low Stock' : 'In Stock';
          const value = (product.price * product.stock).toFixed(2);
          
          return [
            `"${product.name}"`,
            `"${product.sku}"`,
            `"${product.category || 'Uncategorized'}"`,
            product.price.toFixed(2),
            product.stock,
            product.minStock,
            `"${status}"`,
            value,
          ].join(',');
        })
      ];

      const csv = csvRows.join('\n');
      const timestamp = new Date().toISOString().split('T')[0];
      
      res.header('Content-Type', 'text/csv');
      res.header('Content-Disposition', `attachment; filename=inventory_export_${timestamp}.csv`);
      res.send(csv);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      res.status(500).json({ 
        error: 'Failed to export CSV',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },


  exportJSON: (req: Request, res: Response) => {
    try {
      const { 
        startDate, 
        endDate, 
        includeOutOfStock = 'true', 
        includeLowStock = 'true' 
      } = req.query;

      const options = {
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        includeOutOfStock: includeOutOfStock === 'true',
        includeLowStock: includeLowStock === 'true',
      };

      const products = inventoryService.getProductsForExport(options);
      const timestamp = new Date().toISOString().split('T')[0];
      
      res.header('Content-Type', 'application/json');
      res.header('Content-Disposition', `attachment; filename=inventory_export_${timestamp}.json`);
      res.json({
        exportDate: new Date().toISOString(),
        totalProducts: products.length,
        products: products,
      });
    } catch (error) {
      console.error('Error exporting JSON:', error);
      res.status(500).json({ 
        error: 'Failed to export JSON',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },
};