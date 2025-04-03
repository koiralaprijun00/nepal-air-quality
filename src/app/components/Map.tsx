'use client'

import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

// Get Mapbox token from environment variable
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
mapboxgl.accessToken = MAPBOX_TOKEN;

interface MapProps {
  viewState: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  setViewState: React.Dispatch<React.SetStateAction<{
    longitude: number;
    latitude: number;
    zoom: number;
  }>>;
  cities: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    aqi: number;
  }>;
}

const Map: React.FC<MapProps> = ({ viewState, setViewState, cities }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  // Generate color based on AQI value
  const getAqiColor = (aqi: number): string => {
    if (aqi <= 50) return '#10B981'; // Good - green
    if (aqi <= 100) return '#FBBF24'; // Moderate - yellow
    if (aqi <= 150) return '#F97316'; // Unhealthy for Sensitive Groups - orange
    if (aqi <= 200) return '#EF4444'; // Unhealthy - red
    if (aqi <= 300) return '#8B5CF6'; // Very Unhealthy - purple
    return '#E11D48'; // Hazardous - rose
  };

  // Get AQI category label
  const getAqiCategory = (aqi: number): string => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  // Initialize map
  useEffect(() => {
    if (map.current) return; // initialize map only once
    
    if (!mapboxgl.supported()) {
      console.error('Mapbox GL is not supported in this browser');
      return;
    }

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [viewState.longitude, viewState.latitude],
        zoom: viewState.zoom
      });

      map.current.on('move', () => {
        if (!map.current) return;
        const center = map.current.getCenter();
        setViewState({
          longitude: center.lng,
          latitude: center.lat,
          zoom: map.current.getZoom()
        });
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add fullscreen control if supported
      if (document.fullscreenEnabled) {
        map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');
      }
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      // Clean up
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      map.current?.remove();
    };
  }, [viewState.longitude, viewState.latitude, viewState.zoom, setViewState]);

  // Update markers when cities data changes
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    cities.forEach(city => {
      try {
        // Create marker element
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.backgroundColor = getAqiColor(city.aqi);
        el.style.width = '24px';
        el.style.height = '24px';
        el.style.borderRadius = '50%';
        el.style.border = '2px solid white';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        el.style.cursor = 'pointer';

        // Create popup content
        const popupContent = `
          <div style="font-family: sans-serif; padding: 8px;">
            <h3 style="margin: 0 0 8px 0; font-weight: 600;">${city.name}</h3>
            <div style="display: flex; align-items: center; margin-bottom: 4px;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${getAqiColor(city.aqi)}; margin-right: 8px;"></div>
              <p style="margin: 0; font-weight: 500;">AQI: ${city.aqi}</p>
            </div>
            <p style="margin: 0; font-size: 0.85rem; color: #666;">${getAqiCategory(city.aqi)}</p>
          </div>
        `;

        // Create and add marker with popup
        const marker = new mapboxgl.Marker(el)
          .setLngLat([city.lng, city.lat])
          .setPopup(new mapboxgl.Popup({ closeButton: false }).setHTML(popupContent))
          .addTo(map.current!);
        
        markers.current.push(marker);
      } catch (error) {
        console.error(`Error adding marker for ${city.name}:`, error);
      }
    });
  }, [cities]);

  return (
    <div className="h-full relative rounded-lg overflow-hidden shadow-lg">
      {!MAPBOX_TOKEN && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10 p-4">
          <p className="text-red-500 text-center">
            Missing Mapbox token. Please check your environment variables.
          </p>
        </div>
      )}
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default Map;