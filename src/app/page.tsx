// src/app/page.tsx with Map Hero Section
'use client'

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPinIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import AirQualityDashboard from './components/AirQualityDashboard';
import SearchBar from './components/SearchBar';
import { calculateOverallAqi } from '../services/AqiCalculator';

// Ensure access token is set
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface CityData {
  name: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  sampleData: Array<{
    components: Record<string, number>;
    dt: number;
  }>;
}

const Home = () => {
  const router = useRouter();
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [citiesData, setCitiesData] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('Kathmandu');
  const [showSimpleMap, setShowSimpleMap] = useState(false);
  
  // Map refs and state
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  // Current date and time
  const [currentDate] = useState(new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }));
  
  const [currentTime] = useState(new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  }));

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    console.log('Initializing map');
    
    // Validate Mapbox token
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.error('Mapbox token is missing');
      setMapError('Mapbox token is missing');
      return;
    }

    try {
      // Create map instance
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [85.3240, 27.7172], // Kathmandu coordinates
        zoom: 7,
        accessToken: token
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add event listeners
      map.current.on('load', () => {
        console.log('Map loaded');
        setMapLoaded(true);
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setMapError('Error loading map');
      });

      // Cleanup function
      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (err) {
      console.error('Error creating map:', err);
      setMapError('Error creating map');
    }
  }, []);

  // Add markers for cities
  useEffect(() => {
    if (!map.current || !mapLoaded || error || !citiesData.length) {
      console.log('Skipping marker addition - map not ready or no cities');
      return;
    }

    console.log(`Adding markers for ${citiesData.length} cities`);

    // Clear existing markers
    if (markers.current.length > 0) {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
    }

    // Add new markers
    citiesData.forEach(city => {
      const { name, coordinates, sampleData } = city;
      const { lat, lon } = coordinates || {};

      // Skip if coordinates are invalid
      if (!lat || !lon) {
        console.warn(`Invalid coordinates for ${name}`);
        return;
      }

      // Check if we have actual air quality data
      const hasAirQualityData = sampleData && sampleData.length > 0 && sampleData[0]?.components;
      
      // Default to an empty object if no components
      const components = hasAirQualityData && sampleData && sampleData[0]?.components
        ? sampleData[0].components 
        : {};
      
      // Calculate AQI
      const aqiData = calculateOverallAqi(components);
      const aqi = aqiData.aqi;
      
      // Set marker color based on AQI
      let color = '#808080'; // Default gray
      
      if (aqi <= 50) color = '#00ff00';      // Good
      else if (aqi <= 100) color = '#ffff00'; // Moderate
      else if (aqi <= 150) color = '#ff9900'; // Unhealthy for Sensitive Groups
      else if (aqi <= 200) color = '#ff0000'; // Unhealthy
      else if (aqi <= 300) color = '#990099'; // Very Unhealthy
      else color = '#660066';                 // Hazardous
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = color;
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';

      // Create popup content
      const popupContent = `
        <div class="popup-content">
          <h3>${name}</h3>
          <p>AQI: ${aqi}</p>
          <p>Status: ${getAQIStatus(aqi)}</p>
          ${sampleData && sampleData.length > 0 && sampleData[0]?.dt ? `<p>Last Updated: ${new Date(sampleData[0].dt).toLocaleString()}</p>` : ''}
        </div>
      `;

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false
      }).setHTML(popupContent);

      // Create and add marker
      if (map.current) {
        const marker = new mapboxgl.Marker(el)
          .setLngLat([lon, lat])
          .setPopup(popup)
          .addTo(map.current);

        markers.current.push(marker);
      }
    });

    console.log(`Added ${markers.current.length} markers`);

    // Cleanup function
    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
    };
  }, [mapLoaded, error, citiesData]);

  // Helper function to get AQI status
  const getAQIStatus = (aqi: number): string => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/data-points');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Filter out cities without valid coordinates and sample data
        const validCities = data.filter((city: any) => 
          city.coordinates && 
          city.coordinates.lat && 
          city.coordinates.lon && 
          city.sampleData && 
          city.sampleData.length > 0 && 
          city.sampleData[0].components
        );
        
        // Set cities data
        setCitiesData(validCities);
        
        // Set featured city (defaulting to Kathmandu if available)
        const kathmandu = validCities.find((city: CityData) => city.name === 'Kathmandu');
        setCityData(kathmandu || (validCities.length > 0 ? validCities[0] : null));
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update cityData when selectedCity changes
  useEffect(() => {
    if (citiesData.length > 0) {
      const selectedCityData = citiesData.find(city => city.name === selectedCity);
      if (selectedCityData) {
        setCityData(selectedCityData);
      }
    }
  }, [selectedCity, citiesData]);

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
  
  // Debug info for Mapbox token
  const mapboxTokenStatus = process.env.NEXT_PUBLIC_MAPBOX_TOKEN 
    ? `Token available (${process.env.NEXT_PUBLIC_MAPBOX_TOKEN.substring(0, 10)}...)` 
    : 'Token missing';

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Nepal Air Quality Index</h1>
        
        {/* City Selection */}
        <div className="mb-8">
          <label htmlFor="city-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select City
          </label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="block w-full max-w-xs px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {citiesData.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Map Section */}
        <div className="relative w-full h-[450px] flex mb-8">
          {/* Debug info - remove in production */}
          <div className="absolute top-0 right-0 bg-black/70 text-white text-xs p-1 z-50">
            Mapbox: {mapboxTokenStatus}
          </div>
          
          {/* Toggle Button */}
          <div className="absolute top-4 right-4 z-20">
            <button 
              onClick={() => setShowSimpleMap(!showSimpleMap)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {showSimpleMap ? 'Show Hero Section' : 'Show Simple Map'}
            </button>
          </div>

          {/* Map Error Handling */}
          {mapError && (
            <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-50">
              <div className="text-center p-4">
                <h2 className="text-xl font-bold text-red-700 mb-2">Map Loading Error</h2>
                <p className="text-red-600 mb-2">{mapError}</p>
                <div className="bg-gray-100 p-4 rounded-lg mt-4 text-left">
                  <h3 className="font-bold mb-2">Troubleshooting Tips:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    <li>Verify Mapbox access token</li>
                    <li>Check network connection</li>
                    <li>Ensure all dependencies are installed</li>
                    <li>Restart development server</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* City Data Overlay - Only show when not in simple map mode */}
          {!showSimpleMap && cityData && (
            <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg border border-gray-200 p-5 max-w-sm z-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{cityData.name}</h2>
              <p className="text-gray-500 text-sm">
                {currentDate} • {currentTime}
              </p>
              
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="text-4xl font-bold">
                  {cityData?.sampleData?.[0]?.components ? 
                    calculateOverallAqi(cityData.sampleData[0].components).aqi.toFixed(0) : 
                    'N/A'}
                </div>
                <div className="text-lg">
                  {cityData?.sampleData?.[0]?.components ? 
                    getAQIStatus(calculateOverallAqi(cityData.sampleData[0].components).aqi) : 
                    'Unknown'}
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {cityData?.sampleData?.[0]?.dt ? 
                    new Date(cityData.sampleData[0].dt).toLocaleString() : 
                    'Unknown'}
                </div>
              </div>
            </div>
          )}

          {/* Map Container */}
          <div className="flex-grow h-full relative" style={{ minHeight: '450px', position: 'relative' }}>
            <div 
              ref={mapContainer} 
              id="map-container"
              className="w-full h-full absolute inset-0" 
              style={{ 
                minHeight: '450px', 
                minWidth: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1
              }}
            />
          </div>

          {/* Map Legend - Only show when not in simple map mode */}
          {!showSimpleMap && (
            <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-md p-4 z-10">
              <h3 className="text-sm font-medium mb-2">Map Legend</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-black font-bold mr-2">
                    25
                  </div>
                  <span>Good (0-50)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold mr-2">
                    75
                  </div>
                  <span>Moderate (51-100)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-black font-bold mr-2">
                    125
                  </div>
                  <span>USG (101-150)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white font-bold mr-2">
                    175
                  </div>
                  <span>Unhealthy (151-200)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold mr-2">
                    250
                  </div>
                  <span>Very Unhealthy (201-300)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-red-900 flex items-center justify-center text-white font-bold mr-2">
                    350
                  </div>
                  <span>Hazardous (301+)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold mr-2">
                    N/A
                  </div>
                  <span>No Data Available</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-8">
          <SearchBar 
            cities={citiesData} 
            autoNavigate={true} 
            className="w-full max-w-2xl mx-auto" 
          />
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Air Quality Dashboard</h2>
            {cityData?.sampleData?.[0]?.dt && (
              <div className="text-sm text-gray-500 flex items-center">
                <ArrowPathIcon className="h-4 w-4 mr-1" />
                Last updated: {new Date(cityData.sampleData[0].dt).toLocaleString()}
              </div>
            )}
          </div>
          <AirQualityDashboard 
            citiesData={citiesData} 
            loading={loading} 
            error={error} 
          />
        </div>
      </div>
    </main>
  );
};

export default Home;