'use client'

import React, { useState } from 'react';
import { getPollutantLevel } from '../../services/overallAqiUtils';
import UsAqiCard from './UsAqiCard';
import { AqiComparisonBox } from './AqiTrendsChart';
import { getAqiCategory, calculateOverallAqi } from '../../services/AqiCalculator';

interface CityAirQualityData {
  name: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  sampleData: any[];
}

interface AirQualityDashboardProps {
  citiesData: CityAirQualityData[];
  loading: boolean;
  error: string | null;
}

const AirQualityDashboard: React.FC<AirQualityDashboardProps> = ({ 
  citiesData, 
  loading, 
  error 
}) => {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'detailed'>('card');

  if (loading) {
    return (
      <div className="text-center py-6 bg-white rounded-lg shadow">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
        <p>Loading air quality data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p className="font-medium">Error Loading Data</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!citiesData || citiesData.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
        <p className="font-medium">No Air Quality Data Available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold mb-2 md:mb-0">Air Quality in Cities</h2>
        
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('card')}
              className={`px-3 py-1 rounded ${viewMode === 'card' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Card View
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-3 py-1 rounded ${viewMode === 'detailed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Detailed View
            </button>
          </div>
          
          <input
            type="text"
            placeholder="Search city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {citiesData
          .filter(city => city.name.toLowerCase().includes(search.toLowerCase()))
          .map((city, index) => {
            const sample = city.sampleData?.[0];
            const components = sample?.components || {};

            return (
              <div key={index} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-gray-50 border-b px-4 py-3 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold">{city.name}</h3>
                    <div className="text-sm text-gray-600">
                      <span>Lat: {city.coordinates.lat.toFixed(4)}°</span>
                      <span className="ml-2">Lon: {city.coordinates.lon.toFixed(4)}°</span>
                    </div>
                  </div>
                  <a 
                    href={`/city/${encodeURIComponent(city.name.toLowerCase())}`}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                  >
                    Details
                  </a>
                </div>
                
                {sample && (
                  <div className="p-4">
                    {viewMode === 'card' ? (
                      <>
                        <div className="mb-4">
                          <AqiComparisonBox
                            openWeatherAqi={sample.main?.aqi || 0}
                            components={components}
                          />
                        </div>
                        <UsAqiCard 
                          pollutants={components} 
                          timestamp={sample.dt}
                        />
                      </>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-600 mb-3">
                          Date: {new Date(sample.dt * 1000).toLocaleString()}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium text-gray-700 mb-1">OpenWeather AQI:</h4>
                            <p className="text-2xl font-bold">{sample.main?.aqi || 'N/A'}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-700 mb-1">US EPA AQI:</h4>
                            <p className="text-2xl font-bold">
                              {calculateOverallAqi(components).aqi}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-3 text-sm space-y-1">
                          {Object.entries(components).map(([key, value]) => {
                            const { label, range } = getPollutantLevel(key, value as number);
                            return (
                              <p key={key} className="border-b pb-1">
                                <strong>{key.toUpperCase()}</strong>: {value as number} µg/m³
                                <span className="block text-xs">
                                  {label} ({range})
                                </span>
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default AirQualityDashboard;