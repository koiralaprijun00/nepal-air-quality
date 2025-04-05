// src/app/city/[name]/page.tsx
'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import AqiTrendsChart from '../../components/AqiTrendsChart';
import { getPollutantLevel } from '../../../services/overallAqiUtils';
import { calculateOverallAqi, getAqiCategory } from '../../../services/AqiCalculator';
import { 
  MapPinIcon, 
  ChartBarIcon, 
  ClockIcon,
  CloudIcon,
  WindIcon
} from '@heroicons/react/24/outline';

interface CityData {
  name: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  sampleData: any[];
}

const CityDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const cityName = params?.name as string;
  
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // Set current date and time
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
    setCurrentTime(now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    }));

    const fetchCityData = async () => {
      try {
        setLoading(true);
        
        // Fetch all cities data
        const response = await fetch('/api/data-points');
        if (!response.ok) throw new Error('Failed to fetch air quality data');
        
        const allCitiesData = await response.json();
        
        // Find the matching city
        const decodedCityName = decodeURIComponent(cityName);
        const city = allCitiesData.find((city: CityData) => 
          city.name.toLowerCase() === decodedCityName.toLowerCase()
        );
        
        if (!city) {
          throw new Error(`City "${decodedCityName}" not found`);
        }
        
        setCityData(city);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (cityName) {
      fetchCityData();
    }
  }, [cityName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center py-6">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg text-gray-600">Loading city details...</p>
        </div>
      </div>
    );
  }

  if (error || !cityData) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => router.push('/')} 
            className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            &larr; Back to Dashboard
          </button>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">City Not Found</h2>
            <p className="text-gray-600 mb-4">{error || 'The requested city could not be located.'}</p>
            <Link 
              href="/" 
              className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sample = cityData.sampleData?.[0];
  const components = sample?.components || {};
  const { aqi, dominantPollutant } = calculateOverallAqi(components);
  const category = getAqiCategory(aqi);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="container mx-auto px-4 pt-8">
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-blue-800">Nepal Air Quality</h1>
            <p className="mt-1 text-gray-600">{currentDate} • {currentTime}</p>
          </div>
          <div className="flex space-x-4">
            <Link 
              href="/about" 
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
            >
              About Air Quality
            </Link>
            <Link 
              href="/blog" 
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
            >
              Health Guidelines
            </Link>
          </div>
        </div>

        {/* City Overview */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Left Column - City Details */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">{cityName}</h2>
            <p className="text-sm mb-4 text-gray-600">Current Air Quality</p>

            <div className="flex items-center space-x-4 mb-4">
              <div 
                className={`w-24 h-24 flex items-center justify-center rounded-lg text-5xl font-bold 
                  ${category.color} text-white`}
              >
                {aqi}
              </div>
              <div>
                <p className="text-2xl font-semibold text-blue-800">{category.label}</p>
                <p className="text-sm text-gray-600">US EPA Air Quality Index</p>
              </div>
            </div>

            <div>
              <p className="font-medium text-gray-700">Health Recommendation:</p>
              <p className="text-gray-600">{category.description}</p>
              <Link 
                href="#detailed-report" 
                className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800 transition"
              >
                View detailed report →
              </Link>
            </div>
          </div>

          {/* Right Column - Additional Information */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            {/* Key Pollutants */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-800">Key Pollutants</h3>
              {Object.entries(components)
                .filter(([key]) => ['co', 'no2', 'no', 'pm2_5', 'pm10'].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center border-b border-gray-200 py-2 last:border-b-0">
                    <span className="uppercase text-gray-700">
                      {key === 'pm2_5' ? 'PM2.5' : 
                       key === 'pm10' ? 'PM10' : 
                       key.toUpperCase()}
                    </span>
                    <span className="text-blue-700">{(value as number).toFixed(1)} µg/m³</span>
                  </div>
                ))
              }
            </div>

            {/* Nearby Weather */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-800">Nearby Weather</h3>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 text-gray-700">
                  <CloudIcon className="h-6 w-6 text-blue-500" />
                  <span>Partly Cloudy</span>
                </div>
                <span className="text-xl font-medium text-blue-700">25°C</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Report Section */}
        <div id="detailed-report" className="bg-white rounded-lg p-6 shadow-md border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-blue-800">Detailed Air Quality Report</h2>
          
          {/* Trends Chart */}
          <div className="mb-6">
            <AqiTrendsChart 
              lat={cityData.coordinates.lat} 
              lon={cityData.coordinates.lon} 
              cityName={cityName} 
            />
          </div>

          {/* Detailed Pollutant Breakdown */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-800">Comprehensive Pollutant Analysis</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(components).map(([key, value]) => {
                const { label, range } = getPollutantLevel(key, value as number);
                return (
                  <div 
                    key={key} 
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-blue-800">
                        {key === 'pm2_5' ? 'PM2.5' : 
                         key === 'pm10' ? 'PM10' : 
                         key === 'o3' ? 'Ozone' : 
                         key === 'no2' ? 'NO₂' : 
                         key === 'so2' ? 'SO₂' : 
                         key === 'co' ? 'CO' : key.toUpperCase()}
                      </h4>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium
                          ${label === 'Good' ? 'bg-green-100 text-green-800' :
                            label === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                            label === 'Moderate' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'}
                        `}
                      >
                        {label}
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-2xl font-bold text-blue-700">{(value as number).toFixed(2)}</span>
                      <span className="text-sm text-gray-600">µg/m³</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{range}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityDetailsPage;