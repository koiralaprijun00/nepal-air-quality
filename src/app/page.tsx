'use client'

import { useState, useEffect, useMemo } from 'react';

import Map from './components/Map';
import AirQualityPanel from './components/AirQualityPanel';
import AirQualityDetails from './components/AirQualityDetails';
import HealthRecommendations from './components/HealthRecommendations';
import HistoricalData from './components/HistoricalData';
import AirQualityFilter from './components/AirQualityFilter';

// Define TypeScript interfaces
interface City {
  id: string;
  name: string;
  lat: number;
  lng: number;
  aqi: number;
}

interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
}

interface Pollutants {
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
}

interface Weather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
}

interface AirQualityData {
  location: string;
  aqi: number;
  status: string;
  pollutants: Pollutants;
  weather: Weather;
  time: string;
  isLoaded: boolean;
}

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [viewState, setViewState] = useState<ViewState>({
    longitude: 85.3240,  // Default to Kathmandu
    latitude: 27.7172,
    zoom: 10
  });
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  
  const [airQualityData, setAirQualityData] = useState<AirQualityData>({
    location: "Search Location...",
    aqi: 0,
    status: "No Data",
    pollutants: {
      pm25: 0,
      pm10: 0,
      o3: 0,
      no2: 0,
      so2: 0,
      co: 0
    },
    weather: {
      temperature: 0,
      humidity: 0,
      windSpeed: 0,
      windDirection: ""
    },
    time: "No data available yet",
    isLoaded: false
  });
  
  const cities = useMemo<City[]>(() => [
    { id: "kathmandu", name: "Kathmandu", lat: 27.7172, lng: 85.3240, aqi: 301 },
    { id: "pokhara", name: "Pokhara", lat: 28.2096, lng: 83.9856, aqi: 125 },
    { id: "lalitpur", name: "Lalitpur", lat: 27.6588, lng: 85.3247, aqi: 275 },
    { id: "bhaktapur", name: "Bhaktapur", lat: 27.6710, lng: 85.4298, aqi: 186 },
    { id: "biratnagar", name: "Biratnagar", lat: 26.4525, lng: 87.2700, aqi: 156 },
    { id: "birgunj", name: "Birgunj", lat: 27.0128, lng: 84.8773, aqi: 198 },
    { id: "dharan", name: "Dharan", lat: 26.8065, lng: 87.2846, aqi: 132 },
    { id: "nepalgunj", name: "Nepalgunj", lat: 28.0500, lng: 81.6167, aqi: 145 }
  ], []);
  
  // Update air quality data when city changes
  // Update air quality data when city changes
useEffect(() => {
  if (selectedCity) {
    const city = cities.find(c => c.id === selectedCity);
    if (city) {
      setViewState({
        longitude: city.lng,
        latitude: city.lat,
        zoom: 11
      });
      
      setAirQualityData(prev => ({
        ...prev,
        location: `${city.name}, Nepal`,
        aqi: city.aqi,
        status: getAqiStatus(city.aqi),
        isLoaded: true  // Set isLoaded to true when city is selected
      }));
    }
  }
}, [selectedCity, cities]);
  
  // Apply filter to cities
  useEffect(() => {
    let filtered = [...cities];
    
    if (activeFilter !== 'all') {
      switch(activeFilter) {
        case 'good':
          filtered = cities.filter(city => city.aqi <= 50);
          break;
        case 'moderate':
          filtered = cities.filter(city => city.aqi > 50 && city.aqi <= 100);
          break;
        case 'sensitive':
          filtered = cities.filter(city => city.aqi > 100 && city.aqi <= 150);
          break;
        case 'unhealthy':
          filtered = cities.filter(city => city.aqi > 150 && city.aqi <= 200);
          break;
        case 'very-unhealthy':
          filtered = cities.filter(city => city.aqi > 200 && city.aqi <= 300);
          break;
        case 'hazardous':
          filtered = cities.filter(city => city.aqi > 300);
          break;
      }
    }
    
    setFilteredCities(filtered);
  }, [activeFilter, cities]);
  
  // Function to determine AQI status based on value
  const getAqiStatus = (aqi: number): string => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  return (
    <div className="min-h-screen overflow-hidden">
     <div className="pt-8 px-6 max-w-7xl mx-auto">
  <div className="text-left">
    <h1 className="text-3xl font-bold tracking-tight">
      <span className="text-red-600 mr-2">Nepal</span> 
      <span className="text-blue-800 mr-2">Air</span> 
      <span className="bg-gradient-to-r from-red-600 to-blue-800 bg-clip-text text-transparent">
        Quality
      </span>
    </h1>
    <p className="text-sm text-gray-600 mt-2">
      Monitoring air pollution levels across cities in Nepal
      <span className="bg-red-600 px-2 py-1 ml-2 inline-block text-white rounded-md">
        For Citizens of Nepal.
      </span>
    </p>
  </div>
</div>


    
      <div className="flex items-center justify-center mt-8">
        <main className="flex flex-col lg:flex-row w-full max-w-7xl mx-4 bg-white rounded-xl shadow-xl overflow-hidden animate-fadeIn">
        <div className="w-full lg:w-2/5 p-6 overflow-y-auto max-h-[90vh] lg:max-h-[800px] sidebar-scroll">
          
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Choose Your City</h1>
          
          <div className="mb-6">
            <div className="relative">
              <select 
                className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:ring focus:ring-blue-200 transition"
                onChange={(e) => setSelectedCity(e.target.value)}
                value={selectedCity || ''}
              >
                <option value="" disabled>City</option>
                {filteredCities.map(city => (
                  <option key={city.id} value={city.id}>
                    {city.name} 
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <AirQualityPanel data={airQualityData} />

          <AirQualityFilter onFilterChange={setActiveFilter} />
          
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <AirQualityDetails data={airQualityData} />
            <HealthRecommendations aqiStatus={airQualityData.status} />
          </div>
          
          <HistoricalData cityName={selectedCity} />
          
          <div className="flex items-center justify-between mt-6">
            <div className="text-xs text-gray-500">
              {airQualityData.time}
            </div>
            <div className="flex space-x-2">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm py-1 px-3 rounded-md transition-colors duration-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-3/5 h-[500px] lg:h-[800px] relative">
          <Map 
            viewState={viewState} 
            setViewState={setViewState}
            airQualityData={airQualityData}
            cities={cities} 
          />
        </div>
        </main>
      </div>
    </div>
  );
}