// client/src/types/index.ts
export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  minStock: number;
  description?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockHistory {
  id: string;
  productId: string;
  productName: string;
  change: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  timestamp: string;
}

export interface Analytics {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  categories: { [key: string]: number };
  recentActivity: StockHistory[];
}

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';
export type SortField = 'name' | 'price' | 'stock' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';

export interface FilterOptions {
  search: string;
  status: StockStatus | 'all';
  category: string;
}

export interface SortOptions {
  field: SortField;
  direction: SortDirection;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
}

export interface ExportOptions {
  startDate?: string;
  endDate?: string;
  includeOutOfStock: boolean;
  includeLowStock: boolean;
}