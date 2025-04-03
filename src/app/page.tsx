'use client'

import { useEffect, useState } from 'react';
import { getAirQualityData } from '../services/airQualityService';
import HistoricalData from './components/HistoricalData';
import Map from './components/Map';

// Demo cities data for Nepal
const DEMO_CITIES = [
  {
    id: '1',
    name: 'Kathmandu',
    lat: 27.70169,
    lng: 85.3206,
    aqi: 75
  },
  {
    id: '2',
    name: 'Pokhara',
    lat: 28.2096,
    lng: 83.9856,
    aqi: 62
  },
  {
    id: '3',
    name: 'Bhaktapur',
    lat: 27.6710,
    lng: 85.4298,
    aqi: 85
  },
  {
    id: '4',
    name: 'Lalitpur',
    lat: 27.6674,
    lng: 85.3086,
    aqi: 79
  },
  {
    id: '5',
    name: 'Biratnagar',
    lat: 26.4831,
    lng: 87.2834,
    aqi: 68
  }
];

// Sample historical data in case API fails
const SAMPLE_DATA = [
  {
    date: new Date().toISOString().split('T')[0],
    air_quality: 75,
    co_surface: 480,
    pm10: 45,
    pm25: 23,
    so2_surface: 1.8
  },
  {
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    air_quality: 82,
    co_surface: 510,
    pm10: 48,
    pm25: 26,
    so2_surface: 2.1
  },
  {
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    air_quality: 68,
    co_surface: 450,
    pm10: 42,
    pm25: 20,
    so2_surface: 1.5
  },
  {
    date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
    air_quality: 72,
    co_surface: 465,
    pm10: 44,
    pm25: 22,
    so2_surface: 1.6
  },
  {
    date: new Date(Date.now() - 345600000).toISOString().split('T')[0],
    air_quality: 65,
    co_surface: 430,
    pm10: 40,
    pm25: 19,
    so2_surface: 1.4
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
        if (data && data.data && data.data.length > 0) {
          const latestAqi = data.data[0].air_quality;
          setCities(prevCities => 
            prevCities.map(city => 
              city.id === '1' ? {...city, aqi: latestAqi} : city
            )
          );
        }
      } catch (err) {
        console.error("Error fetching air quality data", err);
        setError(err instanceof Error ? err.message : 'Failed to load air quality data');
        
        // Set fallback data
        setAirQualityData({
          lat: "27.70169",
          lon: "85.3206",
          elevation: 1337,
          timezone: "Asia/Kathmandu",
          data: SAMPLE_DATA
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
            <p className="text-sm mt-2">Showing demo data for visualization purposes.</p>
          </div>
        )}
        
        {/* Map Component */}
        <div className="h-[500px]">
          <Map viewState={viewState} setViewState={setViewState} cities={cities} />
        </div>
        
        {/* Air Quality Data */}
        <div className="mt-8">
          {airQualityData && airQualityData.data && (
            <HistoricalData data={airQualityData.data} />
          )}
        </div>
        
        {/* Information Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">About Air Quality Index (AQI)</h2>
          <p className="mb-3">The Air Quality Index (AQI) is a scale used to communicate how polluted the air currently is or how polluted it is forecast to become.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-3 bg-green-100 rounded">
              <h3 className="font-semibold text-green-800">Good (0-50)</h3>
              <p className="text-sm">Air quality is satisfactory, and air pollution poses little or no risk.</p>
            </div>
            
            <div className="p-3 bg-yellow-100 rounded">
              <h3 className="font-semibold text-yellow-800">Moderate (51-100)</h3>
              <p className="text-sm">Air quality is acceptable. However, there may be a risk for some people.</p>
            </div>
            
            <div className="p-3 bg-orange-100 rounded">
              <h3 className="font-semibold text-orange-800">Unhealthy for Sensitive Groups (101-150)</h3>
              <p className="text-sm">Members of sensitive groups may experience health effects.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;