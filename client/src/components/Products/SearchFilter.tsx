import React from 'react';
import { StockStatus, SortField, SortDirection } from '../../types';

interface SearchFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: StockStatus | 'all';
  onStatusFilterChange: (value: StockStatus | 'all') => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  sortField: SortField;
  onSortFieldChange: (value: SortField) => void;
  sortDirection: SortDirection;
  onSortDirectionChange: (value: SortDirection) => void;
  categories: string[];
  onClearFilters: () => void;
  totalResults: number;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sortField,
  onSortFieldChange,
  sortDirection,
  onSortDirectionChange,
  categories,
  onClearFilters,
  totalResults,
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'text-gray-700', bgColor: 'bg-gray-100' },
    { value: 'in-stock', label: 'In Stock', color: 'text-green-700', bgColor: 'bg-green-100' },
    { value: 'low-stock', label: 'Low Stock', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
    { value: 'out-of-stock', label: 'Out of Stock', color: 'text-red-700', bgColor: 'bg-red-100' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'price', label: 'Price' },
    { value: 'stock', label: 'Stock Level' },
    { value: 'updatedAt', label: 'Last Updated' },
  ];

  const hasActiveFilters = 
    search !== '' || 
    statusFilter !== 'all' || 
    categoryFilter !== '' || 
    sortField !== 'name' || 
    sortDirection !== 'asc';

  return (
    <div className="card mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Product Search</h3>
          <p className="text-sm text-gray-600">
            {totalResults} product{totalResults !== 1 ? 's' : ''} found
          </p>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors mt-2 md:mt-0 border border-gray-300"
          >
            <span>Clear All Filters</span>
          </button>
        )}
      </div>

     
      <div className="mb-6">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products, SKU..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
     
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Status
          </label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => {
              const isActive = statusFilter === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => onStatusFilterChange(option.value as any)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                    isActive
                      ? `${option.bgColor} ${option.color} border-gray-300 font-semibold`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

       
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryFilterChange(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer text-sm"
            >
              <option value="" className="text-gray-700 py-2">
                All Categories
              </option>
              {categories.map((category) => (
                <option 
                  key={category} 
                  value={category}
                  className="text-gray-900 py-2"
                >
                  {category}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <select
                value={sortField}
                onChange={(e) => onSortFieldChange(e.target.value as SortField)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none text-sm"
              >
                {sortOptions.map((option) => (
                  <option 
                    key={option.value} 
                    value={option.value}
                    className="text-gray-900 py-2"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            <button
              onClick={() => 
                onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc')
              }
              className={`px-4 py-2.5 border rounded-lg transition-colors font-medium text-sm ${
                sortDirection === 'asc'
                  ? 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  : 'bg-gray-800 text-white border-gray-800 hover:bg-gray-900'
              }`}
            >
              {sortDirection === 'asc' ? 'A→Z' : 'Z→A'}
            </button>
          </div>
        </div>
      </div>


      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Active filters:</span>
            {search && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs border border-blue-200">
                Search: "{search}"
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs border border-blue-200">
                Status: {statusOptions.find(o => o.value === statusFilter)?.label}
              </span>
            )}
            {categoryFilter && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs border border-blue-200">
                Category: {categoryFilter}
              </span>
            )}
            {sortField !== 'name' && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs border border-blue-200">
                Sorted by: {sortOptions.find(o => o.value === sortField)?.label}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;