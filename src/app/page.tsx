// src/app/page.tsx
'use client'

import { useEffect, useState } from 'react';
import { getAirQualityData } from '../services/airQualityService';

// Nepal cities with their coordinates only - no demo AQI values
const NEPAL_CITIES = [
  { id: '1', name: 'Kathmandu', lat: 27.70169, lng: 85.3206 },
  { id: '2', name: 'Pokhara', lat: 28.2096, lng: 83.9856 },
  { id: '3', name: 'Bhaktapur', lat: 27.6710, lng: 85.4298 },
  { id: '4', name: 'Lalitpur', lat: 27.6674, lng: 85.3086 },
  { id: '5', name: 'Biratnagar', lat: 26.4831, lng: 87.2834 }
];

const Home = () => {
  const [airQualityData, setAirQualityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewState, setViewState] = useState({
    latitude: 27.70169,
    longitude: 85.3206,
    zoom: 7,
  });
  const [cities, setCities] = useState<Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    aqi: number;
  }>>([]);

  useEffect(() => {
    const fetchAllCitiesData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Create placeholder cities with empty AQI to start
        const initialCities = NEPAL_CITIES.map(city => ({
          ...city,
          aqi: 0 // This will be updated with real data
        }));
        
        setCities(initialCities);
        
        // Make API calls for each city in parallel
        const citiesWithAQI = await Promise.all(
          NEPAL_CITIES.map(async (city) => {
            try {
              const data = await getAirQualityData(city.lat, city.lng);
              
              // If this is Kathmandu data, save it for historical display
              if (city.id === '1') {
                setAirQualityData(data);
              }
              
              // If we have AQI data, use it
              if (data && data.current && data.current.main && typeof data.current.main.aqi !== 'undefined') {
                return {
                  ...city,
                  aqi: data.current.main.aqi
                };
              } else {
                // No fallback - if no AQI data, return the city with AQI 0
                console.warn(`No AQI data available for ${city.name}`);
                return {
                  ...city,
                  aqi: 0
                };
              }
            } catch (err) {
              console.error(`Failed to fetch data for ${city.name}:`, err);
              // No fallback - return the city with AQI 0 if API call fails
              return {
                ...city,
                aqi: 0
              };
            }
          })
        );
        
        // Update cities with real AQI data
        setCities(citiesWithAQI);
        
      } catch (err) {
        console.error("Error fetching air quality data", err);
        setError(err instanceof Error ? err.message : 'Failed to load air quality data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllCitiesData();
  }, []);

  // Extract current AQI information
  const currentAqi = airQualityData?.current?.main?.aqi || null;
  const currentComponents = airQualityData?.current?.components || null;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-6">Air Quality Monitoring - Nepal</h1>
        
        {/* Status Messages */}
        {loading && (
          <div className="text-center py-6 bg-white rounded-lg shadow">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p>Loading real-time air quality data...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p className="font-medium">Error Loading Data</p>
            <p className="text-sm">{error}</p>
            <p className="text-sm mt-2">Please check your API configuration and try again.</p>
          </div>
        )}

        {/* Current Air Quality Dashboard */}
        {!loading && airQualityData && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                {currentAqi ? (
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
                  {currentAqi ? (
                    <p className="text-xl font-semibold" style={{ color: getAqiColor(currentAqi) }}>
                      {getAqiCategory(currentAqi)}
                    </p>
                  ) : (
                    <p className="text-xl font-semibold text-gray-500">Data unavailable</p>
                  )}
                </div>
              </div>
              
              {currentComponents ? (
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
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-500">Pollutant data not available</p>
                  <p className="text-sm text-gray-400 mt-2">No real-time data available from the API at this moment</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get AQI color based on value
const getAqiColor = (aqi: number): string => {
  switch(aqi) {
    case 1: return '#10B981'; // Good - green
    case 2: return '#34D399'; // Fair - lighter green
    case 3: return '#FBBF24'; // Moderate - yellow
    case 4: return '#F97316'; // Poor - orange
    case 5: return '#EF4444'; // Very Poor - red
    default: return '#9CA3AF'; // Unknown - gray
  }
};

// Helper function to get AQI category based on value
const getAqiCategory = (aqi: number): string => {
  switch(aqi) {
    case 1: return 'Good';
    case 2: return 'Fair';
    case 3: return 'Moderate';
    case 4: return 'Poor';
    case 5: return 'Very Poor';
    default: return 'Unknown';
  }
};

export default Home;