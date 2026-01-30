import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductTable from '../components/Products/ProductTable';
import ProductForm from '../components/Products/ProductForm';
import SearchFilter from '../components/Products/SearchFilter';
import { Product, StockStatus, SortField, SortDirection } from '../types';
import { productAPI } from '../services/api';
import { showToast } from '../services/toast';
import { FiPlus } from 'react-icons/fi';

const Products: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

 
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StockStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('updatedAt'); 
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc'); 
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll({
        search,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        category: categoryFilter || undefined,
        sortBy: sortField,
        sortOrder: sortDirection,
      });
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, statusFilter, categoryFilter, sortField, sortDirection]);

  const handleCreateProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await productAPI.create(productData);
      const newProduct = response.data;
      

      setProducts(prev => [newProduct, ...prev]);
      setFilteredProducts(prev => [newProduct, ...prev]);
      
      setShowForm(false);
      showToast.success('Product created successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to create product';
      showToast.error(errorMessage);
      throw error;
    }
  };

  const handleUpdateProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingProduct) return;
    
    try {
      const response = await productAPI.update(editingProduct.id, productData);
      const updatedProduct = response.data;
      
   
      const updatedProducts = products.map(p => p.id === editingProduct.id ? updatedProduct : p);
      const updatedFilteredProducts = filteredProducts.map(p => p.id === editingProduct.id ? updatedProduct : p);
      
 
      const sortProductsByUpdatedAt = (products: Product[]) => {
        return [...products].sort((a, b) => {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
      };
      
      setProducts(sortProductsByUpdatedAt(updatedProducts));
      setFilteredProducts(sortProductsByUpdatedAt(updatedFilteredProducts));
      
      setEditingProduct(null);
      showToast.success('Product updated successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to update product';
      showToast.error(errorMessage);
      throw error;
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await productAPI.delete(id);
      
      // Update BOTH states
      setProducts(prev => prev.filter(p => p.id !== id));
      setFilteredProducts(prev => prev.filter(p => p.id !== id));
      
      showToast.success('Product deleted successfully!');
    } catch (error) {
      showToast.error('Failed to delete product');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleViewProduct = (id: string) => {
    navigate(`/products/${id}`);
  };

  const handleAddStock = (id: string) => {

    const adjustment = prompt('Enter stock adjustment (positive to add, negative to remove):', '10');
    if (adjustment && !isNaN(parseInt(adjustment))) {
      productAPI.adjustStock(id, parseInt(adjustment), 'Manual adjustment')
        .then(response => {
          const updatedProduct = response.data;
          

          const updatedProducts = products.map(p => p.id === id ? updatedProduct : p);
          const updatedFilteredProducts = filteredProducts.map(p => p.id === id ? updatedProduct : p);
          

          const sortProductsByUpdatedAt = (products: Product[]) => {
            return [...products].sort((a, b) => {
              return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            });
          };
          
          setProducts(sortProductsByUpdatedAt(updatedProducts));
          setFilteredProducts(sortProductsByUpdatedAt(updatedFilteredProducts));
          
          showToast.success(`Stock adjusted by ${adjustment}`);
        })
        .catch(error => {
          showToast.error('Failed to adjust stock');
        });
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setCategoryFilter('');
    setSortField('updatedAt'); 
    setSortDirection('desc');   
  };

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean) as string[]));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };


  const totalInventoryValue = filteredProducts.reduce((sum, product) => {
    return sum + (product.price * product.stock);
  }, 0);


  const uniqueCategoriesCount = new Set(filteredProducts.map(p => p.category || 'Uncategorized')).size;

  return (
    <div className="space-y-6">
    
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium mt-4 md:mt-0"
        >
          <FiPlus />
          <span>Add New Product</span>
        </button>
      </div>

 
      <SearchFilter
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        sortField={sortField}
        onSortFieldChange={setSortField}
        sortDirection={sortDirection}
        onSortDirectionChange={setSortDirection}
        categories={categories}
        onClearFilters={handleClearFilters}
        totalResults={filteredProducts.length}
      />

    
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <ProductForm
              product={editingProduct}
              onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
              onCancel={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
            />
          </div>
        </div>
      )}

     
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      ) : (
        <ProductTable
          products={filteredProducts}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onView={handleViewProduct}
          onAddStock={handleAddStock}
        />
      )}

      
      {!loading && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Total Inventory Value</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalInventoryValue)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Sum of all product values
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Categories</div>
            <div className="text-2xl font-bold text-gray-900">
              {uniqueCategoriesCount}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Unique product categories
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;