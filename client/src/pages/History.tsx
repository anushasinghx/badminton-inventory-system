import React, { useEffect, useState } from 'react';
import StockHistoryComponent from '../components/History/StockHistory';
import { historyAPI, productAPI } from '../services/api';
import { StockHistory, Product } from '../types';
import { showToast } from '../services/toast';
import { FiRefreshCw } from 'react-icons/fi';

const History: React.FC = () => {
  const [history, setHistory] = useState<StockHistory[]>([]);
  const [products, setProducts] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [historyResponse, productsResponse] = await Promise.all([
        historyAPI.getHistory(),
        productAPI.getAll(),
      ]);
      
      setHistory(historyResponse.data);
      setProducts(productsResponse.data.map(p => ({ id: p.id, name: p.name })));
    } catch (error) {
      console.error('Error fetching history:', error);
      showToast.error('Failed to load stock history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading stock history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock History</h1>
          <p className="text-gray-600 mt-1">Track all inventory changes and movements</p>
        </div>
        <button
          onClick={fetchData}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium mt-4 md:mt-0 disabled:opacity-50"
        >
          <FiRefreshCw className={refreshing ? 'animate-spin' : ''} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>


      <StockHistoryComponent history={history} products={products} />


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Understanding Stock History</h3>
          
            <li className="flex items-start space-x-2">
              <div className="p-1 bg-green-100 rounded mt-0.5">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
              </div>
              <div>
                <span className="font-medium text-gray-800">Green entries</span>
                <p className="text-sm text-gray-600">Indicate stock additions (restocks, returns)</p>
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <div className="p-1 bg-red-100 rounded mt-0.5">
                <div className="h-2 w-2 bg-red-500 rounded-full" />
              </div>
              <div>
                <span className="font-medium text-gray-800">Red entries</span>
                <p className="text-sm text-gray-600">Indicate stock reductions (sales, damages)</p>
              </div>
            </li>
            
        </div>


      </div>
    </div>
  );
};

export default History;