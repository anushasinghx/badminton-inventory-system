import React, { useState, useEffect, useRef } from 'react';
import { FiSave, FiX, FiPackage, FiBox } from 'react-icons/fi';
import { Product } from '../../types';
import { showToast } from '../../services/toast';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '',
    minStock: '',
    description: '',
    category: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        price: product.price.toString(),
        stock: product.stock.toString(),
        minStock: product.minStock.toString(),
        description: product.description || '',
        category: product.category || '',
      });
    }
  }, [product]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCancel]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (parseFloat(formData.price) < 0) newErrors.price = 'Price cannot be negative';
    if (!formData.stock) newErrors.stock = 'Stock is required';
    if (parseInt(formData.stock) < 0) newErrors.stock = 'Stock cannot be negative';
    if (!formData.minStock) newErrors.minStock = 'Minimum stock is required';
    if (parseInt(formData.minStock) < 0) newErrors.minStock = 'Minimum stock cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast.error('Please fix the errors in the form');
      return;
    }

    try {
      await onSubmit({
        name: formData.name.trim(),
        sku: formData.sku.trim().toUpperCase(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        minStock: parseInt(formData.minStock),
        description: formData.description.trim() || undefined,
        category: formData.category.trim() || undefined,
      });
      

    } catch (error) {
      showToast.error(
        product
          ? 'Failed to update product'
          : 'Failed to create product'
      );
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const categories = [
    'Rackets', 'Shuttlecocks', 'Apparel', 'Footwear', 
    'Accessories', 'Equipment', 'Other'
  ];

  return (
    <div 
      ref={formRef}
      className="card max-w-4xl mx-auto bg-white m-4 relative"
      onClick={(e) => e.stopPropagation()} 
    >

      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 px-6 pt-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <FiPackage className="text-blue-600 text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {product ? 'Update product details' : 'Fill in the product information'}
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
          type="button"
        >
          <FiX className="text-gray-600 text-xl" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 px-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <span className="text-red-500">*</span> Product Name
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <FiPackage className="text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full pl-12 pr-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                placeholder="e.g., Yonex Astrox 88D Pro"
                disabled={isLoading}
              />
            </div>
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 ml-1">{errors.name}</p>
            )}
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <span className="text-red-500">*</span> SKU
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value.toUpperCase())}
              className={`w-full px-4 py-3 border ${errors.sku ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono transition-all`}
              placeholder="e.g., YX-88DP"
              disabled={isLoading}
            />
            {errors.sku && (
              <p className="mt-2 text-sm text-red-600 ml-1">{errors.sku}</p>
            )}
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <span className="text-red-500">*</span> Price
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                ₹
              </div>
              <input
                type="number"
                min="1"
                step="1"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={`w-full pl-12 pr-4 py-3 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                placeholder="e.g., 4299"
                disabled={isLoading}
              />
            </div>
            {errors.price && (
              <p className="mt-2 text-sm text-red-600 ml-1">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Category
            </label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
                disabled={isLoading}
              >
                <option value="" className="text-gray-500">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="text-gray-900">
                    {cat}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <span className="text-red-500">*</span> Current Stock
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FiBox />
              </div>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', e.target.value)}
                className={`w-full pl-12 pr-4 py-3 border ${errors.stock ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                placeholder="e.g., 15"
                disabled={isLoading}
              />
            </div>
            {errors.stock && (
              <p className="mt-2 text-sm text-red-600 ml-1">{errors.stock}</p>
            )}
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <span className="text-red-500">*</span> Minimum Stock
            </label>
            <input
              type="number"
              min="0"
              value={formData.minStock}
              onChange={(e) => handleInputChange('minStock', e.target.value)}
              className={`w-full px-4 py-3 border ${errors.minStock ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
              placeholder="e.g., 5"
              disabled={isLoading}
            />
            {errors.minStock && (
              <p className="mt-2 text-sm text-red-600 ml-1">{errors.minStock}</p>
            )}
            <p className="mt-2 text-xs text-gray-500 ml-1">
              Alerts will trigger when stock falls below this level
            </p>
          </div>
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[120px] resize-none"
            placeholder="Enter product description, features, specifications..."
            disabled={isLoading}
            rows={4}
          />
        </div>


        <div className="flex items-center justify-end space-x-4 pt-8 border-t border-gray-200 pb-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium bg-gray-100 hover:bg-gray-200"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {isLoading ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FiSave className="text-lg" />
                <span className="font-semibold">
                  {product ? 'Update Product' : 'Create Product'}
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;