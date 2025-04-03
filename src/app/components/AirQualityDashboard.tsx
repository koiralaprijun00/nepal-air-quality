// src/app/components/AirQualityDashboard.tsx
'use client'

import React from 'react';
import { getAqiCategory, getAqiColor } from '../../services/airQualityService';

interface AirQualityDashboardProps {
  airQualityData: any;
  loading: boolean;
  error: string | null;
}

const AirQualityDashboard: React.FC<AirQualityDashboardProps> = ({ 
  airQualityData, 
  loading, 
  error 
}) => {
  // Debug data structure to help identify issues
  React.useEffect(() => {
    if (airQualityData) {
      console.log('Air Quality Data Structure in Component:', {
        hasCurrentData: !!airQualityData.current,
        currentType: typeof airQualityData.current,
        currentKeys: airQualityData.current ? Object.keys(airQualityData.current) : [],
        hasMainProperty: !!(airQualityData.current && airQualityData.current.main),
        hasAqiProperty: !!(airQualityData.current && airQualityData.current.main && 
                         airQualityData.current.main.aqi),
        hasComponents: !!(airQualityData.current && airQualityData.current.components),
        dataArrayLength: airQualityData.data?.length
      });
    }
  }, [airQualityData]);

  // Handle loading state
  if (loading) {
    return (
      <div className="text-center py-6 bg-white rounded-lg shadow">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
        <p>Loading air quality data...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p className="font-medium">Error Loading Data</p>
        <p className="text-sm">{error}</p>
        <p className="text-sm mt-2">Please check your API configuration and try again.</p>
      </div>
    );
  }

  // Handle missing data
  if (!airQualityData || !airQualityData.current) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
        <p className="font-medium">No Data Available</p>
        <p className="text-sm">We couldn't retrieve air quality data. This might be due to API rate limits or configuration issues.</p>
      </div>
    );
  }

  // Extract current AQI information safely with fallbacks
  const currentAqi = airQualityData.current.main?.aqi ?? null;
  
  // Handle components safely - OpenWeather returns them directly in the current object
  const currentComponents = airQualityData.current.components || {};

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          {currentAqi !== null ? (
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4"
              style={{ backgroundColor: getAqiColor(currentAqi) }}
            >
              {currentAqi}
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-200 text-gray-500 text-2xl font-bold mr-4">
              ?
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold">Current Air Quality</h2>
            <p className="text-lg font-medium text-gray-700">Kathmandu, Nepal</p>
            {currentAqi !== null ? (
              <p className="text-xl font-semibold" style={{ color: getAqiColor(currentAqi) }}>
                {getAqiCategory(currentAqi)}
              </p>
            ) : (
              <p className="text-xl font-semibold text-gray-500">Data unavailable</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="text-center bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-500 text-sm">PM2.5</p>
            <p className="font-bold text-lg">{(currentComponents.pm2_5 || 0).toFixed(1)}</p>
            <p className="text-xs text-gray-400">μg/m³</p>
          </div>
          <div className="text-center bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-500 text-sm">PM10</p>
            <p className="font-bold text-lg">{(currentComponents.pm10 || 0).toFixed(1)}</p>
            <p className="text-xs text-gray-400">μg/m³</p>
          </div>
          <div className="text-center bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-500 text-sm">O₃</p>
            <p className="font-bold text-lg">{(currentComponents.o3 || 0).toFixed(1)}</p>
            <p className="text-xs text-gray-400">μg/m³</p>
          </div>
          <div className="text-center bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-500 text-sm">NO₂</p>
            <p className="font-bold text-lg">{(currentComponents.no2 || 0).toFixed(1)}</p>
            <p className="text-xs text-gray-400">μg/m³</p>
          </div>
          <div className="text-center bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-500 text-sm">SO₂</p>
            <p className="font-bold text-lg">{(currentComponents.so2 || 0).toFixed(1)}</p>
            <p className="text-xs text-gray-400">μg/m³</p>
          </div>
          <div className="text-center bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-500 text-sm">CO</p>
            <p className="font-bold text-lg">{(currentComponents.co || 0).toFixed(1)}</p>
            <p className="text-xs text-gray-400">μg/m³</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirQualityDashboard;