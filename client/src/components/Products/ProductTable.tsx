import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiEye, FiPlus, FiPackage } from 'react-icons/fi';
import { Product, StockStatus } from '../../types';
import { showToast } from '../../services/toast';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onAddStock: (id: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
  onView,
  onAddStock,
}) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const getStockStatus = (product: Product): StockStatus => {
    if (product.stock === 0) return 'out-of-stock';
    if (product.stock <= product.minStock) return 'low-stock';
    return 'in-stock';
  };

  const getStatusColor = (status: StockStatus) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: StockStatus) => {
    switch (status) {
      case 'in-stock': return 'In';
      case 'low-stock': return 'Low';
      case 'out-of-stock': return 'Out';
      default: return '?';
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      onDelete(id);
      showToast.success(`"${name}" deleted successfully`);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              
              <th className="table-header">Actions</th>
              <th className="table-header text-left">Product</th>
              <th className="table-header">SKU</th>
              <th className="table-header">Category</th>
              <th className="table-header">Stock</th>
              <th className="table-header">Status</th>
              <th className="table-header">Price</th>
              <th className="table-header">Value</th>
              <th className="table-header">Updated</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <FiPackage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium">No products found</p>
                    <p className="mt-1">Add your first product to get started</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const status = getStockStatus(product);
                const productValue = product.price * product.stock;

                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                   
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onView(product.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FiEye />
                        </button>
                        <button
                          onClick={() => onEdit(product)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => onAddStock(product.id)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Add Stock"
                        >
                          <FiPlus />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>

                   
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <FiPackage className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    
                    <td className="px-6 py-4">
                      <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono">
                        {product.sku}
                      </code>
                    </td>

                   
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                        {product.category || 'Uncategorized'}
                      </span>
                    </td>

                    
                    <td className="px-6 py-4">
                      <div className="text-center">
                        <div className="font-bold text-gray-900 text-lg">{product.stock}</div>
                        <div className="text-gray-500 text-sm">min: {product.minStock}</div>
                      </div>
                    </td>

                    
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        {getStatusText(status)}
                      </span>
                    </td>

                   
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {formatCurrency(product.price)}
                    </td>

                  
                    <td className="px-6 py-4 font-medium text-green-700">
                      {formatCurrency(productValue)}
                    </td>

                    
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(product.updatedAt)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;