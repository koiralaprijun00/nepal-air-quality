'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { getPollutantLevel } from '../../services/overallAqiUtils';
import { getAqiCategory, calculateOverallAqi } from '../../services/AqiCalculator';
import AirQualityMap from './AirQualityMap';
import { 
  MapPinIcon, 
  ChartBarIcon, 
  MagnifyingGlassIcon,
  ViewColumnsIcon,
  MapIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

interface CityData {
  name: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  sampleData: Array<{
    components: Record<string, number>;
    dt: number;
    weather: {
      temp: number;
      feels_like: number;
      humidity: number;
      pressure: number;
      wind_speed: number;
      description: string;
      icon: string;
    };
  }>;
}

interface AirQualityDashboardProps {
  citiesData: CityData[];
  loading: boolean;
  error: string | null;
}

const AirQualityDashboard: React.FC<AirQualityDashboardProps> = ({ 
  citiesData, 
  loading, 
  error 
}) => {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'detailed' | 'map'>('card');

  // Filter cities based on search term
  const filteredCities = citiesData
    .filter(city => city.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading air quality data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-xl shadow-sm">
        <p className="font-medium mb-1">Error Loading Data</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!citiesData || citiesData.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-5 rounded-xl shadow-sm">
        <p className="font-medium">No Air Quality Data Available</p>
        <p className="text-sm mt-1">Please check your connection or try again later.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex items-center">
            <ChartBarIcon className="h-5 w-5 text-blue-500 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Air Quality by City</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            {/* View Mode Toggle */}
            <div className="flex p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setViewMode('card')}
                className={`flex items-center px-3 py-1.5 text-xs rounded ${
                  viewMode === 'card' 
                    ? 'bg-white shadow text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ViewColumnsIcon className="h-3.5 w-3.5 mr-1" />
                Card
              </button>
              <button
                onClick={() => setViewMode('detailed')}
                className={`flex items-center px-3 py-1.5 text-xs rounded ${
                  viewMode === 'detailed' 
                    ? 'bg-white shadow text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <AdjustmentsHorizontalIcon className="h-3.5 w-3.5 mr-1" />
                Detail
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center px-3 py-1.5 text-xs rounded ${
                  viewMode === 'map' 
                    ? 'bg-white shadow text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MapIcon className="h-3.5 w-3.5 mr-1" />
                Map
              </button>
            </div>
            
            {/* Search Input */}
            {viewMode !== 'map' && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {viewMode === 'map' ? (
        <AirQualityMap citiesData={citiesData} loading={loading} error={error} cityData={citiesData[0]} />
      ) : (
        <div className={`p-6 ${filteredCities.length === 0 ? '' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
          {filteredCities.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No cities match your search criteria.</p>
            </div>
          ) : (
            filteredCities.map((city, index) => {
              const sample = city.sampleData?.[0];
              const components = sample?.components || {};
              const { aqi, dominantPollutant } = calculateOverallAqi(components);
              const category = getAqiCategory(aqi);
              const weather = sample?.weather || {};
              
              // Get background gradient based on AQI category
              const getBgGradient = () => {
                if (aqi <= 50) return 'from-green-50 to-green-50/40';
                if (aqi <= 100) return 'from-yellow-50 to-yellow-50/40';
                if (aqi <= 150) return 'from-orange-50 to-orange-50/40';
                if (aqi <= 200) return 'from-red-50 to-red-50/40';
                if (aqi <= 300) return 'from-purple-50 to-purple-50/40';
                return 'from-red-100 to-red-50/40';
              };
              
              // Get border color based on AQI category
              const getBorderColor = () => {
                if (aqi <= 50) return 'border-green-100';
                if (aqi <= 100) return 'border-yellow-100';
                if (aqi <= 150) return 'border-orange-100';
                if (aqi <= 200) return 'border-red-100';
                if (aqi <= 300) return 'border-purple-100';
                return 'border-red-200';
              };

              return (
                <div 
                  key={index} 
                  className={`rounded-xl overflow-hidden hover:shadow-md transition-shadow border ${getBorderColor()} bg-gradient-to-br ${getBgGradient()}`}
                >
                  <div className="bg-white/80 backdrop-blur-sm border-b px-4 py-3 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{city.name}</h3>
                      <div className="text-xs text-gray-500 flex items-center">
                        <MapPinIcon className="h-3 w-3 mr-1" />
                        <span>{city.coordinates.lat.toFixed(2)}°, {city.coordinates.lon.toFixed(2)}°</span>
                      </div>
                    </div>
                    <Link 
                      href={`/city/${encodeURIComponent(city.name.toLowerCase())}`}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-sm font-medium transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                  
                  {sample && (
                    <div className="p-4">
                      {viewMode === 'card' ? (
                        <div className="flex flex-col">
                          {/* AQI Card */}
                          <div className="mb-4 flex items-center p-3 bg-white/90 rounded-lg shadow-sm">
                            <div className={`w-14 h-14 flex items-center justify-center rounded-lg ${category.color} text-2xl font-bold shadow-sm mr-3`}>
                              {aqi}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{category.label}</p>
                              <p className="text-xs text-gray-500">US EPA Air Quality Index</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="p-3 bg-white/90 rounded-lg shadow-sm mb-4">
                            <h4 className="font-medium text-gray-700 mb-1">US EPA AQI:</h4>
                            <div className="flex items-center">
                              <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${category.color} text-xl font-bold shadow-sm mr-3`}>
                                {aqi}
                              </div>
                              <p className="font-medium text-gray-800">{category.label}</p>
                            </div>
                          </div>
                          
                          {/* Weather Information */}
                          {sample?.weather && (
                            <div className="p-3 bg-white/90 rounded-lg shadow-sm mb-4">
                              <h4 className="font-medium text-gray-700 mb-2">Current Weather:</h4>
                              <div className="flex items-center space-x-4">
                                <img 
                                  src={`https://openweathermap.org/img/wn/${sample.weather.icon}@2x.png`} 
                                  alt="Weather icon"
                                  className="w-12 h-12"
                                />
                                <div>
                                  <div className="text-xl font-semibold">
                                    {Math.round(sample.weather.temp)}°C
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Feels like: {Math.round(sample.weather.feels_like)}°C
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Humidity: {sample.weather.humidity}%
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Wind: {sample.weather.wind_speed} m/s
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-3 space-y-2">
                            {Object.entries(components).slice(0, 4).map(([key, value]) => {
                              const { label } = getPollutantLevel(key, value as number);
                              
                              // Get text color based on pollutant level
                              let textColor = 'text-green-600';
                              if (label === 'Moderate' || label === 'Fair') textColor = 'text-yellow-600';
                              else if (label === 'Poor') textColor = 'text-orange-600';
                              else if (label === 'Very Poor') textColor = 'text-red-600';
                              
                              return (
                                <div key={key} className="flex justify-between px-3 py-2 bg-white/90 rounded-lg text-sm">
                                  <span className="text-gray-700">
                                    {key === 'pm2_5' ? 'PM2.5' : 
                                     key === 'pm10' ? 'PM10' : 
                                     key === 'o3' ? 'O₃' : 
                                     key === 'no2' ? 'NO₂' : 
                                     key === 'so2' ? 'SO₂' : 
                                     key === 'co' ? 'CO' : key.toUpperCase()}:
                                  </span>
                                  <span className={`font-medium ${textColor}`}>
                                    {(value as number).toFixed(1)} µg/m³
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default AirQualityDashboard;