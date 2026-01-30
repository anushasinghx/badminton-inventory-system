export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  minStock: number;
  description?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockHistory {
  id: string;
  productId: string;
  productName: string;
  change: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  timestamp: Date;
}

export interface Analytics {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  categories: { [key: string]: number };
  recentActivity: StockHistory[];
}

export interface ExportOptions {
  startDate?: Date;
  endDate?: Date;
  includeOutOfStock?: boolean;
  includeLowStock?: boolean;
}