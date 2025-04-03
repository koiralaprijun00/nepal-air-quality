'use client'

import { useEffect, useState } from 'react';
import { getAirQualityData, getAqiCategory, getAqiColor } from '../services/airQualityService';
import HistoricalData from './components/HistoricalData';
import Map from './components/Map';

// Demo cities data for Nepal (we'll keep this since it's just city coordinates)
const DEMO_CITIES = [
  {
    id: '1',
    name: 'Kathmandu',
    lat: 27.70169,
    lng: 85.3206,
    aqi: 3 // Default AQI for OpenWeather (1-5 scale)
  },
  {
    id: '2',
    name: 'Pokhara',
    lat: 28.2096,
    lng: 83.9856,
    aqi: 2
  },
  {
    id: '3',
    name: 'Bhaktapur',
    lat: 27.6710,
    lng: 85.4298,
    aqi: 3
  },
  {
    id: '4',
    name: 'Lalitpur',
    lat: 27.6674,
    lng: 85.3086,
    aqi: 3
  },
  {
    id: '5',
    name: 'Biratnagar',
    lat: 26.4831,
    lng: 87.2834,
    aqi: 2
  }
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
  const [cities, setCities] = useState(DEMO_CITIES);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Coordinates for Kathmandu, Nepal
        const lat = 27.70169;
        const lon = 85.3206;

        console.log('Fetching air quality data...');
        const data = await getAirQualityData(lat, lon);
        console.log('Received data:', data);
        
        setAirQualityData(data);
        
        // Update Kathmandu's AQI with the latest value from the API if available
        if (data && data.current && data.current.main && typeof data.current.main.aqi !== 'undefined') {
          const currentAqi = data.current.main.aqi;
          
          // Update all city AQIs based on OpenWeather data
          // In a real app, you would fetch data for each city
          setCities(prevCities => 
            prevCities.map(city => 
              city.id === '1' ? {...city, aqi: currentAqi} : city
            )
          );
        } else {
          console.log('Current AQI data not available in expected format:', data);
        }
      } catch (err) {
        console.error("Error fetching air quality data", err);
        setError(err instanceof Error ? err.message : 'Failed to load air quality data');
        setAirQualityData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get current AQI information if available
  const currentAqi = airQualityData?.current?.main?.aqi || null;
  const currentComponents = airQualityData?.current?.components || null;
  
  // Debug information to help diagnose API response issues
  useEffect(() => {
    if (airQualityData && !loading) {
      console.log('Air Quality Data Structure:', {
        hasCurrentData: !!airQualityData.current,
        hasMainProperty: !!(airQualityData.current && airQualityData.current.main),
        hasAqiProperty: !!(airQualityData.current && airQualityData.current.main && airQualityData.current.main.aqi),
        hasComponents: !!(airQualityData.current && airQualityData.current.components),
        dataArrayLength: airQualityData.data?.length
      });
    }
  }, [airQualityData, loading]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-6">Air Quality Monitoring - Nepal</h1>
        
        {/* Status Messages */}
        {loading && (
          <div className="text-center py-6 bg-white rounded-lg shadow">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p>Loading air quality data...</p>
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
                  <p className="text-sm text-gray-400 mt-2">This could be due to API limitations or data unavailability</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Map Component */}
        <div className="h-[500px]">
          <Map viewState={viewState} setViewState={setViewState} cities={cities} />
        </div>
        
        {/* Air Quality Data */}
        <div className="mt-8">
          {airQualityData && airQualityData.data && airQualityData.data.length > 0 ? (
            <HistoricalData data={airQualityData.data} />
          ) : !loading && (
            <div className="p-4 bg-white shadow-md rounded-md text-center">
              <p className="text-gray-600">No air quality data available.</p>
              <p className="text-sm text-gray-500 mt-2">Please ensure your API configuration is correct.</p>
            </div>
          )}
        </div>
        
        {/* Information Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">About Air Quality Index (AQI)</h2>
          <p className="mb-3">The OpenWeather Air Quality Index (AQI) uses a scale of 1 to 5 to communicate how polluted the air currently is or how polluted it is forecast to become.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
            <div className="p-3 bg-green-100 rounded">
              <h3 className="font-semibold text-green-800">1 - Good</h3>
              <p className="text-sm">Air quality is satisfactory, and air pollution poses little or no risk.</p>
            </div>
            
            <div className="p-3 bg-emerald-100 rounded">
              <h3 className="font-semibold text-emerald-800">2 - Fair</h3>
              <p className="text-sm">Air quality is acceptable but some pollutants may be a concern for a small number of sensitive people.</p>
            </div>
            
            <div className="p-3 bg-yellow-100 rounded">
              <h3 className="font-semibold text-yellow-800">3 - Moderate</h3>
              <p className="text-sm">Members of sensitive groups may experience health effects, but the general public is less likely to be affected.</p>
            </div>

            <div className="p-3 bg-orange-100 rounded">
              <h3 className="font-semibold text-orange-800">4 - Poor</h3>
              <p className="text-sm">Everyone may begin to experience health effects; members of sensitive groups may experience more serious effects.</p>
            </div>
            
            <div className="p-3 bg-red-100 rounded">
              <h3 className="font-semibold text-red-800">5 - Very Poor</h3>
              <p className="text-sm">Health alert: everyone may experience more serious health effects. Avoid outdoor activities.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;