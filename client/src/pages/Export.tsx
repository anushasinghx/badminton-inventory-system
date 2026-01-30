
import React from 'react';
import ExportPanel from '../components/Export/ExportPanel';

const Export: React.FC = () => {
  return (
    <div className="space-y-6">
     
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Export Data</h1>
        <p className="text-gray-600 mt-1">Export your inventory data for analysis or backup</p>
      </div>

      
      <ExportPanel />

      
      </div>
    
  );
};

export default Export;