'use client'

import { useEffect, useState } from 'react';
import { getAirQualityData } from '../services/airQualityService';
import HistoricalData from './components/HistoricalData';
import Map from './components/Map';

const Home = () => {
  const [airQualityData, setAirQualityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>(''); // Add state for error handling
  const [viewState, setViewState] = useState({
    latitude: 27.70169,
    longitude: 85.3206,
    zoom: 10,
  });
  const [cities, setCities] = useState<any[]>([]); // Replace 'any[]' with the appropriate type if known

  const fetchAirQualityData = async (lat: number, lon: number) => {
    try {
      const response = await fetch(`/api/air-quality?lat=${lat}&lon=${lon}`);
      const data = await response.json();
      setAirQualityData(data); // Store the fetched data
    } catch (error) {
      setError('Error fetching air quality data'); // Set the error message
      console.error('Error fetching air quality data:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Coordinates for Nepal (Kathmandu as an example)
        const lat = 27.70169;
        const lon = 85.3206;

        const data = await getAirQualityData(lat, lon);
        setAirQualityData(data);
      } catch (error) {
        setError('Error fetching air quality data'); // Handle error here as well
        console.error("Error fetching air quality data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>; // Show error message
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <h1 className="text-3xl font-bold text-center mb-6">Air Quality Monitoring - Nepal</h1>

      {/* Pass the viewState, setViewState, and cities props to Map */}
      <Map viewState={viewState} setViewState={setViewState} cities={cities} />

      {/* Historical Data */}
      <div className="mt-8">
        {airQualityData && airQualityData.data && (
          <HistoricalData data={airQualityData.data} />
        )}
      </div>
    </div>
  );
};

export default Home;
