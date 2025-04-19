'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { calculateOverallAqi, getAqiCategory } from '../../services/AqiCalculator';

interface CityData {
  name: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
  sampleData?: any[];
}

interface HeroSectionProps {
  cityData: CityData | null;
  loading: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ cityData, loading }) => {
  const [currentDate] = useState(new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }));
  
  const [currentTime] = useState(new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  }));

  // If no city data or loading, return a placeholder
  if (loading || !cityData) {
    return (
      <div className="relative h-[450px] w-full flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-40 bg-gray-300 rounded mb-4"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  // Get sample air quality data
  const sampleData = cityData.sampleData?.[0];
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
    <div className="relative h-[450px] w-full">
      {/* Overlay for city data */}
      <div className="absolute top-12 left-8 bg-white rounded-xl shadow-lg border border-gray-200 p-5 max-w-sm z-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{cityData.name}</h2>
        <p className="text-gray-500 text-sm">
          {currentDate} • {currentTime}
        </p>
        
        <div className="mt-4 flex items-center">
          <div className={`w-16 h-16 flex items-center justify-center rounded-xl font-bold text-3xl ${category.color}`}>
            {aqiData.aqi}
          </div>
          <div className="ml-4">
            <p className="font-semibold text-lg text-gray-800">{category.label}</p>
            <p className="text-sm text-gray-500">US EPA Air Quality Index</p>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="font-medium mb-1 text-gray-700">Health Recommendation:</h3>
          <p className="text-gray-600 text-sm">{getHealthRecommendation(aqiData.aqi)}</p>
        </div>
        
        <div className="mt-5">
          <Link 
            href={`/city/${encodeURIComponent(cityData.name.toLowerCase())}`}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition w-full"
          >
            View Detailed Report
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;