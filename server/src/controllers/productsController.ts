import { Request, Response } from 'express';
import { inventoryService } from '../services/inventoryService';

export const productsController = {

  getAllProducts: (req: Request, res: Response) => {
    try {
      const { 
        search, 
        status, 
        category, 
        sortBy, 
        sortOrder 
      } = req.query;
      
      const products = inventoryService.getAllProducts({
        search: search as string,
        status: status as any,
        category: category as string,
        sortBy: sortBy as any,
        sortOrder: sortOrder as any,
      });
      
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ 
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },


  getProduct: (req: Request, res: Response) => {
    try {
      const product = inventoryService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ 
        error: 'Failed to fetch product',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },


  createProduct: (req: Request, res: Response) => {
    try {
      const { 
        name, 
        sku, 
        price, 
        stock, 
        minStock, 
        description, 
        category 
      } = req.body;

      
      if (!name || !sku || price === undefined || stock === undefined || minStock === undefined) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          required: ['name', 'sku', 'price', 'stock', 'minStock']
        });
      }

      if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ error: 'Price must be a non-negative number' });
      }

      if (typeof stock !== 'number' || stock < 0) {
        return res.status(400).json({ error: 'Stock must be a non-negative number' });
      }

      if (typeof minStock !== 'number' || minStock < 0) {
        return res.status(400).json({ error: 'Minimum stock must be a non-negative number' });
      }

      const product = inventoryService.createProduct({
        name,
        sku,
        price,
        stock,
        minStock,
        description,
        category,
      });

      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      if (error instanceof Error && error.message === 'SKU must be unique') {
        return res.status(409).json({ error: 'SKU already exists' });
      }
      res.status(500).json({ 
        error: 'Failed to create product',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

 
  updateProduct: (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      
      if (updates.price !== undefined && (typeof updates.price !== 'number' || updates.price < 0)) {
        return res.status(400).json({ error: 'Price must be a non-negative number' });
      }

      if (updates.stock !== undefined && (typeof updates.stock !== 'number' || updates.stock < 0)) {
        return res.status(400).json({ error: 'Stock must be a non-negative number' });
      }

      if (updates.minStock !== undefined && (typeof updates.minStock !== 'number' || updates.minStock < 0)) {
        return res.status(400).json({ error: 'Minimum stock must be a non-negative number' });
      }

      const updatedProduct = inventoryService.updateProduct(id, updates);
      res.json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      if (error instanceof Error) {
        if (error.message === 'Product not found') {
          return res.status(404).json({ error: 'Product not found' });
        }
        if (error.message === 'SKU must be unique') {
          return res.status(409).json({ error: 'SKU already exists' });
        }
      }
      res.status(500).json({ 
        error: 'Failed to update product',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  
  deleteProduct: (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = inventoryService.deleteProduct(id);
      
      if (!success) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ 
        error: 'Failed to delete product',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

 
  adjustStock: (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { adjustment, reason } = req.body;

      if (typeof adjustment !== 'number') {
        return res.status(400).json({ error: 'Adjustment must be a number' });
      }

      const updatedProduct = inventoryService.adjustStock(id, adjustment, reason);
      res.json(updatedProduct);
    } catch (error) {
      console.error('Error adjusting stock:', error);
      if (error instanceof Error) {
        if (error.message === 'Product not found') {
          return res.status(404).json({ error: 'Product not found' });
        }
        if (error.message === 'Stock cannot be negative') {
          return res.status(400).json({ error: 'Stock cannot be negative' });
        }
      }
      res.status(500).json({ 
        error: 'Failed to adjust stock',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },
};