import React from 'react';
import { FiPackage, FiDollarSign, FiAlertTriangle, FiXCircle } from 'react-icons/fi';

interface SummaryCardProps {
  type: 'total' | 'value' | 'low' | 'out';
  title: string;
  value: string | number;
  description?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ type, title, value, description }) => {
  const getIcon = () => {
    switch (type) {
      case 'total': return <FiPackage className="text-blue-600" />;
      case 'value': return <FiDollarSign className="text-green-600" />;
      case 'low': return <FiAlertTriangle className="text-yellow-600" />;
      case 'out': return <FiXCircle className="text-red-600" />;
      default: return <FiPackage className="text-blue-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'total': return 'bg-blue-50 border-blue-300';
      case 'value': return 'bg-green-50 border-green-300';
      case 'low': return 'bg-yellow-50 border-yellow-300';
      case 'out': return 'bg-red-50 border-red-300';
      default: return 'bg-gray-50 border-gray-300';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'total': return 'text-blue-800';
      case 'value': return 'text-green-800';
      case 'low': return 'text-yellow-800';
      case 'out': return 'text-red-800';
      default: return 'text-gray-800';
    }
  };

  return (
    <div className={`border-2 ${getBgColor()} rounded-lg transition-transform hover:scale-[1.02] p-5`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 rounded-lg bg-white shadow-sm border border-gray-100">
              {getIcon()}
            </div>
            <h3 className={`text-sm font-semibold ${getTextColor()}`}>{title}</h3>
          </div>
          
          <div className="mt-3 ml-1">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            {description && (
              <p className="text-xs text-gray-600 mt-2 ml-1">{description}</p>
            )}
          </div>
        </div>
        
       
      </div>
      
      
    </div>
  );
};

export default SummaryCard;