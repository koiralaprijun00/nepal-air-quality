'use client'

import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

// Replace with your Mapbox access token
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
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

  const getAqiColor = (aqi: number): string => {
    if (aqi <= 50) return '#10B981'; // Good - green
    if (aqi <= 100) return '#FBBF24'; // Moderate - yellow
    if (aqi <= 150) return '#F97316'; // Unhealthy for Sensitive Groups - orange
    if (aqi <= 200) return '#EF4444'; // Unhealthy - red
    if (aqi <= 300) return '#8B5CF6'; // Very Unhealthy - purple
    return '#E11D48'; // Hazardous - rose
  };

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom
    });

    map.current.on('move', () => {
      const center = map.current!.getCenter();
      setViewState({
        longitude: center.lng,
        latitude: center.lat,
        zoom: map.current!.getZoom()
      });
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, [viewState, setViewState]);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers and add new ones
    cities.forEach(city => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.backgroundColor = getAqiColor(city.aqi);
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
      el.style.cursor = 'pointer';

      new mapboxgl.Marker(el)
        .setLngLat([city.lng, city.lat])
        .setPopup(new mapboxgl.Popup({ closeButton: false }).setHTML(`
          <div>
            <h3>${city.name}</h3>
            <p>AQI: ${city.aqi}</p>
          </div>
        `))
        .addTo(map.current!);
    });
  }, [cities]);

  return (
    <div className="h-full relative">
      <div ref={mapContainer} className="h-full rounded-lg shadow-lg" />
    </div>
  );
};

export default Map;
