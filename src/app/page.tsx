
'use client'

import { useEffect, useState } from 'react';
import AirQualityDashboard from './components/AirQualityDashboard';

const Home = () => {
  const [citiesData, setCitiesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCitiesData = async () => {
      try {
        const response = await fetch('/api/data-points');
        if (!response.ok) throw new Error('Failed to fetch air quality data');
        const data = await response.json();
        setCitiesData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCitiesData();
    const interval = setInterval(fetchCitiesData, 5 * 60 * 1000); // refresh every 5 mins
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-6">Air Quality Monitoring</h1>
        <AirQualityDashboard citiesData={citiesData} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default Home;