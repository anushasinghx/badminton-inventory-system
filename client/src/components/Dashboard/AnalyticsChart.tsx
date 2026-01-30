import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Analytics } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsChartProps {
  analytics: Analytics;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ analytics }) => {

  const categoryEntries = Object.entries(analytics.categories).slice(0, 6);
  const pieChartData = {
    labels: categoryEntries.map(([category]) => category),
    datasets: [
      {
        label: 'Products by Category',
        data: categoryEntries.map(([, count]) => count),
        backgroundColor: [
          'rgba(249, 168, 212, 0.8)', 
          'rgba(186, 230, 253, 0.8)', 
          'rgba(196, 181, 253, 0.8)', 
          'rgba(209, 250, 229, 0.8)', 
          'rgba(254, 215, 170, 0.8)', 
          'rgba(253, 224, 71, 0.8)',  
        ],
        borderColor: [
          'rgb(249, 168, 212)', 
          'rgb(186, 230, 253)',  
          'rgb(196, 181, 253)',  
          'rgb(209, 250, 229)',  
          'rgb(254, 215, 170)',  
          'rgb(253, 224, 71)',   
        ],
        borderWidth: 2,
      },
    ],
  };


  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        display: false, 
      },
      tooltip: {
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 14,
        },
      },
    },
    
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="card w-full max-w-4xl">
        <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Product Categories Distribution</h3>
        <div className="h-[400px] flex items-center justify-center"> 
          <Pie 
            data={pieChartData} 
            options={pieChartOptions}
            height={350}
          />
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-bold">
            <div className="text-center">
              <div className="text-lg text-gray-800">Total Categories</div>
              <div className="text-lg font-bold text-pink-600">
                {Object.keys(analytics.categories).length}
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg text-gray-800">Top Category</div>
              <div className="text-lg font-semibold text-gray-800 truncate">
                {categoryEntries[0]?.[0] || 'N/A'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg text-gray-800">Products in Top</div>
              <div className="text-lg font-bold text-blue-600">
                {categoryEntries[0]?.[1] || 0}
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg text-gray-800">Total Products</div>
              <div className="text-lg font-bold text-green-600">
                {analytics.totalProducts}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;