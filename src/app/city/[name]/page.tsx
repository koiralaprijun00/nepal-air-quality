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

  // Add weather tab content
  const renderWeatherDetails = () => {
    if (!cityData?.sampleData?.[0]?.weather) return null;

    const weather = cityData.sampleData[0].weather;
    
    return (
      <div className="space-y-6">
        {/* Current Weather Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Weather */}
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Current Weather</h3>
                  <p className="text-gray-600">{weather.description}</p>
                </div>
                <img 
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
                  alt="Weather icon"
                  className="w-16 h-16"
                />
              </div>
              <div className="text-4xl font-bold text-gray-800">
                {Math.round(weather.temp)}°C
              </div>
              <div className="text-gray-600 mt-2">
                Feels like: {Math.round(weather.feels_like)}°C
              </div>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="text-sm text-gray-500 mb-1">Humidity</div>
                <div className="text-xl font-semibold">{weather.humidity}%</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="text-sm text-gray-500 mb-1">Wind Speed</div>
                <div className="text-xl font-semibold">{weather.wind_speed} m/s</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="text-sm text-gray-500 mb-1">Pressure</div>
                <div className="text-xl font-semibold">{weather.pressure} hPa</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="text-sm text-gray-500 mb-1">Last Updated</div>
                <div className="text-sm font-medium">
                  {new Date(cityData.sampleData[0].dt * 1000).toLocaleString()}
                </div>
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

        {/* Daily Forecast */}
        {cityData.dailyForecast && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Forecast</h3>
            <div className="space-y-4">
              {cityData.dailyForecast.slice(0, 7).map((day, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="text-lg font-medium text-gray-800 min-w-[120px]">
                      {new Date(day.dt * 1000).toLocaleDateString([], { weekday: 'long' })}
                    </div>
                    <img 
                      src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} 
                      alt="Weather icon"
                      className="w-12 h-12"
                    />
                    <div className="text-gray-600">
                      {day.description}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-lg font-semibold text-gray-800">
                      {Math.round(day.temp.max)}°C
                    </div>
                    <div className="text-gray-500">
                      {Math.round(day.temp.min)}°C
                    </div>
                    <div className="text-sm text-gray-500">
                      {day.humidity}% humidity
                    </div>
                    <div className="text-sm text-gray-500">
                      {day.wind_speed} m/s
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Weather Details Section */}
            {renderWeatherDetails()}

            {/* Overview Section */}
            <div className="space-y-6">
              {/* Air Quality Trends Chart */}
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

              {/* Detailed Pollutant Analysis */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CityDetailsPage;