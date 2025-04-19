'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { calculateOverallAqi, getAqiCategory } from '../../services/AqiCalculator';

interface CityData {
  name: string;
  sampleData?: {
    components: Record<string, number>;
  }[];
}

const HeroSection = ({ cityData, loading }: { cityData: CityData; loading: boolean }) => {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  
  useEffect(() => {
    const now = new Date();
    
    // Format date: April 5, 2025
    setCurrentDate(now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
    
    // Format time: 14:30
    setCurrentTime(now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    }));
  }, []);

  // Get sample air quality data if available
  const sampleData = cityData?.sampleData?.[0];
  const components = sampleData?.components || {};
  const aqiData = calculateOverallAqi(components);
  const category = getAqiCategory(aqiData.aqi);
  
  // Health recommendation based on AQI
  const getHealthRecommendation = (aqi: number) => {
    if (aqi <= 50) {
      return "Air quality is good. Enjoy outdoor activities!";
    } else if (aqi <= 100) {
      return "Air quality is moderate. Sensitive individuals should consider limiting prolonged outdoor exertion.";
    } else if (aqi <= 150) {
      return "Unhealthy for sensitive groups. Elderly, children, and those with respiratory issues should limit outdoor activity.";
    } else if (aqi <= 200) {
      return "Health alert: Everyone may experience health effects. Limit outdoor activities.";
    } else if (aqi <= 300) {
      return "Health warning: Everyone may experience more serious health effects. Avoid outdoor activities.";
    } else {
      return "Health emergency: Everyone should avoid all outdoor exertion.";
    }
  };

  return (
    <div className="relative bg-white text-gray-800 py-10 md:py-16 overflow-hidden shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Nepal Air Quality</h1>
          </div>
        
        {loading ? (
          <div className="mt-8 p-6 bg-gray-50 rounded-xl shadow-sm">
            <div className="flex items-center justify-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3"></div>
              <p className="text-lg text-gray-600">Loading latest air quality data...</p>
            </div>
          </div>
        ) : cityData ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 col-span-1 md:col-span-2">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="mb-4 md:mb-0 md:mr-6">
                  <h2 className="text-xl font-bold mb-1 text-gray-800">{cityData.name}</h2>
                  <p className="text-gray-500 text-sm">Current Air Quality</p>
                  
                  <div className="mt-4 flex items-center">
                    <div className={`w-16 h-16 flex items-center justify-center rounded-xl font-bold text-3xl ${category.color}`}>
                      {aqiData.aqi}
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-lg text-gray-800">{category.label}</p>
                      <p className="text-sm text-gray-500">US EPA Air Quality Index</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 mt-4 md:mt-0">
                  <h3 className="font-medium mb-2 text-gray-700">Health Recommendation:</h3>
                  <p className="text-gray-600">{getHealthRecommendation(aqiData.aqi)}</p>
                  
                  <div className="mt-4">
                    <Link 
                      href={`/city/${encodeURIComponent(cityData.name.toLowerCase())}`}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors"
                    >
                      <span>View detailed report</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-3 text-gray-800">Key Pollutants</h3>
              <div className="space-y-3">
                {Object.entries(components).slice(0, 3).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {key === 'pm2_5' ? 'PM2.5' : 
                       key === 'pm10' ? 'PM10' : 
                       key === 'o3' ? 'Ozone' : 
                       key === 'no2' ? 'NO₂' : 
                       key === 'so2' ? 'SO₂' : 
                       key === 'co' ? 'CO' : key}:
                    </span>
                    <span className="font-medium text-gray-800">{Number(value).toFixed(1)} µg/m³</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h3 className="font-semibold mb-2 text-gray-800">Nearby Weather</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                    <span className="text-gray-600">Partly Cloudy</span>
                  </div>
                  <span className="font-medium text-gray-800">25°C</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 p-6 bg-gray-50 rounded-xl shadow-sm text-gray-600">
            <p className="text-center">No data available for the selected location. Please try another city.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;