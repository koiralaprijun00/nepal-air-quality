// src/app/page.tsx
'use client'

import { useEffect, useState } from 'react';
import { getAirQualityData } from '../services/airQualityService';
import AirQualityDashboard from './components/AirQualityDashboard';

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
        console.log('Data received from API', typeof data, data ? Object.keys(data) : 'null');
        
        setAirQualityData(data);
        
        // Update Kathmandu's AQI with the latest value from the API if available
        if (data && data.current && data.current.main && typeof data.current.main.aqi !== 'undefined') {
          const currentAqi = data.current.main.aqi;
          
          // Update cities with actual AQI data
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

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-6">Air Quality Monitoring - Nepal</h1>
        
        {/* Air Quality Dashboard - Using our new component */}
        <AirQualityDashboard 
          airQualityData={airQualityData}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default Home;