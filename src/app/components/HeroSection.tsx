'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { calculateOverallAqi, getAqiCategory } from '../../services/AqiCalculator';

interface HeroSectionProps {
  cityData?: {
    name: string;
    coordinates: {
      lat: number;
      lon: number;
    };
    sampleData: any[];
  };
  loading: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ cityData, loading }) => {
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  
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
    <div className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white py-10 md:py-16 overflow-hidden">
      {/* Background mountains silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 opacity-10">
        <svg viewBox="0 0 1000 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,100 L80,70 L160,120 L240,40 L320,80 L400,10 L480,90 L560,60 L640,30 L720,70 L800,40 L880,60 L960,20 L1000,50 L1000,200 L0,200 Z" fill="white" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">Nepal Air Quality</h1>
            <p className="mt-2 text-blue-100">{currentDate} • {currentTime}</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-3">
            <Link href="/about" className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors">
              About Air Quality
            </Link>
            <Link href="/blog" className="bg-blue-700 text-white hover:bg-blue-800 px-4 py-2 rounded-lg font-medium border border-blue-500 transition-colors">
              Health Guidelines
            </Link>
          </div>
        </div>
        
        {loading ? (
          <div className="mt-8 p-6 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl">
            <div className="flex items-center justify-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mr-3"></div>
              <p className="text-lg">Loading latest air quality data...</p>
            </div>
          </div>
        ) : cityData ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl col-span-1 md:col-span-2">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="mb-4 md:mb-0 md:mr-6">
                  <h2 className="text-xl font-bold mb-1">{cityData.name}</h2>
                  <p className="text-blue-100 text-sm">Current Air Quality</p>
                  
                  <div className="mt-4 flex items-center">
                    <div className={`w-16 h-16 flex items-center justify-center rounded-xl font-bold text-3xl ${category.color}`}>
                      {aqiData.aqi}
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-lg">{category.label}</p>
                      <p className="text-sm text-blue-100">US EPA Air Quality Index</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 mt-4 md:mt-0">
                  <h3 className="font-medium mb-2">Health Recommendation:</h3>
                  <p className="text-blue-50">{getHealthRecommendation(aqiData.aqi)}</p>
                  
                  <div className="mt-4">
                    <Link 
                      href={`/city/${encodeURIComponent(cityData.name.toLowerCase())}`}
                      className="text-white hover:text-blue-200 font-medium flex items-center transition-colors"
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
            
            <div className="p-6 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl">
              <h3 className="font-semibold mb-3">Key Pollutants</h3>
              <div className="space-y-3">
                {Object.entries(components).slice(0, 3).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-blue-100">
                      {key === 'pm2_5' ? 'PM2.5' : 
                       key === 'pm10' ? 'PM10' : 
                       key === 'o3' ? 'Ozone' : 
                       key === 'no2' ? 'NO₂' : 
                       key === 'so2' ? 'SO₂' : 
                       key === 'co' ? 'CO' : key}:
                    </span>
                    <span className="font-medium">{Number(value).toFixed(1)} µg/m³</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-white border-opacity-20">
                <h3 className="font-semibold mb-2">Nearby Weather</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                    <span>Partly Cloudy</span>
                  </div>
                  <span className="font-medium">25°C</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 p-6 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl">
            <p className="text-center">No data available for the selected location. Please try another city.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;