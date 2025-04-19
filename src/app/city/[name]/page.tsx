// src/app/city/[name]/page.tsx
'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import AqiTrendsChart from '../../components/AqiTrendsChart';
import SearchBar from '../../components/SearchBar';
import { getPollutantLevel } from '../../../services/overallAqiUtils';
import { calculateOverallAqi, getAqiCategory } from '../../../services/AqiCalculator';
import { 
  CloudIcon,
  ArrowLeftIcon,
  InformationCircleIcon,
  MapPinIcon,
  ChartBarIcon
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
  const [activeTab, setActiveTab] = useState('overview');
  const [allCities, setAllCities] = useState<Array<{name: string; coordinates: {lat: number; lon: number}}>>([]);

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
        
        // Store all cities for search functionality
        setAllCities(allCitiesData.map((city: CityData) => ({
          name: city.name,
          coordinates: city.coordinates
        })));
        
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

  // Handle search navigation
  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/city/${encodeURIComponent(query.toLowerCase())}`);
    }
  };

  // Loading state with skeleton UI
  if (loading) {
    return (
      <div className="min-h-screen bg-white px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-40 bg-gray-200 rounded mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-2xl mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-80 bg-gray-200 rounded-2xl"></div>
              <div className="h-80 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !cityData) {
    return (
      <div className="min-h-screen bg-white px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition mb-8"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full text-red-500 mb-4">
              <InformationCircleIcon className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">City Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The requested city could not be located.'}</p>
            <Link 
              href="/" 
              className="inline-flex items-center justify-center px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
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
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-b border-blue-100">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition mb-4 md:mb-0"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            
            {/* Add SearchBar component here */}
            <div className="w-full md:w-80">
              <SearchBar 
                placeholder="Search another city..." 
                onSearch={handleSearch}
                cities={allCities}
                autoNavigate={true}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center mb-2">
                <MapPinIcon className="h-6 w-6 text-blue-500 mr-2" />
                <h1 className="text-3xl font-bold text-gray-800">{cityName}</h1>
              </div>
              <p className="text-gray-500 mb-6">
                {currentDate} • {currentTime} • 
                <span className="ml-1">
                  {cityData.coordinates.lat.toFixed(4)}°N, {cityData.coordinates.lon.toFixed(4)}°E
                </span>
              </p>
              
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-20 h-20 flex items-center justify-center rounded-xl text-3xl font-bold ${category.color} shadow-sm`}>
                    {aqi}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{category.label}</h2>
                    <p className="text-gray-500">Air Quality Index (US EPA)</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h3 className="font-medium text-gray-700 mb-2">Health Recommendation:</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 w-full md:w-80 md:ml-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Current Conditions</h3>
              
              {/* Weather */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center text-gray-700">
                    <CloudIcon className="h-6 w-6 text-blue-400 mr-2" />
                    <span>Partly Cloudy</span>
                  </div>
                  <span className="text-xl font-medium">25°C</span>
                </div>
              </div>
              
              {/* Dominant Pollutant */}
              {dominantPollutant && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <p className="text-sm text-gray-600 mb-1">Primary Pollutant</p>
                  <p className="font-medium text-gray-800">
                    {dominantPollutant === 'pm2_5' ? 'PM2.5' : 
                    dominantPollutant === 'pm10' ? 'PM10' : 
                    dominantPollutant === 'o3' ? 'Ozone (O₃)' : 
                    dominantPollutant === 'no2' ? 'Nitrogen Dioxide (NO₂)' : 
                    dominantPollutant === 'so2' ? 'Sulfur Dioxide (SO₂)' : 
                    dominantPollutant === 'co' ? 'Carbon Monoxide (CO)' : 
                    dominantPollutant}
                  </p>
                </div>
              )}
              
              {/* Key Pollutants */}
              <h4 className="font-medium text-gray-700 mb-2 mt-4">Top Pollutants</h4>
              <div className="space-y-2">
                {Object.entries(components)
                  .filter(([key]) => ['pm2_5', 'pm10', 'no2'].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">
                        {key === 'pm2_5' ? 'PM2.5' : 
                         key === 'pm10' ? 'PM10' : 
                         key === 'o3' ? 'Ozone' : 
                         key === 'no2' ? 'NO₂' : 
                         key === 'so2' ? 'SO₂' : 
                         key === 'co' ? 'CO' : key}
                      </span>
                      <span className="text-gray-800 font-medium">{(value as number).toFixed(1)}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-medium text-sm border-b-2 ${
                activeTab === 'overview' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('trends')}
              className={`px-4 py-2 font-medium text-sm border-b-2 ${
                activeTab === 'trends' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Historical Trends
            </button>
            <button 
              onClick={() => setActiveTab('health')}
              className={`px-4 py-2 font-medium text-sm border-b-2 ${
                activeTab === 'health' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Health Impact
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && (
            <div>
              {/* Air Quality Trends Chart */}
              <div className="mb-10">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center">
                      <ChartBarIcon className="h-5 w-5 text-blue-500 mr-2" />
                      <h2 className="text-xl font-bold text-gray-800">Air Quality Trends</h2>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">Historical data for the past 5 days</p>
                  </div>
                  
                  <div className="p-4">
                    <AqiTrendsChart 
                      lat={cityData.coordinates.lat} 
                      lon={cityData.coordinates.lon} 
                      cityName={cityName} 
                    />
                  </div>
                </div>
              </div>
              
              {/* Detailed Pollutant Analysis */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Pollutant Analysis</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(components).map(([key, value]) => {
                    const { label, range } = getPollutantLevel(key, value as number);
                    
                    // Determine colors based on pollutant level
                    let bgColor = 'bg-green-50';
                    let borderColor = 'border-green-100';
                    let textColor = 'text-green-800';
                    
                    if (label === 'Moderate' || label === 'Fair') {
                      bgColor = 'bg-yellow-50';
                      borderColor = 'border-yellow-100';
                      textColor = 'text-yellow-800';
                    } else if (label === 'Poor') {
                      bgColor = 'bg-orange-50';
                      borderColor = 'border-orange-100';
                      textColor = 'text-orange-800';
                    } else if (label === 'Very Poor') {
                      bgColor = 'bg-red-50';
                      borderColor = 'border-red-100';
                      textColor = 'text-red-800';
                    }
                    
                    return (
                      <div 
                        key={key} 
                        className={`rounded-xl overflow-hidden border shadow-sm ${borderColor}`}
                      >
                        <div className={`px-4 py-3 border-b ${borderColor} flex justify-between items-center ${bgColor}`}>
                          <h3 className="font-medium text-gray-800">
                            {key === 'pm2_5' ? 'PM2.5' : 
                             key === 'pm10' ? 'PM10' : 
                             key === 'o3' ? 'Ozone (O₃)' : 
                             key === 'no2' ? 'Nitrogen Dioxide (NO₂)' : 
                             key === 'so2' ? 'Sulfur Dioxide (SO₂)' : 
                             key === 'co' ? 'Carbon Monoxide (CO)' : key.toUpperCase()}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${textColor} bg-white/50`}>
                            {label}
                          </span>
                        </div>
                        
                        <div className="p-4 bg-white">
                          <div className="flex justify-between items-baseline mb-2">
                            <span className="text-3xl font-bold text-gray-800">{(value as number).toFixed(1)}</span>
                            <span className="text-gray-500">µg/m³</span>
                          </div>
                          
                          <div className="text-xs text-gray-500 mt-1">{range}</div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Health Impact</h4>
                            <p className="text-sm text-gray-600">
                              {key === 'pm2_5' ? 'Can penetrate deep into lungs and bloodstream, causing respiratory and cardiovascular issues.' : 
                               key === 'pm10' ? 'Can cause respiratory issues and aggravate conditions like asthma and heart disease.' : 
                               key === 'o3' ? 'Can irritate respiratory system, reduce lung function and worsen asthma.' : 
                               key === 'no2' ? 'Can irritate airways and increase susceptibility to respiratory infections.' : 
                               key === 'so2' ? 'Can harm respiratory system and make breathing difficult.' : 
                               key === 'co' ? 'Reduces oxygen delivery to organs and can cause headaches and dizziness.' : 
                               'Can affect health depending on concentration levels.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'trends' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Historical Trends</h2>
              <p className="text-gray-600 mb-6">View long-term air quality trends for {cityName}.</p>
              
              <div className="h-96 bg-gray-50 flex items-center justify-center rounded-lg">
                <p className="text-gray-400">More detailed historical trend analysis would be displayed here.</p>
              </div>
            </div>
          )}
          
          {activeTab === 'health' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Health Impacts</h2>
              <p className="text-gray-600 mb-6">Information about how current air quality affects health in {cityName}.</p>
              
              <div className={`p-4 rounded-xl ${
                aqi <= 50 ? 'bg-green-50 border border-green-100' : 
                aqi <= 100 ? 'bg-yellow-50 border border-yellow-100' : 
                aqi <= 150 ? 'bg-orange-50 border border-orange-100' : 
                aqi <= 200 ? 'bg-red-50 border border-red-100' : 
                aqi <= 300 ? 'bg-purple-50 border border-purple-100' : 
                'bg-red-100 border border-red-200'
              }`}>
                <h3 className={`font-medium ${
                  aqi <= 50 ? 'text-green-800' : 
                  aqi <= 100 ? 'text-yellow-800' : 
                  aqi <= 150 ? 'text-orange-800' : 
                  aqi <= 200 ? 'text-red-800' : 
                  aqi <= 300 ? 'text-purple-800' : 
                  'text-red-900'
                }`}>
                  Current Status: {category.label} (AQI: {aqi})
                </h3>
                
                <p className="mt-2 text-gray-700">{category.description}</p>
                
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Recommended Actions:</h4>
                  <ul className="space-y-2">
                    {aqi <= 50 && (
                      <>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 mt-1.5"></span>
                          <span>No restrictions, enjoy outdoor activities</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 mt-1.5"></span>
                          <span>Perfect day for outdoor exercise</span>
                        </li>
                      </>
                    )}
                    
                    {aqi > 50 && aqi <= 100 && (
                      <>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-2 mt-1.5"></span>
                          <span>Unusually sensitive people should consider reducing prolonged outdoor exertion</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-2 mt-1.5"></span>
                          <span>People with respiratory or heart disease should monitor symptoms</span>
                        </li>
                      </>
                    )}
                    
                    {aqi > 100 && aqi <= 150 && (
                      <>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-2 mt-1.5"></span>
                          <span>Children, older adults, and people with respiratory or heart conditions should limit outdoor exposure</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-2 mt-1.5"></span>
                          <span>Everyone else should limit prolonged outdoor exertion</span>
                        </li>
                      </>
                    )}
                    
                    {aqi > 150 && aqi <= 200 && (
                      <>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2 mt-1.5"></span>
                          <span>Avoid prolonged outdoor activities</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2 mt-1.5"></span>
                          <span>Sensitive groups should stay indoors and keep activity levels low</span>
                        </li>
                      </>
                    )}
                    
                    {aqi > 200 && (
                      <>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2 mt-1.5"></span>
                          <span>Stay indoors and keep windows closed</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2 mt-1.5"></span>
                          <span>Avoid all outdoor physical activity</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2 mt-1.5"></span>
                          <span>Use air purifiers if available</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CityDetailsPage;