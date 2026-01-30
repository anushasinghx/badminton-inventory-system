import React from 'react';
import { FiAlertTriangle, FiPackage } from 'react-icons/fi';
import { Product } from '../../types';
import { useNavigate } from 'react-router-dom';

interface LowStockAlertsProps {
  products: Product[];
}

const LowStockAlerts: React.FC<LowStockAlertsProps> = ({ products }) => {
  const navigate = useNavigate();
  
  const lowStockProducts = products
    .filter(p => p.stock <= p.minStock && p.stock > 0)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);

  const outOfStockProducts = products
    .filter(p => p.stock === 0)
    .slice(0, 5);

  const getStockPercentage = (product: Product) => {
    return (product.stock / product.minStock) * 100;
  };

  const handleViewProduct = (id: string) => {
    navigate(`/products/${id}`);
  };

  const handleRestockAll = () => {
    alert('Restock action would be triggered here. In a real app, this would open a bulk restock form.');
  };

  if (lowStockProducts.length === 0 && outOfStockProducts.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <FiPackage className="text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Stock Status</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h4 className="text-lg font-medium text-gray-800 mb-2">All products are well stocked!</h4>
          <p className="text-gray-600">No low stock or out of stock items.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center mb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <FiAlertTriangle className="text-yellow-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Stock Alerts!</h3>
        </div>
        <button
          onClick={handleRestockAll}
          className=" ml-4 px-3.5 py-1 bg-pink-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-medium"
        >
          Restock All
        </button>
      </div>

      {/* Low Stock Section */}
      {lowStockProducts.length > 0 && (
        <div className="mb-8">
          <h4 className="text-sm font-medium text-yellow-700 mb-3">Low Stock Items</h4>
          <div className="space-y-3">
            {lowStockProducts.map((product) => {
              const percentage = getStockPercentage(product);
              return (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200 cursor-pointer hover:bg-yellow-100 transition-colors"
                  onClick={() => handleViewProduct(product.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{product.name}</span>
                      <span className="text-sm font-medium text-yellow-700">
                        {product.stock} / {product.minStock}
                      </span>
                    </div>
                    <div className="w-full bg-yellow-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>SKU: {product.sku}</span>
                      <span>{Math.round(percentage)}% of minimum</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Out of Stock Section */}
      {outOfStockProducts.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-red-700 mb-3">Out of Stock Items</h4>
          <div className="space-y-3">
            {outOfStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200 cursor-pointer hover:bg-red-100 transition-colors"
                onClick={() => handleViewProduct(product.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded">
                    <FiPackage className="text-red-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-600">SKU: {product.sku}</div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                  Restock Required
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Total alerts: {lowStockProducts.length + outOfStockProducts.length} items need attention
        </div>
      </div>
    </div>
  );
};

export default LowStockAlerts;