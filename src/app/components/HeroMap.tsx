// src/app/components/HeroMap.tsx
'use client'

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Link from 'next/link';
import { calculateOverallAqi, getAqiCategory } from '../../services/AqiCalculator';

// Set Mapbox token from environment
// Using the hardcoded token from your .env.local file as a fallback if needed
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1Ijoia3ByaWp1biIsImEiOiJjajd4OHVweTYzb2l1MndvMzlvdm90c2ltIn0.J25C2fbC1KpcqIRglAh4sA';
mapboxgl.accessToken = MAPBOX_TOKEN;

// Add console log to debug token
console.log('Mapbox token available:', !!MAPBOX_TOKEN);

interface CityData {
  name: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
  sampleData?: any[];
}

interface HeroMapProps {
  cityData: CityData | null;
  loading: boolean;
}

const HeroMap: React.FC<HeroMapProps> = ({ cityData, loading }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    
    setCurrentDate(now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
    
    setCurrentTime(now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    }));

    // Initialize map only once and if container is available
    if (!mapContainer.current || map.current) return;
    
    // Check if Mapbox is available
    if (!mapboxgl) {
      console.error('Mapbox GL is not available');
      setMapError('Mapbox GL library could not be loaded');
      return;
    }
    
    // Check if token is set
    if (!mapboxgl.accessToken) {
      console.error('Mapbox token is not set');
      setMapError('Mapbox access token is missing');
      return;
    }
    
    try {
      // Default to Kathmandu coordinates if no cityData
      const defaultLat = 27.7172;
      const defaultLng = 85.3240;
      
      const lat = cityData?.coordinates?.lat || defaultLat;
      const lng = cityData?.coordinates?.lon || defaultLng;
  
      console.log('Initializing map with coordinates:', lng, lat);
  
      // Initialize map with error handling
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [lng, lat],
        zoom: 10,
        attributionControl: false
      });
  
      // Log successful map creation
      console.log('Map object created successfully');
      
      // Add event listener for map load
      map.current.on('load', () => {
        console.log('Map loaded successfully');
      });
      
      // Add event listener for map error
      map.current.on('error', (e) => {
        console.error('Map error:', e);
      });
  
      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl({
        showCompass: false
      }), 'top-right');
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Error initializing map: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
    
    // Add marker for the city if we have data
    if (cityData && cityData.coordinates) {
      // Get AQI data
      const sampleData = cityData.sampleData?.[0];
      const components = sampleData?.components || {};
      const { aqi } = calculateOverallAqi(components);
      const category = getAqiCategory(aqi);
      
      // Get marker color based on AQI
      let markerColor = '#808080'; // Default gray
      if (aqi <= 50) markerColor = '#10B981'; // Good - green
      else if (aqi <= 100) markerColor = '#FBBF24'; // Moderate - yellow
      else if (aqi <= 150) markerColor = '#F97316'; // USG - orange
      else if (aqi <= 200) markerColor = '#EF4444'; // Unhealthy - red
      else if (aqi <= 300) markerColor = '#7C3AED'; // Very Unhealthy - purple
      else markerColor = '#991B1B'; // Hazardous - dark red
      
      // Create custom marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker';
      markerEl.style.width = '50px';
      markerEl.style.height = '50px';
      markerEl.style.borderRadius = '50%';
      markerEl.style.backgroundColor = markerColor;
      markerEl.style.border = '3px solid white';
      markerEl.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
      markerEl.style.display = 'flex';
      markerEl.style.justifyContent = 'center';
      markerEl.style.alignItems = 'center';
      markerEl.style.color = aqi > 150 ? 'white' : 'black';
      markerEl.style.fontWeight = 'bold';
      markerEl.style.fontSize = '18px';
      
      // Set the AQI value as text content
      markerEl.textContent = aqi.toString();
      
      // Add marker to map
      new mapboxgl.Marker(markerEl)
        .setLngLat([cityData.coordinates.lon, cityData.coordinates.lat])
        .addTo(map.current!);
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [cityData]);

  // Get sample air quality data if available
  const sampleData = cityData?.sampleData?.[0];
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
    <div className="relative">
      {/* Map container */}
      <div ref={mapContainer} className="h-[450px] w-full bg-gray-100" />
      
      {/* Overlay for city data */}
      {!loading && cityData && (
        <div className="absolute top-12 left-8 bg-white rounded-xl shadow-lg border border-gray-200 p-5 max-w-sm z-10">
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
      )}
      
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 z-10">
          <div className="flex flex-col items-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-lg text-gray-600">Loading map data...</p>
          </div>
        </div>
      )}
      
      {/* Error overlay - show this when map fails to load */}
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Map Loading Error</h3>
            <p className="text-gray-600 mb-4">{mapError}</p>
            <p className="text-sm text-gray-500">
              Please check your internet connection and refresh the page.
              The air quality information is still available in the city list below.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroMap;