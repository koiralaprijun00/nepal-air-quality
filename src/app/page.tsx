'use client'

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
}

interface WorldCityData {
  name: string;
  country: string;
  aqi: number;
  components: Record<string, number>;
}

const Home = () => {
  const router = useRouter();
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [citiesData, setCitiesData] = useState<CityData[]>([]);
  const [worldCitiesData, setWorldCitiesData] = useState<WorldCityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('Kathmandu');
  
  // Map refs and state
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  

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
        minZoom: 3, // Allow zooming out even further
        maxZoom: 12, // Prevents zooming in too close
        accessToken: token,
        attributionControl: false,
        logoPosition: 'bottom-right'
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add event listeners
      map.current.on('load', () => {
        console.log('Map loaded');
        setMapLoaded(true);
        
        // Set bounds to roughly cover Nepal and surrounding areas
        const nepalBounds = new mapboxgl.LngLatBounds(
          [70.0, 22.0], // Southwest coordinates (extended further)
          [95.0, 34.0]  // Northeast coordinates (extended further)
        );
        
        map.current?.setMaxBounds(nepalBounds);
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

  // Helper function to get AQI status
  const getAQIStatus = (aqi: number): string => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  // Helper function to get background color based on AQI
  const getBackgroundColor = (aqi: number): string => {
    if (aqi <= 50) return '#10B981'; // Green
    if (aqi <= 100) return '#FBBF24'; // Yellow
    if (aqi <= 150) return '#F97316'; // Orange
    if (aqi <= 200) return '#EF4444'; // Red
    if (aqi <= 300) return '#7C3AED'; // Purple
    return '#991B1B'; // Dark Red
  };

  // Helper function to get status text color
  const getStatusColor = (aqi: number): string => {
    if (aqi <= 50) return '#059669'; // Green
    if (aqi <= 100) return '#D97706'; // Yellow
    if (aqi <= 150) return '#EA580C'; // Orange
    if (aqi <= 200) return '#DC2626'; // Red
    if (aqi <= 300) return '#6D28D9'; // Purple
    return '#7F1D1D'; // Dark Red
  };

  // Helper function to get health recommendation
  const getHealthRecommendation = (aqi: number): string => {
    if (aqi <= 50) return 'Good for outdoor activities';
    if (aqi <= 100) return 'Moderate outdoor activity';
    if (aqi <= 150) return 'Sensitive groups should reduce outdoor activity';
    if (aqi <= 200) return 'Everyone should reduce outdoor activity';
    if (aqi <= 300) return 'Avoid outdoor activity';
    return 'Stay indoors';
  };

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
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.color = aqi <= 100 ? 'black' : 'white';
      el.style.fontSize = '11px';
      el.style.fontWeight = 'bold';
      el.style.padding = '4px';
      el.textContent = aqi.toFixed(0);

      // Create popup content
      const popupContent = `
        <div style="padding: 10px; min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 16px;">${name}</h3>
          
          <div style="background-color: ${getBackgroundColor(aqi)}; color: ${aqi <= 100 ? 'black' : 'white'}; padding: 8px; border-radius: 4px; margin-bottom: 10px; text-align: center;">
            <div style="font-size: 24px; font-weight: bold;">${aqi.toFixed(0)}</div>
            <div style="font-size: 14px;">${getAQIStatus(aqi)}</div>
          </div>
          
          ${city.sampleData?.[0]?.weather ? `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px; padding: 8px; background-color: #f3f4f6; border-radius: 4px;">
              <img 
                src="https://openweathermap.org/img/wn/${city.sampleData[0].weather.icon}@2x.png" 
                alt="Weather icon"
                style="width: 40px; height: 40px;"
              />
              <div>
                <div style="font-size: 16px; font-weight: 600;">
                  ${Math.round(city.sampleData[0].weather.temp)}°C
                </div>
                <div style="font-size: 12px; color: #6b7280;">
                  Feels like: ${Math.round(city.sampleData[0].weather.feels_like)}°C
                </div>
                <div style="font-size: 12px; color: #6b7280;">
                  Humidity: ${city.sampleData[0].weather.humidity}%
                </div>
                <div style="font-size: 12px; color: #6b7280;">
                  Wind: ${city.sampleData[0].weather.wind_speed} m/s
                </div>
              </div>
            </div>
          ` : ''}
          
          <a href="/city/${name.toLowerCase()}" 
             style="display: block; text-align: center; background-color: #3b82f6; color: white; padding: 6px 12px; border-radius: 4px; text-decoration: none; font-weight: medium;">
            View Detailed Report
          </a>
        </div>
      `;

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: true,
        maxWidth: '220px',
        className: 'custom-popup'
      }).setHTML(popupContent);

      // Add custom styles for popup close button
      const style = document.createElement('style');
      style.textContent = `
        .mapboxgl-popup-close-button {
          display: none !important;
        }
      `;
      document.head.appendChild(style);

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

    // No cleanup function - markers will persist until map is destroyed
    return undefined;
  }, [mapLoaded, error, citiesData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch Nepal cities data
        const nepalResponse = await fetch('/api/data-points');
        if (!nepalResponse.ok) {
          throw new Error(`HTTP error! status: ${nepalResponse.status}`);
        }
        const nepalData = await nepalResponse.json();
        
        // Fetch world cities data
        const worldResponse = await fetch('/api/world-cities');
        if (!worldResponse.ok) {
          throw new Error(`HTTP error! status: ${worldResponse.status}`);
        }
        const worldData = await worldResponse.json();
        
        // Filter out cities without valid coordinates and sample data
        const validCities = nepalData.filter((city: any) => 
          city.coordinates && 
          city.coordinates.lat && 
          city.coordinates.lon && 
          city.sampleData && 
          city.sampleData.length > 0 && 
          city.sampleData[0].components
        );
        
        // Set cities data
        setCitiesData(validCities);
        setWorldCitiesData(worldData);
        
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
      <div className="max-w-7xl mx-auto px-4 md:px-0 pt-8 pb-2">
        <div className="flex flex-col mt-8 mb-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-1">Air Quality - Nepal</h1>
          {cityData?.sampleData?.[0]?.dt && (
            <p className="text-gray-500 text-sm mb-4">
              Last Updated: {new Date(cityData.sampleData[0].dt * 1000).toLocaleString()}
            </p>
          )}
          <div className="w-full max-w-md">
            <SearchBar 
              cities={citiesData} 
              autoNavigate={true} 
              className="w-full" 
            />
          </div>
        </div>
      </div>

      {/* Map Section - Full Width */}
      <div className="max-w-7xl mx-auto relative h-[600px] mb-8">
        {/* City Data Overlay */}
        {cityData && (
          <div className="absolute bottom-4 left-4 rounded-xl shadow-lg border border-gray-200 p-5 max-w-sm z-10 bg-white">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{cityData.name}</h2>
            
            <div className="flex flex-col space-y-4">
              <div className="text-4xl font-bold text-left">
                {cityData?.sampleData?.[0]?.components ? 
                  calculateOverallAqi(cityData.sampleData[0].components).aqi.toFixed(0) : 
                  'N/A'}
              </div>
              <div className="text-lg text-left">
                {cityData?.sampleData?.[0]?.components ? 
                  getAQIStatus(calculateOverallAqi(cityData.sampleData[0].components).aqi) : 
                  'Unknown'}
              </div>
              
              {/* Weather Information */}
              {cityData?.sampleData?.[0]?.weather && (
                <div className="flex items-center space-x-4">
                  <img 
                    src={`https://openweathermap.org/img/wn/${cityData.sampleData[0].weather.icon}@2x.png`} 
                    alt="Weather icon"
                    className="w-12 h-12"
                  />
                  <div className="text-left">
                    <div className="text-xl font-semibold">
                      {Math.round(cityData.sampleData[0].weather.temp)}°C
                    </div>
                    <div className="text-sm text-gray-600">
                      Feels like: {Math.round(cityData.sampleData[0].weather.feels_like)}°C
                    </div>
                    <div className="text-sm text-gray-600">
                      Humidity: {cityData.sampleData[0].weather.humidity}%
                    </div>
                    <div className="text-sm text-gray-600">
                      Wind: {cityData.sampleData[0].weather.wind_speed} m/s
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Map Container */}
        <div className="w-full h-full">
          <div 
            ref={mapContainer} 
            id="map-container"
            className="w-full h-full" 
          />
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-2 z-10">
          <div className="flex items-center space-x-2 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center mr-1"></div>
              <span>Good</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-400 flex items-center justify-center mr-1"></div>
              <span>Moderate</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-orange-500 flex items-center justify-center mr-1"></div>
              <span>Unhealthy (Sensitive Groups)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center mr-1"></div>
              <span>Unhealthy</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-600 flex items-center justify-center mr-1"></div>
              <span>Very Unhealthy</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-900 flex items-center justify-center mr-1"></div>
              <span>Hazardous</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <AirQualityDashboard 
            citiesData={citiesData}
            worldCitiesData={worldCitiesData}
            loading={loading} 
            error={error} 
          />
        </div>
      </div>
    </main>
  );
};

export default Home;