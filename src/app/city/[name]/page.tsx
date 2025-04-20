// src/app/city/[name]/page.tsx
'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  ChartBarIcon,
  ShareIcon,
  BookmarkIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
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
  hourlyForecast?: Array<{
    dt: number;
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    description: string;
    icon: string;
  }>;
  dailyForecast?: Array<{
    dt: number;
    temp: {
      day: number;
      min: number;
      max: number;
    };
    humidity: number;
    wind_speed: number;
    description: string;
    icon: string;
  }>;
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
  const [allCities, setAllCities] = useState<Array<{name: string; coordinates: {lat: number; lon: number}}>>([]);
  const [trend, setTrend] = useState<'rising' | 'declining' | 'stable' | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'forecast'>('overview');
  const [showAqiInfo, setShowAqiInfo] = useState(false);

  // Function to calculate AQI trend
  const calculateAqiTrend = (sampleData: CityData['sampleData']) => {
    if (!sampleData || sampleData.length < 2) return 'stable';

    // Get the two most recent measurements
    const latestSample = sampleData[0];
    const previousSample = sampleData[1];

    if (!latestSample?.components || !previousSample?.components) return 'stable';

    // Calculate AQI for both samples
    const currentAqi = calculateOverallAqi(latestSample.components).aqi;
    const previousAqi = calculateOverallAqi(previousSample.components).aqi;

    // Calculate the difference
    const difference = currentAqi - previousAqi;
    
    // Define a threshold for significant change (e.g., 5 AQI points)
    const THRESHOLD = 5;

    if (difference > THRESHOLD) {
      return 'rising';
    } else if (difference < -THRESHOLD) {
      return 'declining';
    } else {
      return 'stable';
    }
  };

  // Function to format time from now
  const formatTimeFromNow = (timestamp: number) => {
    const now = new Date();
    const date = new Date(timestamp * 1000);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else {
      const diffHours = Math.floor(diffMins / 60);
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
  };

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

        // Calculate and set the actual trend based on sample data
        const calculatedTrend = calculateAqiTrend(city.sampleData);
        setTrend(calculatedTrend);

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

  // Mock function for sharing (would be implemented with actual share API)
  const handleShare = () => {
    alert(`Sharing air quality information for ${cityName}`);
    // Would implement actual Web Share API here
  };

  // Mock function for bookmarking
  const handleBookmark = () => {
    alert(`${cityName} has been added to your bookmarks`);
    // Would implement actual bookmark functionality here
  };

  // Loading state with skeleton UI
  if (loading) {
    return (
      <div className="min-h-screen bg-white px-4 py-8">
        <div className="max-w-7xl mx-auto">
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
        <div className="max-w-7xl mx-auto">
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

  // Function to get background color based on AQI
  const getAqiBgColor = (aqi: number) => {
    return aqi <= 50 ? 'bg-green-500/90' :
           aqi <= 100 ? 'bg-yellow-400/90' :
           aqi <= 150 ? 'bg-orange-400/90' :
           aqi <= 200 ? 'bg-red-500/90' :
           aqi <= 300 ? 'bg-purple-600/90' :
           'bg-red-900/90';
  };

  // Function to get AQI gauge fill percentage
  const getAqiGaugeFill = (aqi: number) => {
    // Cap at 500 for the gauge
    const capped = Math.min(aqi, 500);
    return (capped / 500) * 100;
  };


  // Render the detail tabs
  const renderTabs = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-6">
        <div className="border-b border-gray-100">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap focus:outline-none ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap focus:outline-none ${
                activeTab === 'details'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pollutant Details
            </button>
            <button
              onClick={() => setActiveTab('forecast')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap focus:outline-none ${
                activeTab === 'forecast'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Weather Forecast
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* AQI Trends Chart */}
                <div className="lg:col-span-8 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ChartBarIcon className="h-5 w-5 text-blue-500 mr-2" />
                        <h3 className="font-medium text-gray-800">Air Quality Trends</h3>
                      </div>
                      <button className="text-sm text-blue-500 hover:text-blue-700">
                        View Details
                      </button>
                    </div>
                  </div>
                  <div className="p-4" style={{ height: '500px' }}>
                    <AqiTrendsChart
                      lat={cityData.coordinates.lat}
                      lon={cityData.coordinates.lon}
                      cityName={cityName}
                    />
                  </div>
                </div>

                {/* Top Pollutants */}
                <div className="lg:col-span-4 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center">
                      <ExclamationCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
                      <h3 className="font-medium text-gray-800">Top Pollutants</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {Object.entries(components)
                        .sort(([, aVal], [, bVal]) => (bVal as number) - (aVal as number))
                        .slice(0, 3)
                        .map(([key, value]) => {
                          const pollutantValue = value as number;
                          const { label } = getPollutantLevel(key, pollutantValue);
                          
                          // Determine colors based on pollutant level
                          let indicatorColor = "bg-green-400";
                          let textColor = "text-green-600";
                          
                          if (label === 'Moderate' || label === 'Fair') {
                            indicatorColor = "bg-yellow-400";
                            textColor = "text-yellow-600";
                          } else if (label === 'Poor') {
                            indicatorColor = "bg-orange-400";
                            textColor = "text-orange-600";
                          } else if (label === 'Very Poor') {
                            indicatorColor = "bg-red-400";
                            textColor = "text-red-600";
                          }
                          
                          return (
                            <div key={key} className="border border-gray-100 rounded-lg p-4">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <div className={`w-3 h-3 ${indicatorColor} rounded-full mr-2`}></div>
                                  <span className="font-medium text-gray-800">
                                    {key === 'pm2_5' ? 'PM2.5' : 
                                     key === 'pm10' ? 'PM10' : 
                                     key === 'o3' ? 'Ozone (O₃)' : 
                                     key === 'no2' ? 'Nitrogen Dioxide (NO₂)' : 
                                     key === 'so2' ? 'Sulfur Dioxide (SO₂)' : 
                                     key === 'co' ? 'Carbon Monoxide (CO)' : key}
                                  </span>
                                </div>
                                <span className={`text-sm font-medium ${textColor}`}>
                                  {label}
                                </span>
                              </div>
                              
                              <div className="mt-2 bg-gray-100 rounded-full h-2.5">
                                <div 
                                  className={`h-2.5 rounded-full ${indicatorColor}`} 
                                  style={{ 
                                    width: `${Math.min(pollutantValue / (key === 'pm2_5' ? 150 : key === 'pm10' ? 300 : 400) * 100, 100)}%` 
                                  }}
                                ></div>
                              </div>
                              
                              <div className="flex justify-between mt-1">
                                <span className="text-xs text-gray-500">0</span>
                                <div className="flex items-center">
                                  <span className="text-sm font-semibold">{pollutantValue.toFixed(1)}</span>
                                  <span className="text-xs text-gray-500 ml-1">µg/m³</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
              
             
            
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Detailed Pollutant Analysis */}
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
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'forecast' && (
            <div className="space-y-6">
              {/* Current Weather Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Current Weather */}
                  <div className="bg-blue-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">Current Weather</h3>
                        <p className="text-gray-600">{sample.weather.description}</p>
                      </div>
                      <img 
                        src={`https://openweathermap.org/img/wn/${sample.weather.icon}@2x.png`} 
                        alt="Weather icon"
                        className="w-16 h-16"
                      />
                    </div>
                    <div className="text-4xl font-bold text-gray-800">
                      {Math.round(sample.weather.temp)}°C
                    </div>
                    <div className="text-gray-600 mt-2">
                      Feels like: {Math.round(sample.weather.feels_like)}°C
                    </div>
                  </div>

                  {/* Weather Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <div className="text-sm text-gray-500 mb-1">Humidity</div>
                      <div className="text-xl font-semibold">{sample.weather.humidity}%</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <div className="text-sm text-gray-500 mb-1">Wind Speed</div>
                      <div className="text-xl font-semibold">{sample.weather.wind_speed} m/s</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <div className="text-sm text-gray-500 mb-1">Pressure</div>
                      <div className="text-xl font-semibold">{sample.weather.pressure} hPa</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hourly Forecast */}
              {cityData.hourlyForecast && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Hourly Forecast</h3>
                  <div className="overflow-x-auto">
                    <div className="flex space-x-4 min-w-max">
                      {cityData.hourlyForecast.slice(0, 24).map((hour, index) => (
                        <div key={index} className="flex flex-col items-center p-4 bg-blue-50 rounded-xl min-w-[100px]">
                          <div className="text-sm font-medium text-gray-600">
                            {new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit' })}
                          </div>
                          <img 
                            src={`https://openweathermap.org/img/wn/${hour.icon}@2x.png`} 
                            alt="Weather icon"
                            className="w-12 h-12 my-2"
                          />
                          <div className="text-lg font-semibold text-gray-800">
                            {Math.round(hour.temp)}°C
                          </div>
                          <div className="text-xs text-gray-500">
                            {hour.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section with improved layout */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Top Navigation Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition mb-4 md:mb-0 hover:underline"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            
            {/* Search Bar */}
            <div className="w-full md:w-80">
              <SearchBar 
                placeholder="Search another city..." 
                onSearch={handleSearch}
                cities={allCities}
                autoNavigate={true}
                className="w-full shadow-sm"
              />
            </div>
          </div>
          
          {/* City Information with improved balance */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPinIcon className="h-6 w-6 mr-2 flex-shrink-0 text-gray-800" />
                <h1 className="text-2xl md:text-4xl font-bold truncate text-gray-800">{cityName}</h1>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center text-gray-800 mt-1">
              <span className="mr-3 mb-1">{currentDate}</span>
              <span className="mr-3 mb-1">•</span>
              <span className="mr-3 mb-1">{currentTime}</span>
              <span className="mr-3 mb-1">•</span>
              <span className="mb-1">
                {cityData.coordinates.lat.toFixed(2)}°N, {cityData.coordinates.lon.toFixed(2)}°E
              </span>
            </div>
          </div>
          
          {/* AQI Banner with Balanced Layout */}
          <div className={`rounded-xl overflow-hidden transition-colors duration-500 ${getAqiBgColor(aqi)} w-[55%]`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
              {/* Left Column: AQI Metric and Gauge */}
              <div className="flex items-center justify-center md:justify-start">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center space-x-4 w-[350px]">
                  <div className="flex justify-between items-start w-full">
                    <div>
                      <div className="text-4xl md:text-5xl font-bold text-white">{aqi}</div>
                      <div className="text-lg font-medium mt-1 text-white">{category.label}</div>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-sm font-medium text-white">
                        {trend === 'rising' ? 'Rising' : 
                         trend === 'declining' ? 'Declining' : 
                         'Stable'}
                      </span>
                      {trend === 'rising' ? (
                        <svg className="w-4 h-4 ml-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      ) : trend === 'declining' ? (
                        <svg className="w-4 h-4 ml-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 ml-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Middle Column: Health Advisory */}
              <div className="md:col-span-2">
                <div className="h-full flex flex-col justify-center">
                  <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">Health Advisory</h3>
                  <p className="text-white/90 leading-relaxed">{category.description}</p>
                  
                  <button 
                    onClick={() => setShowAqiInfo(!showAqiInfo)}
                    className="mt-2 text-white/80 text-sm hover:text-white flex items-center w-max"
                  >
                    <InformationCircleIcon className="h-4 w-4 mr-1" />
                    {showAqiInfo ? 'Hide AQI information' : 'What is AQI?'}
                  </button>
                  
                  {showAqiInfo && (
                    <div className="mt-2 p-3 bg-white/20 backdrop-blur-sm rounded-lg text-white/90 text-sm">
                      <p>Air Quality Index (AQI) is a measure used to communicate how polluted the air is. The higher the AQI value, the greater the level of air pollution and potential health concerns.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Key Stats Row - Balanced layout under the AQI banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {/* Weather Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
              <div className="flex items-center space-x-3">
                <img 
                  src={`https://openweathermap.org/img/wn/${sample.weather.icon}@2x.png`}
                  alt="Weather icon"
                  className="w-12 h-12"
                />
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {Math.round(sample.weather.temp)}°C
                  </div>
                  <div className="text-sm text-gray-500 capitalize">
                    {sample.weather.description}
                  </div>
                  <div className="text-xs text-gray-500">
                    Feels like: {Math.round(sample.weather.feels_like)}°C
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
              <div className="text-sm text-gray-500 mb-1 flex items-center">
                <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Dominant Pollutant
              </div>
              <div className="text-base font-semibold">
                {dominantPollutant === 'pm2_5' ? 'PM2.5' : 
                 dominantPollutant === 'pm10' ? 'PM10' : 
                 dominantPollutant === 'o3' ? 'Ozone' : 
                 dominantPollutant === 'no2' ? 'NO₂' : 
                 dominantPollutant === 'so2' ? 'SO₂' : 
                 dominantPollutant === 'co' ? 'CO' : dominantPollutant}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
              <div className="text-sm text-gray-500 mb-1 flex items-center">
                <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                Humidity
              </div>
              <div className="text-base font-semibold">
                {sample.weather.humidity}%
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
              <div className="text-sm text-gray-500 mb-1 flex items-center">
                <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Wind Speed
              </div>
              <div className="text-base font-semibold">
                {sample.weather.wind_speed} m/s
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tab Interface */}
            {renderTabs()}
          </div>
        )}
      </div>
    </div>
  );
};

export default CityDetailsPage;