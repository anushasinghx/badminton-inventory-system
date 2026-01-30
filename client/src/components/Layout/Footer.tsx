// client/src/components/Layout/Footer.tsx
import React from 'react';
import { FiHeart } from 'react-icons/fi';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-pink-50 to-rose-200 border-b border-pink-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-gray-800">InventoryPro</h3>
            <p className="text-sm text-gray-600 mt-0">
              A complete inventory management solution
            </p>
          </div>
          
          {/* <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Made with <FiHeart className="inline text-red-500" /> for inventory managers
            </div>
            <div className="text-xs text-gray-500">
              © {new Date().getFullYear()} All rights reserved
            </div>
          </div> */}
          
          <div className="mt-4 md:mt-0">
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Version 1.0.0 - Built for Upsellity AI
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;