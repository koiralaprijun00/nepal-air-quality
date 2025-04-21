// src/app/components/SearchBar.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  cities?: Array<{name: string; coordinates?: {lat: number; lon: number}}>;
  autoNavigate?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search for a city...",
  className = "",
  onSearch,
  cities = [],
  autoNavigate = false
}) => {
  const [query, setQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filteredCities, setFilteredCities] = useState<Array<{name: string; coordinates?: {lat: number; lon: number}}>>([]);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter cities based on search query
  useEffect(() => {
    if (!query.trim()) {
      setFilteredCities([]);
      return;
    }

    const filtered = cities.filter(city => 
      city.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5); // Limit to 5 results
    
    setFilteredCities(filtered);
    setIsOpen(filtered.length > 0);
  }, [query, cities]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
    setIsOpen(false);
  };

  const handleCityClick = (cityName: string) => {
    setQuery(cityName);
    setIsOpen(false);
    
    if (onSearch) onSearch(cityName);
    
    if (autoNavigate) {
      router.push(`/city/${encodeURIComponent(cityName.toLowerCase())}`);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setFilteredCities([]);
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-500"
          />
          
          {query && (
            <button 
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </form>
      
      {/* Search results dropdown */}
      {isOpen && filteredCities.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
          <ul className="py-1">
            {filteredCities.map((city, index) => (
              <li 
                key={index}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-700"
                onClick={() => handleCityClick(city.name)}
              >
                <div className="flex items-center">
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{city.name}</span>
                </div>
                {city.coordinates && (
                  <div className="text-xs text-gray-500 ml-6">
                    {city.coordinates.lat.toFixed(2)}°, {city.coordinates.lon.toFixed(2)}°
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;