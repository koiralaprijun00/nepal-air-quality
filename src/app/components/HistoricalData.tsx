// components/HistoricalData.tsx

import React from 'react';
import { getAqiCategory, getAqiColor } from '../../services/airQualityService';

interface HistoricalDataProps {
  data: {
    date: string;
    air_quality: number;
    co_surface: number;
    pm10: number;
    pm25: number;
    so2_surface: number;
    no2_surface?: number;
    o3_surface?: number;
    nh3_surface?: number;
  }[];
}

// Helper to format date strings
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const HistoricalData: React.FC<HistoricalDataProps> = ({ data }) => {
  // Make sure data is valid and has entries
  const validData = Array.isArray(data) && data.length > 0;
  
  // Process data only if it's valid
  const sortedData = validData ? 
    [...data]
      .filter(item => 
        item && 
        item.date && 
        typeof item.air_quality !== 'undefined'
      )
      .sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, 10) // Show only the latest 10 records for readability
    : [];

  return (
    <div className="p-4 bg-white shadow-md rounded-md overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Historical Air Quality Data</h2>
      
      {sortedData.length > 0 ? (
        <>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Date & Time</th>
                <th className="px-4 py-2 text-left">Air Quality</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-right">CO (μg/m³)</th>
                <th className="px-4 py-2 text-right">PM10 (μg/m³)</th>
                <th className="px-4 py-2 text-right">PM2.5 (μg/m³)</th>
                <th className="px-4 py-2 text-right">SO₂ (μg/m³)</th>
                <th className="px-4 py-2 text-right">NO₂ (μg/m³)</th>
                <th className="px-4 py-2 text-right">O₃ (μg/m³)</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="px-4 py-2">{formatDate(item.date)}</td>
                  <td className="px-4 py-2">
                    <span 
                      className="inline-block w-8 h-8 rounded-full text-white text-center leading-8 font-bold"
                      style={{ backgroundColor: getAqiColor(item.air_quality) }}
                    >
                      {item.air_quality}
                    </span>
                  </td>
                  <td className="px-4 py-2">{getAqiCategory(item.air_quality)}</td>
                  <td className="px-4 py-2 text-right">{(item.co_surface || 0).toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">{(item.pm10 || 0).toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">{(item.pm25 || 0).toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">{(item.so2_surface || 0).toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">{item.no2_surface ? item.no2_surface.toFixed(2) : '-'}</td>
                  <td className="px-4 py-2 text-right">{item.o3_surface ? item.o3_surface.toFixed(2) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 text-sm text-gray-500">
            <p>Data source: OpenWeather Air Pollution API</p>
            <p>AQI Scale: 1 (Good) to 5 (Very Poor) based on OpenWeather's Air Quality Index</p>
          </div>
        </>
      ) : (
        <div className="py-8 text-center">
          <p className="text-gray-500">No historical data available</p>
          <p className="text-sm text-gray-400 mt-2">This could be due to API limitations or data unavailability for this location</p>
        </div>
      )}
    </div>
  );
};

export default HistoricalData;