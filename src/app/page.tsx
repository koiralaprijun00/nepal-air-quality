// src/app/page.tsx with Map Hero Section
'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPinIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import AirQualityDashboard from './components/AirQualityDashboard';
import SearchBar from './components/SearchBar';
import HeroMap from './components/HeroSection'; // Import the new HeroMap component

const Home = () => {
  const router = useRouter();
  const [citiesData, setCitiesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [featuredCity, setFeaturedCity] = useState<any | null>(null);

  useEffect(() => {
    const fetchCitiesData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/data-points');
        if (!response.ok) throw new Error('Failed to fetch air quality data');
        const data = await response.json();
        
        // Sort cities by name
        const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));
        setCitiesData(sortedData);
        
        // Set featured city (defaulting to Kathmandu if available)
        const kathmandu = data.find((city: any) => city.name === 'Kathmandu');
        setFeaturedCity(kathmandu || (data.length > 0 ? data[0] : null));
        
        // Set last updated timestamp
        setLastUpdated(new Date());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCitiesData();
    const interval = setInterval(fetchCitiesData, 30 * 60 * 1000); // refresh every 30 mins
    return () => clearInterval(interval);
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    const matchedCity = citiesData.find(
      city => city.name.toLowerCase() === query.toLowerCase()
    );
    
    if (matchedCity) {
      router.push(`/city/${encodeURIComponent(matchedCity.name.toLowerCase())}`);
    }
  };

  // Quick access to popular cities
  const popularCities = ['Kathmandu', 'Pokhara', 'Lalitpur', 'Biratnagar', 'Bharatpur'];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Replace HeroSection with HeroMap */}
      <div className="relative bg-white shadow-sm border-b border-gray-100">
        <HeroMap cityData={featuredCity} loading={loading} />
      </div>
      
      {/* Search Section */}
      <div className="bg-white py-6 shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <SearchBar 
              cities={citiesData} 
              placeholder="Search for a city to check air quality..." 
              className="w-full"
              autoNavigate={true}
            />
            <p className="text-sm text-gray-500 mt-2 text-center">
              Search for any city in Nepal to check its current air quality status
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Last updated information */}
        {lastUpdated && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center text-gray-600 text-sm">
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="flex items-center text-blue-600 text-sm hover:text-blue-800"
            >
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              <span>Refresh data</span>
            </button>
          </div>
        )}
        
        {/* Quick access city buttons */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-3">Quick Access</h2>
          <div className="flex flex-wrap gap-2">
            {popularCities.map(city => {
              const cityData = citiesData.find(c => c.name === city);
              const hasData = cityData && cityData.sampleData && cityData.sampleData.length > 0;
              
              return (
                <Link 
                  key={city}
                  href={`/city/${encodeURIComponent(city.toLowerCase())}`}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${hasData ? 'bg-white text-gray-800 hover:bg-gray-100' : 'bg-gray-200 text-gray-600'} 
                    shadow-sm`}
                >
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span>{city}</span>
                </Link>
              );
            })}
            
            <Link
              href="/blog"
              className="flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors shadow-sm"
            >
              <span>Health Guidelines</span>
            </Link>
          </div>
        </div>
        
        {/* Dashboard content */}
        <AirQualityDashboard citiesData={citiesData} loading={loading} error={error} />
        
        {/* Health & Safety Information Card */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Understanding Air Quality</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium text-lg mb-3">What is AQI?</h3>
              <p className="text-gray-700">
                The Air Quality Index (AQI) is a scale used to communicate how polluted the air is and what associated health effects might be a concern. The higher the AQI value, the greater the level of air pollution and health concern.
              </p>
              
              <div className="mt-4">
                <Link 
                  href="/blog"
                  className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
                >
                  <span>Learn more about AQI</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-3">Protecting Your Health</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 rounded-full bg-green-500 mr-2 flex-shrink-0 mt-0.5"></span>
                  <span><strong>Good (0-50):</strong> Air quality is satisfactory, and air pollution poses little or no risk.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 rounded-full bg-yellow-400 mr-2 flex-shrink-0 mt-0.5"></span>
                  <span><strong>Moderate (51-100):</strong> Unusually sensitive people should consider reducing prolonged outdoor exertion.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 rounded-full bg-orange-400 mr-2 flex-shrink-0 mt-0.5"></span>
                  <span><strong>Unhealthy for Sensitive Groups (101-150):</strong> People with respiratory or heart disease, children and older adults should limit prolonged outdoor exertion.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;