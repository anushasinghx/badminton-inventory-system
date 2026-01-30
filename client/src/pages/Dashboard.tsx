import React, { useEffect, useState } from 'react';
import SummaryCard from '../components/Dashboard/SummaryCard';
import AnalyticsChart from '../components/Dashboard/AnalyticsChart';
import LowStockAlerts from '../components/Dashboard/LowStockAlerts';
import { analyticsAPI, productAPI } from '../services/api';
import { Analytics, Product } from '../types';
import { showToast } from '../services/toast';
import { FiRefreshCw } from 'react-icons/fi';

const Dashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [analyticsResponse, productsResponse] = await Promise.all([
        analyticsAPI.getAnalytics(),
        productAPI.getAll(),
      ]);
      
      setAnalytics(analyticsResponse.data);
      setProducts(productsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showToast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load data</h3>
        <p className="text-gray-600 mb-6">Unable to load dashboard analytics</p>
        <button
          onClick={handleRefresh}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  
  const totalInventoryValue = products.reduce((sum, product) => {
    return sum + (product.price * product.stock);
  }, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your inventory performance</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium mt-4 md:mt-0 disabled:opacity-50"
        >
          <FiRefreshCw className={refreshing ? 'animate-spin' : ''} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
        </button>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          type="total"
          title="Total Products"
          value={analytics.totalProducts}
          description="Active products in inventory"
        />
        <SummaryCard
          type="value"
          title="Total Inventory Value"
          value={formatCurrency(totalInventoryValue)}
          description="Sum of all product values"
        />
        <SummaryCard
          type="low"
          title="Low Stock Items"
          value={analytics.lowStockCount}
          description="Need reordering"
        />
        <SummaryCard
          type="out"
          title="Out of Stock"
          value={analytics.outOfStockCount}
          description="Immediate restock needed"
        />
      </div>

      
      <AnalyticsChart analytics={analytics} />

      
      <LowStockAlerts products={products} />

      
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        {analytics.recentActivity.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-3">
            {analytics.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded ${
                    activity.change > 0 
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {activity.change > 0 ? '+' : ''}{activity.change}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{activity.productName}</div>
                    <div className="text-sm text-gray-600">{activity.reason}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(activity.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;