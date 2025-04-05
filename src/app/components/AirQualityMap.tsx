// src/app/components/AirQualityMap.tsx
'use client'

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { calculateOverallAqi, getAqiCategory } from '../../services/AqiCalculator';

// Mapbox access token should be stored in your environment variables
// You should create a .env.local file and add: NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token_here
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface AirQualityMapProps {
  citiesData: any[];
  loading: boolean;
  error: string | null;
}

const AirQualityMap: React.FC<AirQualityMapProps> = ({ citiesData, loading, error }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(84.0); // Centered for Nepal
  const [lat, setLat] = useState(28.5); // More northern latitude
  const [zoom, setZoom] = useState(6.0); // Slightly zoomed out
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(zoom);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    map.current.on('move', () => {
      if (map.current) {
        setLng(parseFloat(map.current.getCenter().lng.toFixed(4)));
        setLat(parseFloat(map.current.getCenter().lat.toFixed(4)));
        setZoom(parseFloat(map.current.getZoom().toFixed(2)));
      }
    });
    
    // Add zoom change handler to update marker sizes
    map.current.on('zoomend', () => {
      if (map.current) {
        const newZoom = parseFloat(map.current.getZoom().toFixed(2));
        setCurrentZoom(newZoom);
        updateMarkerSizes(newZoom);
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Function to update marker sizes based on zoom level
  const updateMarkerSizes = (zoomLevel: number) => {
    // Select all custom markers
    const markers = document.querySelectorAll('.custom-marker');
    
    // Base size scaling factors
    let size, fontSize;
    
    if (zoomLevel < 5) {
      size = 24;
      fontSize = 10;
    } else if (zoomLevel < 7) {
      size = 36;
      fontSize = 12;
    } else if (zoomLevel < 9) {
      size = 40;
      fontSize = 14;
    } else {
      size = 48;
      fontSize = 16;
    }
    
    // Update each marker's style
    markers.forEach(marker => {
      (marker as HTMLElement).style.width = `${size}px`;
      (marker as HTMLElement).style.height = `${size}px`;
      (marker as HTMLElement).style.fontSize = `${fontSize}px`;
    });
  };

  // Get marker color based on AQI value
  const getMarkerColorFromAqi = (aqi: number): string => {
    if (aqi <= 50) return '#10B981'; // Good - green
    if (aqi <= 100) return '#FBBF24'; // Moderate - yellow
    if (aqi <= 150) return '#F97316'; // Unhealthy for Sensitive Groups - orange
    if (aqi <= 200) return '#EF4444'; // Unhealthy - red
    if (aqi <= 300) return '#7C3AED'; // Very Unhealthy - purple
    return '#991B1B'; // Hazardous - dark red
  };

  // Helper function to determine text color based on background color
  const getTextColorForBackground = (backgroundColor: string): string => {
    // For dark backgrounds (red, purple, etc), use white text
    if (backgroundColor === '#EF4444' || backgroundColor === '#7C3AED' || 
        backgroundColor === '#991B1B' || backgroundColor === '#808080') {
      return 'white';
    }
    
    // For light backgrounds (green, yellow), use dark text
    return 'black';
  };

  // Function to create a marker for each city
  const createMarkerForCity = (city: any) => {
    if (!city.coordinates || !city.name) return;
    
    const { lat, lon } = city.coordinates;
    
    // Check if we have actual air quality data
    const hasAirQualityData = city.sampleData && 
                             city.sampleData[0] && 
                             city.sampleData[0].components;
    
    const components = hasAirQualityData ? city.sampleData[0].components : {};
    
    // Default to a neutral color if no data
    let markerColor = '#808080'; // Gray color for missing data
    let aqiValue: string | number = 'N/A';
    let aqiLabel = 'Unknown';
    let dominantPollutant = '';
    
    // If we have data, calculate AQI and set the color
    if (hasAirQualityData) {
      const aqiData = calculateOverallAqi(components);
      const usEpaAqi = aqiData.aqi;
      dominantPollutant = aqiData.dominantPollutant;
      const category = getAqiCategory(usEpaAqi);
      markerColor = getMarkerColorFromAqi(usEpaAqi);
      aqiValue = usEpaAqi;
      aqiLabel = category.label;
    }
    
    // Create a more advanced marker element that includes the AQI value
    const markerEl = document.createElement('div');
    markerEl.className = 'custom-marker';
    markerEl.style.width = '36px';
    markerEl.style.height = '36px';
    markerEl.style.borderRadius = '50%';
    markerEl.style.backgroundColor = markerColor;
    markerEl.style.border = '2px solid white';
    markerEl.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
    markerEl.style.display = 'flex';
    markerEl.style.justifyContent = 'center';
    markerEl.style.alignItems = 'center';
    markerEl.style.color = getTextColorForBackground(markerColor);
    markerEl.style.fontWeight = 'bold';
    markerEl.style.fontSize = '12px';
    
    // Set the AQI value as text content
    markerEl.textContent = aqiValue.toString();
    
    // Create popup content
    let popupContent = `
      <div style="padding: 10px; min-width: 200px;">
        <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 16px;">${city.name}</h3>
    `;
    
    if (hasAirQualityData) {
      // Map pollutant keys to human-readable names
      const pollutantNames: Record<string, string> = {
        pm2_5: 'PM2.5',
        pm10: 'PM10',
        o3: 'Ozone (O₃)',
        no2: 'NO₂',
        so2: 'SO₂',
        co: 'CO'
      };
      
      popupContent += `
        <div style="background-color: ${markerColor}; color: ${getTextColorForBackground(markerColor)}; padding: 8px; border-radius: 4px; margin-bottom: 10px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold;">${aqiValue}</div>
          <div style="font-size: 14px;">${aqiLabel}</div>
        </div>
        
        <div style="margin-bottom: 10px;">
          <p style="font-size: 13px; margin-bottom: 6px;"><strong>Last Updated:</strong> ${new Date(city.sampleData[0].dt * 1000).toLocaleString()}</p>
      `;
      
      // Add main pollutant if available
      if (dominantPollutant) {
        const pollutantName = pollutantNames[dominantPollutant] || dominantPollutant;
        
        popupContent += `
          <p style="font-size: 13px;"><strong>Main Pollutant:</strong> ${pollutantName}</p>
        `;
      }
      
      popupContent += `
        </div>
        
        <a href="/city/${encodeURIComponent(city.name.toLowerCase())}" 
           style="display: block; text-align: center; background-color: #3b82f6; color: white; padding: 6px 12px; border-radius: 4px; text-decoration: none; font-weight: medium;">
          View Detailed Report
        </a>
      `;
    } else {
      popupContent += `
        <div style="background-color: #f3f4f6; padding: 8px; border-radius: 4px; margin-bottom: 10px; text-align: center;">
          <p style="font-style: italic; color: #6b7280;">Air quality data not available for this location</p>
        </div>
        <p style="font-size: 13px; color: #6b7280;">
          Data for remote locations may be limited or temporarily unavailable.
        </p>
      `;
    }
    
    popupContent += `</div>`;
    
    // Create popup
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

    // Add marker to map
    if (map.current) {
      new mapboxgl.Marker(markerEl)
        .setLngLat([lon, lat])
        .setPopup(popup)
        .addTo(map.current);
    }
  };

  // Add markers for each city
  useEffect(() => {
    if (!map.current || !mapLoaded || loading || error || !citiesData.length) return;

    // Remove existing markers
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add markers for each city
    citiesData.forEach(city => createMarkerForCity(city));
    
    // Update marker sizes based on current zoom
    updateMarkerSizes(currentZoom);
  }, [citiesData, loading, error, mapLoaded, currentZoom]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p>Loading map data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p className="font-medium">Error Loading Map Data</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Air Quality Map</h2>
        <p className="text-sm text-gray-600">Visualizing air quality across Nepal</p>
      </div>
      
      <div className="p-4 border-b">
        <h3 className="text-sm font-medium mb-2">Filter by Region</h3>
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
            className="px-3 py-1 text-xs rounded bg-blue-100 hover:bg-blue-200"
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
            className="px-3 py-1 text-xs rounded bg-blue-100 hover:bg-blue-200"
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
            className="px-3 py-1 text-xs rounded bg-blue-100 hover:bg-blue-200"
          >
            Himalayan Region
          </button>
          <button 
            onClick={() => {
              if (map.current) {
                map.current.flyTo({
                  center: [83.0, 28.2],
                  zoom: 8.0
                });
              }
            }}
            className="px-3 py-1 text-xs rounded bg-blue-100 hover:bg-blue-200"
          >
            Western Nepal
          </button>
          <button 
            onClick={() => {
              if (map.current) {
                map.current.flyTo({
                  center: [87.0, 27.3],
                  zoom: 8.0
                });
              }
            }}
            className="px-3 py-1 text-xs rounded bg-blue-100 hover:bg-blue-200"
          >
            Eastern Nepal
          </button>
        </div>
      </div>
      
      {/* Map container */}
      <div className="relative">
        <div ref={mapContainer} className="h-96" />
        <button
          onClick={() => {
            if (map.current) {
              map.current.flyTo({
                center: [84.0, 28.5],
                zoom: 6.0,
                essential: true
              });
            }
          }}
          className="absolute top-4 right-4 px-3 py-2 bg-white rounded shadow text-sm font-medium"
        >
          Reset View
        </button>
      </div>
      
      <div className="p-4 bg-gray-50 border-t">
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
      
      <div className="p-4 bg-blue-50 text-sm text-blue-800 border-t">
        <p>
          <strong>Note:</strong> Air quality data for some remote mountain locations may be less accurate or temporarily unavailable due to monitoring limitations.
        </p>
      </div>
    </div>
  );
};

export default AirQualityMap;