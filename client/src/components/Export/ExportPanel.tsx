
import React, { useState } from 'react';
import { FiDownload, FiCalendar, FiFileText, FiFile, FiCheck } from 'react-icons/fi';
import { ExportOptions } from '../../types';
import { exportAPI } from '../../services/api';
import { showToast } from '../../services/toast';

const ExportPanel: React.FC = () => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeOutOfStock: true,
    includeLowStock: true,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [format, setFormat] = useState<'csv' | 'json'>('csv');

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = format === 'csv' 
        ? await exportAPI.exportCSV(exportOptions)
        : await exportAPI.exportJSON(exportOptions);

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `inventory_export_${timestamp}.${format}`;
      
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      showToast.success(`Export completed! File: ${filename}`);
    } catch (error) {
      showToast.error('Failed to export inventory data');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setExportOptions(prev => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  return (
    <div className="card max-w-4xl mx-auto">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-green-100 rounded-lg">
          <FiDownload className="text-green-600 text-2xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Export Inventory</h2>
          <p className="text-gray-600">Export your inventory data in various formats</p>
        </div>
      </div>

      <div className="space-y-8">
       
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Export Format</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setFormat('csv')}
              className={`p-6 rounded-lg border-2 transition-all ${
                format === 'csv'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  format === 'csv' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <FiFileText className={`text-xl ${
                    format === 'csv' ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">CSV Format</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Best for spreadsheets and data analysis
                  </p>
                </div>
                {format === 'csv' && (
                  <FiCheck className="text-blue-600 text-xl ml-auto" />
                )}
              </div>
            </button>

            
          </div>
        </div>

        
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiCalendar className="mr-2" />
            Date Range (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={exportOptions.startDate || ''}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={exportOptions.endDate || ''}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                className="input"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Leave empty to export all data. Dates are based on product creation date.
          </p>
        </div>

        
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Include Products</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={exportOptions.includeOutOfStock}
                onChange={(e) =>
                  setExportOptions(prev => ({
                    ...prev,
                    includeOutOfStock: e.target.checked,
                  }))
                }
                className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-700">Out of stock products</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={exportOptions.includeLowStock}
                onChange={(e) =>
                  setExportOptions(prev => ({
                    ...prev,
                    includeLowStock: e.target.checked,
                  }))
                }
                className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-700">Low stock products</span>
            </label>
          </div>
        </div>


        <div className="pt-6 border-t border-gray-200">
          
          

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-lg flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Preparing Export...</span>
              </>
            ) : (
              <>
                <FiDownload className="text-xl" />
                <span>Download Export</span>
              </>
            )}
          </button>

          
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;