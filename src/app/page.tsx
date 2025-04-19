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
  }>;
}

const Home = () => {
  const router = useRouter();
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [citiesData, setCitiesData] = useState<CityData[]>([]);
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
        <div class="popup-content" style="
          min-width: 200px; 
          max-width: 220px;
          background-color: white;
          border: 4px solid ${getBackgroundColor(aqi)};
          border-radius: 12px; 
          padding: 16px;
          color: ${getBackgroundColor(aqi)};
          position: relative;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        ">
          <h3 style="
            font-size: 24px; 
            font-weight: 700; 
            margin: 0 0 12px 0; 
            color: inherit;
            letter-spacing: -0.5px;
          ">${name}</h3>
          
          <div style="
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 12px;
            letter-spacing: -1px;
          ">
            AQI ${aqi.toFixed(0)}
          </div>

          <div style="
            font-size: 14px;
            color: ${getBackgroundColor(aqi)};
            font-weight: 500;
            margin-bottom: 16px;
            padding: 8px 12px;
            background-color: ${getBackgroundColor(aqi)}15;
            border-radius: 12px;
          ">
            ${getAQIStatus(aqi)}
          </div>

          <a href="/city/${name.toLowerCase()}" style="
            display: block;
            text-align: center;
            background-color: ${getBackgroundColor(aqi)};
            color: white;
            text-decoration: none;
            padding: 10px 16px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s;
          ">View Details</a>
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

    // Cleanup function
    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
    };
  }, [mapLoaded, error, citiesData]);

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
      <div className="container mx-auto px-4 pt-8 pb-2">
        <div className="flex justify-between items-center ">
          <h1 className="text-4xl font-bold text-gray-900">Nepal Air Quality Index</h1>
          <div className="w-96">
            <SearchBar 
              cities={citiesData} 
              autoNavigate={true} 
              className="w-full" 
            />
          </div>
        </div>
      </div>

      {/* Map Section - Full Width */}
      <div className="w-full relative h-[600px] mb-8">
        {/* City Data Overlay */}
        {cityData && (
          <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg border border-gray-200 p-5 max-w-sm z-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{cityData.name}</h2>
            
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

      <div className="container mx-auto px-4">
        <div className="mb-8">
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