"use client"

import React, { useState } from 'react';

interface AirQualityFilterProps {
  onFilterChange: (filterId: string) => void;
}

interface FilterOption {
  id: string;
  name: string;
  range?: string;
  color?: string;
}

const AirQualityFilter: React.FC<AirQualityFilterProps> = ({ onFilterChange }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  const filters: FilterOption[] = [
    { id: 'all', name: 'All Cities' },
    { id: 'good', name: 'Good', range: '0-50', color: 'bg-green-100 text-green-800' },
    { id: 'moderate', name: 'Moderate', range: '51-100', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'sensitive', name: 'Sensitive Groups', range: '101-150', color: 'bg-orange-100 text-orange-800' },
    { id: 'unhealthy', name: 'Unhealthy', range: '151-200', color: 'bg-red-100 text-red-800' },
    { id: 'very-unhealthy', name: 'Very Unhealthy', range: '201-300', color: 'bg-purple-100 text-purple-800' },
    { id: 'hazardous', name: 'Hazardous', range: '301+', color: 'bg-rose-100 text-rose-800' }
  ];
  
  const handleFilterClick = (filterId: string): void => {
    setActiveFilter(filterId);
    onFilterChange(filterId);
  };
  
  return (
    <div className="my-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Air Quality:</h3>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterClick(filter.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
              activeFilter === filter.id 
                ? `${filter.color || 'bg-blue-100 text-blue-800'} ring-2 ring-offset-1 ${filter.color ? filter.color.replace('bg-', 'ring-').replace('-100', '-400') : 'ring-blue-400'}`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.name}
            {filter.range && <span className="ml-1 opacity-75">({filter.range})</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AirQualityFilter;