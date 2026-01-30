
import { Product, StockHistory, Analytics, ExportOptions } from '../types';


let products: Product[] = [];
let stockHistory: StockHistory[] = [];
let nextHistoryId = 1;


const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const getStockStatus = (stock: number, minStock: number): string => {
  if (stock === 0) return 'out-of-stock';
  if (stock <= minStock) return 'low-stock';
  return 'in-stock';
};

const addStockHistory = (
  productId: string,
  productName: string,
  change: number,
  previousStock: number,
  reason?: string
): void => {
  const historyEntry: StockHistory = {
    id: `hist_${nextHistoryId++}`,
    productId,
    productName,
    change,
    previousStock,
    newStock: previousStock + change,
    reason,
    timestamp: new Date(),
  };
  stockHistory.unshift(historyEntry);
  if (stockHistory.length > 1000) {
    stockHistory = stockHistory.slice(0, 1000);
  }
};

export const inventoryService = {
 //product ops
  getAllProducts: (filters?: {
    search?: string;
    status?: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
    category?: string;
    sortBy?: 'name' | 'price' | 'stock' | 'updatedAt';
    sortOrder?: 'asc' | 'desc';
  }) => {

    let filteredProducts = [...products];

  
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        p => 
          p.name.toLowerCase().includes(searchLower) || 
          p.sku.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower)
      );
    }


    if (filters?.status && filters.status !== 'all') {
      filteredProducts = filteredProducts.filter(p => 
        getStockStatus(p.stock, p.minStock) === filters.status
      );
    }

    
    if (filters?.category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category === filters.category
      );
    }

  
    if (filters?.sortBy) {
      filteredProducts.sort((a, b) => {
        let aValue, bValue;
        
        switch (filters.sortBy) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'stock':
            aValue = a.stock;
            bValue = b.stock;
            break;
          case 'updatedAt':
            aValue = new Date(a.updatedAt).getTime();
            bValue = new Date(b.updatedAt).getTime();
            break;
          default:
            return 0;
        }

        if (filters.sortOrder === 'desc') {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      });
    }

    return filteredProducts;
  },

  getProductById: (id: string): Product | undefined => {
    return products.find(p => p.id === id);
  },

  createProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {

    const skuExists = products.some(p => p.sku === productData.sku);
    if (skuExists) {
      throw new Error('SKU must be unique');
    }

    const newProduct: Product = {
      ...productData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    products.push(newProduct);
    

    addStockHistory(
      newProduct.id,
      newProduct.name,
      newProduct.stock,
      0,
      'Initial stock'
    );
    
    return newProduct;
  },

  updateProduct: (id: string, updateData: Partial<Product>): Product => {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }

    const oldProduct = products[index];
    
  
    if (updateData.sku && updateData.sku !== oldProduct.sku) {
      const skuExists = products.some(p => p.sku === updateData.sku && p.id !== id);
      if (skuExists) {
        throw new Error('SKU must be unique');
      }
    }

    const updatedProduct: Product = {
      ...oldProduct,
      ...updateData,
      updatedAt: new Date(),
    };
    
  
    if (updateData.stock !== undefined && updateData.stock !== oldProduct.stock) {
      const change = updateData.stock - oldProduct.stock;
      const reason = change > 0 ? 'Manual stock addition' : 'Manual stock reduction';
      addStockHistory(
        id,
        updatedProduct.name,
        change,
        oldProduct.stock,
        reason
      );
    }
    
    products[index] = updatedProduct;
    return updatedProduct;
  },

  deleteProduct: (id: string): boolean => {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    products.splice(index, 1);
    return true;
  },

  adjustStock: (id: string, adjustment: number, reason?: string): Product => {
    const product = inventoryService.getProductById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    const newStock = product.stock + adjustment;
    if (newStock < 0) {
      throw new Error('Stock cannot be negative');
    }

    return inventoryService.updateProduct(id, { stock: newStock });
  },

 
  getAnalytics: (): Analytics => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStockCount = products.filter(p => p.stock <= p.minStock && p.stock > 0).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;
    
    
    const categories: { [key: string]: number } = {};
    products.forEach(p => {
      const category = p.category || 'Uncategorized';
      categories[category] = (categories[category] || 0) + 1;
    });

   
    const recentActivity = stockHistory.slice(0, 10);

    return {
      totalProducts,
      totalValue,
      lowStockCount,
      outOfStockCount,
      categories,
      recentActivity,
    };
  },

 
  getStockHistory: (productId?: string): StockHistory[] => {
    if (productId) {
      return stockHistory.filter(h => h.productId === productId);
    }
    return [...stockHistory];
  },


  getProductsForExport: (options?: ExportOptions): Product[] => {
    let filteredProducts = [...products];

   
    if (options?.startDate || options?.endDate) {
      const start = options.startDate ? new Date(options.startDate) : new Date(0);
      const end = options.endDate ? new Date(options.endDate) : new Date();
      
      filteredProducts = filteredProducts.filter(p => {
        const createdAt = new Date(p.createdAt);
        return createdAt >= start && createdAt <= end;
      });
    }

    
    if (options?.includeOutOfStock === false) {
      filteredProducts = filteredProducts.filter(p => p.stock > 0);
    }

    if (options?.includeLowStock === false) {
      filteredProducts = filteredProducts.filter(p => p.stock > p.minStock);
    }

    return filteredProducts;
  },


  initializeSampleData: (): void => {
    if (products.length > 0) return;

    const badmintonProducts = [
      {
        name: 'Yonex Astrox 88D Pro Racket',
        sku: 'RACKET-YONEX-88DP',
        price: 229.99,
        stock: 15,
        minStock: 5,
        category: 'Rackets',
        description: 'Professional badminton racket, 4U weight, extra stiff flex',
      },
      {
        name: 'Victor Feather Shuttlecocks (Tube of 12)',
        sku: 'SHUT-VICTOR-GOLD',
        price: 34.99,
        stock: 8,
        minStock: 15,
        category: 'Shuttlecocks',
        description: 'Premium goose feather shuttlecocks, tournament grade',
      },
      {
        name: 'Badminton Team T-Shirt',
        sku: 'APPAREL-TSHIRT-M',
        price: 24.99,
        stock: 42,
        minStock: 20,
        category: 'Apparel',
        description: 'Dry-fit polyester t-shirt, moisture wicking, multiple colors',
      },
      {
        name: 'Li-Ning Court Shoes AYZM026',
        sku: 'SHOES-LINING-PRO',
        price: 129.99,
        stock: 0,
        minStock: 8,
        category: 'Footwear',
        description: 'Professional court shoes with carbon fiber plate',
      },
      {
        name: 'Plastic Shuttlecocks (Bag of 10)',
        sku: 'SHUT-PLASTIC-10',
        price: 12.99,
        stock: 75,
        minStock: 30,
        category: 'Shuttlecocks',
        description: 'Durable plastic shuttlecocks for training and recreation',
      },
      {
        name: 'Badminton Grip Towel',
        sku: 'ACC-GRIP-TOWEL',
        price: 8.99,
        stock: 120,
        minStock: 50,
        category: 'Accessories',
        description: 'Absorbent grip towel with anti-slip pattern',
      },
      {
        name: 'Training Track Suit',
        sku: 'APPAREL-TRACKSET',
        price: 59.99,
        stock: 6,
        minStock: 10,
        category: 'Apparel',
        description: 'Full track suit for training, breathable fabric',
      },
      {
        name: 'Stringing Machine Professional',
        sku: 'EQUIP-STRINGER-PRO',
        price: 899.99,
        stock: 2,
        minStock: 1,
        category: 'Equipment',
        description: '6-point mounting system, electronic tension control',
      },
    ];

    badmintonProducts.forEach(product => {
      inventoryService.createProduct(product);
    });

  
    const sampleReasons = [
      'New shipment received',
      'Online order fulfilled',
      'Tournament bulk purchase',
      'Return processed',
      'Stock take adjustment',
      'Damaged items removed',
      'Promotional bundle',
    ];

    products.forEach((product, index) => {
      if (index < 5) { 
        const adjustments = [10, -5, 15, -8, 20];
        adjustments.forEach((adjustment, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (i + 1) * 2); 
          
          const history: StockHistory = {
            id: `hist_sample_${index}_${i}`,
            productId: product.id,
            productName: product.name,
            change: adjustment,
            previousStock: product.stock + (adjustment * (i + 1)),
            newStock: product.stock + (adjustment * i),
            reason: sampleReasons[i % sampleReasons.length],
            timestamp: date,
          };
          stockHistory.push(history);
        });
      }
    });

   
    stockHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },
};