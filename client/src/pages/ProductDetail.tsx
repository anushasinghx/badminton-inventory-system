import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit, FiPackage } from 'react-icons/fi';
import { Product, StockHistory } from '../types';
import { productAPI, historyAPI } from '../services/api';
import { showToast } from '../services/toast';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [history, setHistory] = useState<StockHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [adjustment, setAdjustment] = useState('');

  useEffect(() => {
    if (id) {
      fetchProductData();
    }
  }, [id]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const [productResponse, historyResponse] = await Promise.all([
        productAPI.getById(id!),
        historyAPI.getHistory({ productId: id }),
      ]);
      
      setProduct(productResponse.data);
      setHistory(historyResponse.data);
    } catch (error) {
      console.error('Error fetching product details:', error);
      showToast.error('Failed to load product details');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleStockAdjustment = async () => {
    if (!adjustment || !product) return;
    
    const adjustmentNum = parseInt(adjustment);
    if (isNaN(adjustmentNum)) {
      showToast.error('Please enter a valid number');
      return;
    }

    try {
      await productAPI.adjustStock(product.id, adjustmentNum, 'Manual adjustment');
      fetchProductData(); 
      setAdjustment('');
      showToast.success(`Stock adjusted by ${adjustmentNum}`);
    } catch (error) {
      showToast.error('Failed to adjust stock');
    }
  };

  const getStockStatus = () => {
    if (!product) return 'Unknown';
    if (product.stock === 0) return 'Out of Stock';
    if (product.stock <= product.minStock) return 'Low Stock';
    return 'In Stock';
  };

  const getStatusColor = () => {
    const status = getStockStatus();
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-5xl mb-4">❌</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Product not found</h3>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Products
        </button>
      </div>
    );
  }

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
    <div className="space-y-6">
    
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/products')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="text-gray-600 text-xl" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600">SKU: {product.sku}</p>
          </div>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => navigate(`/products?edit=${product.id}`)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiEdit />
            <span>Edit Product</span>
          </button>
        </div>
      </div>

   
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-6">

          <div className="card">
            <div className="flex flex-col md:flex-row md:items-start gap-6">

              <div className="flex-shrink-0">
                <div className="h-24 w-24 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FiPackage className="h-12 w-12 text-blue-600" />
                </div>
              </div>

             
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
                    {getStockStatus()}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {product.category || 'Uncategorized'}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-600">Price</div>
                    <div className="text-xl font-bold text-gray-900">
                      {formatCurrency(product.price)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Current Stock</div>
                    <div className="text-xl font-bold text-gray-900">{product.stock} units</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Minimum Stock</div>
                    <div className="text-xl font-bold text-gray-900">{product.minStock} units</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Inventory Value</div>
                    <div className="text-xl font-bold text-gray-900">
                      {formatCurrency(product.price * product.stock)}
                    </div>
                  </div>
                </div>

                {product.description && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Description</h4>
                    <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
                  </div>
                )}
              </div>
            </div>


            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Created</div>
                  <div className="font-medium">{formatDate(product.createdAt)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Last Updated</div>
                  <div className="font-medium">{formatDate(product.updatedAt)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Adjust Stock Amount</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adjustment Amount
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    <input
                      type="number"
                      value={adjustment}
                      onChange={(e) => setAdjustment(e.target.value)}
                      className="w-32 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
                      placeholder="e.g., 10"
                    />
                    <div className="px-4 py-2 bg-gray-100 text-gray-700 border border-l-0 border-gray-300 rounded-r-lg font-medium">
                      units
                    </div>
                  </div>
                  <button
                    onClick={handleStockAdjustment}
                    disabled={!adjustment}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-base"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Positive to add stock, negative to remove
                </p>
              </div>
            </div>
          </div>
        </div>


        <div className="space-y-6">

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Stock History</h3>
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No stock history available</p>
            ) : (
              <div className="space-y-3">
                {history.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-medium ${
                        entry.change > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {entry.change > 0 ? '+' : ''}{entry.change} units
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(entry.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{entry.reason}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {entry.previousStock} → {entry.newStock} units
                    </div>
                  </div>
                ))}
                {history.length > 5 && (
                  <button
                    onClick={() => navigate('/history')}
                    className="w-full py-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All History ({history.length} entries)
                  </button>
                )}
              </div>
            )}
          </div>


          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Stock Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Stock Level</span>
                <span>{product.stock} / {product.minStock}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    product.stock > product.minStock
                      ? 'bg-green-500'
                      : product.stock > 0
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{
                    width: `${Math.min((product.stock / (product.minStock)) * 100, 100)}%`,
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Days of Stock</div>
                  <div className="text-lg font-bold text-gray-900">
                    {product.stock > 0 ? '30+' : '0'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Restock Urgency</div>
                  <div className={`text-lg font-bold ${
                    product.stock === 0
                      ? 'text-red-600'
                      : product.stock <= product.minStock
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }`}>
                    {product.stock === 0
                      ? 'Critical'
                      : product.stock <= product.minStock
                      ? 'Soon'
                      : 'Good'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;