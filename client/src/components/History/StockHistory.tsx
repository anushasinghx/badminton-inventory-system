import React, { useState } from 'react';
import { FiCalendar, FiPackage, FiFilter } from 'react-icons/fi';
import { StockHistory } from '../../types';

interface StockHistoryProps {
  history: StockHistory[];
  products: Array<{ id: string; name: string }>;
}

const StockHistoryComponent: React.FC<StockHistoryProps> = ({ history, products }) => {
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [filterType, setFilterType] = useState<'all' | 'in' | 'out'>('all');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredHistory = history.filter((entry) => {

    if (selectedProduct !== 'all' && entry.productId !== selectedProduct) {
      return false;
    }


    const entryDate = new Date(entry.timestamp);
    const now = new Date();
    switch (dateRange) {
      case 'today':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (entryDate < today) return false;
        break;
      case 'week':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (entryDate < weekAgo) return false;
        break;
      case 'month':
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        if (entryDate < monthAgo) return false;
        break;
      default:
        break;
    }

    // Type filter
    if (filterType !== 'all') {
      if (filterType === 'in' && entry.change <= 0) return false;
      if (filterType === 'out' && entry.change >= 0) return false;
    }

    return true;
  });

  const getTotalChange = () => {
    return filteredHistory.reduce((sum, entry) => sum + entry.change, 0);
  };

  const getChangeTypeColor = (change: number) => {
    return change > 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeTypeIcon = (change: number) => {
    const Icon = change > 0 ? '↑' : '↓';
    return (
      <div className={`text-lg font-bold ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
        {Icon}
      </div>
    );
  };

  return (
    <div className="space-y-6">
  
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Changes</p>
              <p className="text-2xl font-bold text-gray-900">{filteredHistory.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiCalendar className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

   
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiFilter className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Stock History</h3>
              <p className="text-sm text-gray-600">Track all inventory movements</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
         
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="input py-2 text-sm"
            >
              <option value="all">All Products</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>

           
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="input py-2 text-sm"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>

           
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="input py-2 text-sm"
            >
              <option value="all">All Changes</option>
              <option value="in">Stock Increases</option>
              <option value="out">Stock Decreases</option>
            </select>
          </div>
        </div>

      
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <FiPackage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">No stock history found for the selected filters</p>
            </div>
          ) : (
            filteredHistory.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className={`p-3 rounded-lg ${
                  entry.change > 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {getChangeTypeIcon(entry.change)}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{entry.productName}</h4>
                      <p className="text-sm text-gray-600 mt-1">{entry.reason || 'Stock adjustment'}</p>
                    </div>
                    <div className={`text-lg font-bold ${getChangeTypeColor(entry.change)}`}>
                      {entry.change > 0 ? '+' : ''}{entry.change}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">{entry.previousStock}</span>
                      <span className="mx-2">→</span>
                      <span className="font-medium">{entry.newStock}</span>
                      <span className="ml-2">units</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {getTimeAgo(entry.timestamp)}
                    </div>
                  </div>

                  
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Previous: {entry.previousStock}</span>
                      <span>Current: {entry.newStock}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          entry.change > 0 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{
                          width: `${Math.min(
                            (Math.abs(entry.change) / Math.max(entry.previousStock, entry.newStock)) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

       
        {filteredHistory.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <div className="text-gray-600">
                Showing {filteredHistory.length} of {history.length} total entries
              </div>
              <div className="font-medium">
                Net change: <span className={getTotalChange() >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {getTotalChange() >= 0 ? '+' : ''}{getTotalChange()} units
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockHistoryComponent;