'use client'

import { useRef, useEffect, useCallback } from 'react'; // Added useCallback import
import mapboxgl from 'mapbox-gl';

// Replace with your Mapbox access token
const MAPBOX_TOKEN = 'pk.eyJ1Ijoia3ByaWp1biIsImEiOiJjajd4OHVweTYzb2l1MndvMzlvdm90c2ltIn0.J25C2fbC1KpcqIRglAh4sA';
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
  airQualityData: {
    location: string;
    aqi: number;
    status: string;
  };
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
  const markers = useRef<Record<string, mapboxgl.Marker>>({});

  // Get color based on AQI value
  const getAqiColor = (aqi: number): string => {
    if (aqi <= 50) return '#10B981'; // Good - green
    if (aqi <= 100) return '#FBBF24'; // Moderate - yellow
    if (aqi <= 150) return '#F97316'; // Unhealthy for Sensitive Groups - orange
    if (aqi <= 200) return '#EF4444'; // Unhealthy - red
    if (aqi <= 300) return '#8B5CF6'; // Very Unhealthy - purple
    return '#E11D48'; // Hazardous - rose
  };

  // Create HTML for popup, memoized with useCallback
  const createPopupHTML = useCallback((city: { name: string; aqi: number }): string => {
    const color = getAqiColor(city.aqi);
    return `
      <div class="p-2">
        <h3 class="font-bold">${city.name}</h3>
        <div class="flex items-center mt-1">
          <div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; margin-right: 6px;"></div>
          <p>AQI: <span class="font-semibold">${city.aqi}</span></p>
        </div>
      </div>
    `;
  }, []); // Empty dependency array since it only depends on getAqiColor which is stable

  const initialViewState = useRef({
    longitude: viewState.longitude,
    latitude: viewState.latitude,
    zoom: viewState.zoom
  });


useEffect(() => {
  if (map.current) return; // initialize map only once
  
  map.current = new mapboxgl.Map({
    container: mapContainer.current!,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [initialViewState.current.longitude, initialViewState.current.latitude],
    zoom: initialViewState.current.zoom
  });
  
  map.current.on('move', () => {
    const center = map.current!.getCenter();
    setViewState({
      longitude: center.lng,
      latitude: center.lat,
      zoom: map.current!.getZoom()
    });
  });

  return () => {
    map.current?.remove();
  };
}, [setViewState]);

  // Update markers
  useEffect(() => {
    if (!map.current || !map.current.loaded()) return;

    cities.forEach(city => {
      if (!markers.current[city.id]) {
        const marker = new mapboxgl.Marker({
          color: getAqiColor(city.aqi)
        })
          .setLngLat([city.lng, city.lat])
          .setPopup(new mapboxgl.Popup().setHTML(createPopupHTML(city)))
          .addTo(map.current!);
        
        markers.current[city.id] = marker;
      } else {
        const markerEl = markers.current[city.id].getElement();
        markerEl.style.backgroundColor = getAqiColor(city.aqi);
        markers.current[city.id].setPopup(
          new mapboxgl.Popup().setHTML(createPopupHTML(city))
        );
      }
    });
  }, [cities, createPopupHTML]);

  // Update map position when viewState changes
  useEffect(() => {
    if (!map.current || !map.current.loaded()) return;

    map.current.flyTo({
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      essential: true,
      duration: 1000
    });
  }, [viewState.longitude, viewState.latitude, viewState.zoom]);

  return (
    <div className="h-full relative animate-scaleIn">
      <div ref={mapContainer} className="h-full rounded-lg" />
      
      {/* Map overlay - Legend */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-md text-sm max-w-[280px] z-10">
        <h4 className="font-bold mb-2">Air Quality Index</h4>
        <div className="space-y-1">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2 flex-shrink-0"></div>
            <span className="text-xs">0-50: Good</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2 flex-shrink-0"></div>
            <span className="text-xs">51-100: Moderate</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-orange-500 mr-2 flex-shrink-0"></div>
            <span className="text-xs">101-150: Sensitive Groups</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2 flex-shrink-0"></div>
            <span className="text-xs">151-200: Unhealthy</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2 flex-shrink-0"></div>
            <span className="text-xs">201-300: Very Unhealthy</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-rose-500 mr-2 flex-shrink-0"></div>
            <span className="text-xs">301+: Hazardous</span>
          </div>
        </div>
      </div>
    
    </div>
  );
};

export default Map;