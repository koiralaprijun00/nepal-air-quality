// src/app/city/[name]/page.tsx
'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AqiTrendsChart from '../../components/AqiTrendsChart';
import { getPollutantLevel } from '../../../services/overallAqiUtils';
import { calculateOverallAqi, getAqiCategory } from '../../../services/AqiCalculator';
import { 
  MapPinIcon, 
  ChartBarIcon, 
  InformationCircleIcon,
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
  const [activeSection, setActiveSection] = useState<'overview' | 'trends'>('overview');

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/api/data-points');
        if (!response.ok) throw new Error('Failed to fetch air quality data');
        
        const allCitiesData = await response.json();
        
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
            ← Back to Dashboard
          </button>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-red-700 mb-4">City Not Found</h2>
            <p className="text-red-600 mb-4">{error || 'The requested city could not be located.'}</p>
            <Link 
              href="/" 
              className="inline-block px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <MapPinIcon className="h-8 w-8" />
                <h1 className="text-3xl md:text-4xl font-bold">{cityName}</h1>
              </div>
              <p className="mt-2 text-blue-100 flex items-center space-x-2">
                <span>Lat: {cityData.coordinates.lat.toFixed(4)}°</span>
                <span>Lon: {cityData.coordinates.lon.toFixed(4)}°</span>
              </p>
            </div>
            <Link 
              href="/" 
              className="hidden md:flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 mt-6">
        <div className="flex border-b mb-6">
          {['overview', 'trends'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section as 'overview' | 'trends')}
              className={`
                px-4 py-2 capitalize 
                ${activeSection === section 
                  ? 'border-b-2 border-blue-500 text-blue-600 font-semibold' 
                  : 'text-gray-600 hover:text-gray-900'}
              `}
            >
              {section}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {activeSection === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* AQI Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center">
                  <InformationCircleIcon className="h-6 w-6 mr-2 text-blue-500" />
                  Air Quality Overview
                </h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
                  {category.label}
                </span>
              </div>
              
              <div className="text-center">
                <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold ${category.color}`}>
                  {aqi}
                </div>
                <p className="mt-2 text-gray-600">US EPA Air Quality Index</p>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-700">{category.description}</p>
              </div>
            </div>

            {/* Pollutant Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold flex items-center mb-4">
                <ChartBarIcon className="h-6 w-6 mr-2 text-blue-500" />
                Pollutant Levels
              </h2>
              
              <div className="space-y-3">
                {Object.entries(components).map(([key, value]) => {
                  const { label, range } = getPollutantLevel(key, value as number);
                  return (
                    <div key={key} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                      <div>
                        <div className="font-medium">
                          {key === 'pm2_5' ? 'PM2.5' : 
                           key === 'pm10' ? 'PM10' : 
                           key === 'o3' ? 'Ozone' : 
                           key === 'no2' ? 'NO₂' : 
                           key === 'so2' ? 'SO₂' : 
                           key === 'co' ? 'CO' : key}
                        </div>
                        <div className="text-sm text-gray-500">{range}</div>
                      </div>
                      <div>
                        <span className="font-semibold">{(value as number).toFixed(2)} µg/m³</span>
                        <span className={`
                          ml-2 px-2 py-1 rounded-full text-xs font-medium
                          ${label === 'Good' ? 'bg-green-100 text-green-800' :
                            label === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                            label === 'Moderate' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'}
                        `}>
                          {label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'trends' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <AqiTrendsChart 
              lat={cityData.coordinates.lat} 
              lon={cityData.coordinates.lon} 
              cityName={cityName} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CityDetailsPage;