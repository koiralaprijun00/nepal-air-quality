'use client'

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import mapboxgl from 'mapbox-gl';
import { calculateOverallAqi, getAqiCategory } from '../../services/AqiCalculator';

interface CityData {
  name: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
  sampleData?: any[];
}

interface HeroSectionProps {
  cityData: CityData | null;
  loading: boolean;
  citiesData?: CityData[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ cityData, loading, citiesData = [] }) => {
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

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Log environment variable for debugging
  useEffect(() => {
    console.log('Mapbox Token:', process.env.NEXT_PUBLIC_MAPBOX_TOKEN);
  }, []);

  // Make sure the access token is set
  if (typeof window !== 'undefined') {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
  }

  // Initialize map
  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;

    if (mapContainer.current && !map.current) {
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [84.0, 28.5], // Centered for Nepal
          zoom: 6.0
        });

        map.current.on('load', () => {
          console.log('Map loaded successfully');
          setMapLoaded(true);
        });

        map.current.on('error', (e) => {
          console.error('Mapbox error:', e);
          setMapError(e.error?.message || 'Unknown map error');
        });
      } catch (err) {
        console.error('Map initialization error:', err);
        setMapError(err instanceof Error ? err.message : 'Map initialization failed');
      }
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add markers for cities
  useEffect(() => {
    if (!map.current || !mapLoaded || !citiesData.length) return;

    // Remove existing markers
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Create markers for each city
    citiesData.forEach(city => {
      if (!city.coordinates) return;

      const { lat, lon } = city.coordinates;
      
      // Calculate AQI
      const sampleData = city.sampleData?.[0];
      const components = sampleData?.components || {};
      const aqiData = calculateOverallAqi(components);
      const category = getAqiCategory(aqiData.aqi);

      // Create a custom marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker';
      markerEl.style.width = '36px';
      markerEl.style.height = '36px';
      markerEl.style.borderRadius = '50%';
      markerEl.style.backgroundColor = category.color.split(' ')[0].replace('bg-', '#');
      markerEl.style.display = 'flex';
      markerEl.style.justifyContent = 'center';
      markerEl.style.alignItems = 'center';
      markerEl.style.color = 'white';
      markerEl.style.fontWeight = 'bold';
      markerEl.textContent = aqiData.aqi.toString();
      markerEl.style.border = '2px solid white';
      markerEl.style.boxShadow = '0 0 5px rgba(0,0,0,0.2)';

      // Create popup content
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 10px; max-width: 250px;">
          <h3 style="font-weight: bold; margin-bottom: 5px;">${city.name}</h3>
          <p style="margin-bottom: 5px;">AQI: ${aqiData.aqi} - ${category.label}</p>
          <p style="font-size: 0.8em; color: #666;">${category.description}</p>
          <a href="/city/${encodeURIComponent(city.name.toLowerCase())}" 
             style="display: block; margin-top: 10px; text-align: center; background-color: #3b82f6; color: white; padding: 5px; border-radius: 4px; text-decoration: none;">
            View Details
          </a>
        </div>
      `);

      // Add marker to map
      new mapboxgl.Marker(markerEl)
        .setLngLat([lon, lat])
        .setPopup(popup)
        .addTo(map.current!);
    });
  }, [citiesData, mapLoaded]);

  // If no city data or loading, return a placeholder
  if (loading || !cityData) {
    return (
      <div className="relative h-[450px] w-full flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-40 bg-gray-300 rounded mb-4"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  // If there's a map error, show error message
  if (mapError) {
    return (
      <div className="relative h-[450px] w-full flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-700 mb-2">Map Loading Error</h2>
          <p className="text-red-600">{mapError}</p>
          <p className="text-sm text-gray-600 mt-2">Please check your Mapbox configuration</p>
        </div>
      </div>
    );
  }

  // Get sample air quality data
  const sampleData = cityData.sampleData?.[0];
  const components = sampleData?.components || {};
  const aqiData = calculateOverallAqi(components);
  const category = getAqiCategory(aqiData.aqi);

  // Health recommendation based on AQI
  const getHealthRecommendation = (aqi: number) => {
    if (aqi <= 50) {
      return "Air quality is good. Enjoy outdoor activities!";
    } else if (aqi <= 100) {
      return "Air quality is moderate. Sensitive individuals should consider limiting prolonged outdoor exertion.";
    } else if (aqi <= 150) {
      return "Unhealthy for sensitive groups. Elderly, children, and those with respiratory issues should limit outdoor activity.";
    } else if (aqi <= 200) {
      return "Health alert: Everyone may experience health effects. Limit outdoor activities.";
    } else if (aqi <= 300) {
      return "Health warning: Everyone may experience more serious health effects. Avoid outdoor activities.";
    } else {
      return "Health emergency: Everyone should avoid all outdoor exertion.";
    }
  };

  return (
    <div className="relative h-[450px] w-full">
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Region Filter Buttons */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => {
              if (map.current) {
                map.current.flyTo({
                  center: [84.0, 28.5],
                  zoom: 6.0
                });
              }
            }}
            className="px-3 py-1 text-xs rounded bg-white/80 hover:bg-white/90"
          >
            All Nepal
          </button>
          <button 
            onClick={() => {
              if (map.current) {
                map.current.flyTo({
                  center: [85.3, 27.7],
                  zoom: 9.5
                });
              }
            }}
            className="px-3 py-1 text-xs rounded bg-white/80 hover:bg-white/90"
          >
            Kathmandu Valley
          </button>
          <button 
            onClick={() => {
              if (map.current) {
                map.current.flyTo({
                  center: [84.0, 29.3],
                  zoom: 7.5
                });
              }
            }}
            className="px-3 py-1 text-xs rounded bg-white/80 hover:bg-white/90"
          >
            Himalayan Region
          </button>
        </div>
      </div>
      
      {/* City Data Overlay */}
      <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg border border-gray-200 p-5 max-w-sm z-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{cityData.name}</h2>
        <p className="text-gray-500 text-sm">
          {currentDate} • {currentTime}
        </p>
        
        <div className="mt-4 flex items-center">
          <div className={`w-16 h-16 flex items-center justify-center rounded-xl font-bold text-3xl ${category.color}`}>
            {aqiData.aqi}
          </div>
          <div className="ml-4">
            <p className="font-semibold text-lg text-gray-800">{category.label}</p>
            <p className="text-sm text-gray-500">US EPA Air Quality Index</p>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="font-medium mb-1 text-gray-700">Health Recommendation:</h3>
          <p className="text-gray-600 text-sm">{getHealthRecommendation(aqiData.aqi)}</p>
        </div>
        
        <div className="mt-5">
          <Link 
            href={`/city/${encodeURIComponent(cityData.name.toLowerCase())}`}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition w-full"
          >
            View Detailed Report
          </Link>
        </div>
      </div>
      
      {/* AQI Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg shadow-md p-4 z-10">
        <h3 className="text-sm font-medium mb-2">AQI Legend</h3>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 mr-1"></div>
            <span>0-50</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-400 mr-1"></div>
            <span>51-100</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 mr-1"></div>
            <span>101-150</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 mr-1"></div>
            <span>151-200</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-600 mr-1"></div>
            <span>201-300</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-900 mr-1"></div>
            <span>301+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;