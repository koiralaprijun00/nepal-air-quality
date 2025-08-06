
'use client'

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { calculateOverallAqi, getAqiCategory } from '../../services/AqiCalculator';
import { useTranslations } from 'next-intl';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

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

const Home = () => {
  const params = useParams();
  const locale = params.locale as string;
  const [citiesData, setCitiesData] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CityData[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Map refs and state
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const popups = useRef<mapboxgl.Popup[]>([]);
  const [showHeatmap, setShowHeatmap] = useState(false);

  const t = useTranslations('common');

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      setMapError('Mapbox token is missing');
      return;
    }

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [85.3240, 27.7172],
        zoom: 7,
        minZoom: 3,
        maxZoom: 12,
        accessToken: token,
        attributionControl: false,
        logoPosition: 'bottom-left'
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-left');

      map.current.on('load', () => {
        setMapLoaded(true);
        
        const nepalBounds = new mapboxgl.LngLatBounds(
          [70.0, 22.0],
          [95.0, 34.0]
        );
        
        map.current?.setMaxBounds(nepalBounds);

        if (citiesData.length > 0) {
          addMarkers();
        }
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setMapError('Error loading map');
      });

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

  useEffect(() => {
    if (map.current && mapLoaded && citiesData.length > 0) {
      addMarkers();
    }
  }, [citiesData, mapLoaded, showHeatmap]);

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const filtered = citiesData.filter(city => 
      city.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
    
    setSearchResults(filtered);
    setShowSearchResults(filtered.length > 0);
  }, [searchQuery, citiesData]);

  const addHeatmapLayer = () => {
    if (!map.current || !mapLoaded || !citiesData.length) return;

    // Create a dense grid of interpolated points for global coverage
    const generateInterpolatedGrid = () => {
      const points = [];
      
      // Extract valid city data with AQI values
      const validCities = citiesData.filter(city => {
        const hasData = city.coordinates?.lat && city.coordinates?.lon && 
                       city.sampleData?.[0]?.components;
        return hasData;
      }).map(city => ({
        lat: city.coordinates.lat,
        lon: city.coordinates.lon,
        aqi: calculateOverallAqi(city.sampleData[0].components).aqi
      }));

      if (validCities.length === 0) return [];

      // Create a global grid (adjust density as needed)
      const latStep = 0.5; // Degrees
      const lonStep = 0.5; // Degrees
      
      // Global bounds
      const minLat = -60, maxLat = 75;
      const minLon = -180, maxLon = 180;
      
      for (let lat = minLat; lat <= maxLat; lat += latStep) {
        for (let lon = minLon; lon <= maxLon; lon += lonStep) {
          // Use Inverse Distance Weighting (IDW) for interpolation
          let totalWeight = 0;
          let weightedSum = 0;
          const power = 2; // Power parameter for IDW
          
          validCities.forEach(city => {
            const distance = Math.sqrt(
              Math.pow(lat - city.lat, 2) + Math.pow(lon - city.lon, 2)
            );
            
            if (distance === 0) {
              // Exact match
              weightedSum = city.aqi;
              totalWeight = 1;
              return;
            }
            
            const weight = 1 / Math.pow(distance, power);
            weightedSum += weight * city.aqi;
            totalWeight += weight;
          });
          
          if (totalWeight > 0) {
            const interpolatedAqi = weightedSum / totalWeight;
            
            // Add some randomness and variation based on geography
            const variation = (Math.random() - 0.5) * 20;
            let finalAqi = Math.max(0, interpolatedAqi + variation);
            
            // Apply geographical modifiers (rough approximations)
            // Urban areas tend to have higher pollution
            const isUrbanArea = validCities.some(city => {
              const dist = Math.sqrt(Math.pow(lat - city.lat, 2) + Math.pow(lon - city.lon, 2));
              return dist < 1; // Within ~100km of a monitored city
            });
            
            if (isUrbanArea) {
              finalAqi *= 1.2; // Increase pollution in urban areas
            }
            
            // Ocean areas should have cleaner air
            const isLikelyOcean = (
              (lat < 0 && lon > 100 && lon < 180) || // Southern Ocean
              (lat > 0 && lat < 30 && lon > -30 && lon < 50) || // Atlantic
              (lat > 30 && lon < -100) // Pacific
            );
            
            if (isLikelyOcean) {
              finalAqi = Math.min(finalAqi, 50); // Cap ocean pollution
            }
            
            // Add multiple points around each grid point for smoother interpolation
            const jitterAmount = 0.2;
            for (let i = 0; i < 3; i++) {
              const jitterLat = lat + (Math.random() - 0.5) * jitterAmount;
              const jitterLon = lon + (Math.random() - 0.5) * jitterAmount;
              const jitterAqi = finalAqi + (Math.random() - 0.5) * 10;
              
              points.push({
                type: 'Feature' as const,
                properties: {
                  aqi: Math.max(0, Math.min(500, jitterAqi))
                },
                geometry: {
                  type: 'Point' as const,
                  coordinates: [jitterLon, jitterLat]
                }
              });
            }
          }
        }
      }
      
      return points;
    };

    const interpolatedPoints = generateInterpolatedGrid();
    
    const heatmapData = {
      type: 'FeatureCollection' as const,
      features: interpolatedPoints
    };

    // Add source if it doesn't exist
    if (!map.current?.getSource('global-heatmap-data')) {
      map.current?.addSource('global-heatmap-data', {
        type: 'geojson',
        data: heatmapData
      });
    } else {
      // Update existing source
      const source = map.current.getSource('global-heatmap-data') as mapboxgl.GeoJSONSource;
      source.setData(heatmapData);
    }

    // Add heatmap layer if it doesn't exist
    if (!map.current?.getLayer('global-heatmap-layer')) {
      map.current?.addLayer({
        id: 'global-heatmap-layer',
        type: 'heatmap',
        source: 'global-heatmap-data',
        maxzoom: 15,
        paint: {
          // Weight based on AQI value
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'aqi'],
            0, 0.1,
            50, 0.3,
            100, 0.5,
            150, 0.7,
            200, 0.9,
            300, 1,
            500, 1
          ],
          // Intensity based on zoom level
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 0.6,
            5, 1,
            10, 1.2,
            15, 1.5
          ],
          // Color ramp for global air quality heatmap
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(16, 185, 129, 0)', // Transparent green
            0.1, 'rgba(16, 185, 129, 0.6)', // Good - Green
            0.3, 'rgba(251, 191, 36, 0.7)', // Moderate - Yellow
            0.5, 'rgba(249, 115, 22, 0.8)', // Unhealthy SG - Orange
            0.7, 'rgba(239, 68, 68, 0.9)', // Unhealthy - Red
            0.85, 'rgba(124, 58, 237, 1)', // Very Unhealthy - Purple
            1, 'rgba(153, 27, 27, 1)' // Hazardous - Dark Red
          ],
          // Larger radius for global coverage
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 8,
            5, 15,
            10, 25,
            15, 40
          ],
          // Opacity control
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 0.8,
            5, 0.7,
            10, 0.6,
            15, 0.4
          ]
        }
      });
    }

    // Add city points layer on top for reference
    if (!map.current?.getLayer('city-reference-points')) {
      const cityPoints = {
        type: 'FeatureCollection' as const,
        features: citiesData.map(city => {
          const { coordinates, sampleData } = city;
          const { lat, lon } = coordinates || {};
          
          if (!lat || !lon) return null;

          const hasAirQualityData = sampleData && sampleData.length > 0 && sampleData[0]?.components;
          const components = hasAirQualityData && sampleData[0]?.components || {};
          const aqiData = calculateOverallAqi(components);
          
          return {
            type: 'Feature' as const,
            properties: {
              aqi: aqiData.aqi,
              name: city.name
            },
            geometry: {
              type: 'Point' as const,
              coordinates: [lon, lat]
            }
          };
        }).filter(feature => feature !== null)
      };

      map.current?.addSource('city-reference-data', {
        type: 'geojson',
        data: cityPoints
      });

      map.current?.addLayer({
        id: 'city-reference-points',
        type: 'circle',
        source: 'city-reference-data',
        minzoom: 6,
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            6, 3,
            10, 6,
            15, 10
          ],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'aqi'],
            0, '#10B981',
            50, '#10B981',
            100, '#FBBF24',
            150, '#F97316',
            200, '#EF4444',
            300, '#7C3AED',
            500, '#991B1B'
          ],
          'circle-stroke-color': 'white',
          'circle-stroke-width': 2,
          'circle-opacity': 0.9
        }
      });
    }
  };

  const removeHeatmapLayer = () => {
    if (!map.current) return;
    
    // Remove global heatmap layers
    if (map.current.getLayer('global-heatmap-layer')) {
      map.current.removeLayer('global-heatmap-layer');
    }
    if (map.current.getLayer('city-reference-points')) {
      map.current.removeLayer('city-reference-points');
    }
    if (map.current.getSource('global-heatmap-data')) {
      map.current.removeSource('global-heatmap-data');
    }
    if (map.current.getSource('city-reference-data')) {
      map.current.removeSource('city-reference-data');
    }
    
    // Remove old heatmap layers if they exist
    if (map.current.getLayer('heatmap-layer')) {
      map.current.removeLayer('heatmap-layer');
    }
    if (map.current.getLayer('heatmap-point')) {
      map.current.removeLayer('heatmap-point');
    }
    if (map.current.getSource('heatmap-data')) {
      map.current.removeSource('heatmap-data');
    }
  };

  const addMarkers = () => {
    if (!map.current || !mapLoaded || error || !citiesData.length) return;

    // Clear existing markers and popups
    markers.current.forEach(marker => marker.remove());
    popups.current.forEach(popup => popup.remove());
    markers.current = [];
    popups.current = [];

    // If heatmap is enabled, add heatmap instead of markers
    if (showHeatmap) {
      addHeatmapLayer();
      return;
    } else {
      removeHeatmapLayer();
    }

    citiesData.forEach(city => {
      const { name, coordinates, sampleData } = city;
      const { lat, lon } = coordinates || {};

      if (!lat || !lon) return;

      const hasAirQualityData = sampleData && sampleData.length > 0 && sampleData[0]?.components;
      const components = hasAirQualityData && sampleData && sampleData[0]?.components
        ? sampleData[0].components 
        : {};
      
      const aqiData = calculateOverallAqi(components);
      const aqi = aqiData.aqi;
      const category = getAqiCategory(aqi);
      
      let color = '#808080';
      
      if (aqi <= 50) color = '#10B981';
      else if (aqi <= 100) color = '#FBBF24';
      else if (aqi <= 150) color = '#F97316';
      else if (aqi <= 200) color = '#EF4444';
      else if (aqi <= 300) color = '#7C3AED';
      else color = '#991B1B';
      
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = color;
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.color = aqi <= 100 ? 'black' : 'white';
      el.style.fontSize = '12px';
      el.style.fontWeight = 'bold';
      el.textContent = Math.round(aqi).toString();

      // Create hover popup
      const hoverPopup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: [0, -40],
        className: 'hover-popup'
      }).setHTML(`
        <div class="bg-gray-800 text-white p-4 shadow-lg border-0" style="min-width: 300px;">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold text-sm">${name}</h3>
            <button class="text-yellow-400 hover:text-yellow-300">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12l-4-4h8l-4 4z"/>
              </svg>
            </button>
            <button class="text-gray-400 hover:text-white ml-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="text-xs text-gray-300 mb-3">
            Updated at ${sampleData?.[0]?.dt ? new Date(sampleData[0].dt * 1000).toLocaleString() : 'N/A'}
          </div>
          <div class="text-center mb-3">
            <div class="text-3xl font-bold text-yellow-400">${Math.round(aqi)}</div>
            <div class="text-sm text-gray-300">${category.label}</div>
          </div>
          <div class="text-xs text-gray-300 mb-3">
            Primary pollutant ${aqiData.dominantPollutant || 'N/A'}
          </div>
          <div class="text-xs text-gray-400 mb-3">
            ${category.description}
          </div>
          <div class="flex flex-col space-y-2 mt-3 pt-2 border-t border-gray-600">
            <div class="flex items-center text-xs">
              <svg class="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Limit activities if you are sensitive
            </div>
            <div class="flex items-center text-xs">
              <svg class="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
              </svg>
              Close the windows and doors.
            </div>
          </div>
        </div>
      `);

      // Add hover events
      el.addEventListener('mouseenter', () => {
        if (map.current) {
          hoverPopup.setLngLat([lon, lat]).addTo(map.current);
          popups.current.push(hoverPopup);
        }
      });

      el.addEventListener('mouseleave', () => {
        hoverPopup.remove();
      });

      // Add click event to show in sidebar
      el.addEventListener('click', () => {
        setSelectedCity(city);
      });

      if (map.current) {
        const marker = new mapboxgl.Marker(el)
          .setLngLat([lon, lat])
          .addTo(map.current);

        markers.current.push(marker);
      }
    });
  };

  const handleCitySelect = (city: CityData) => {
    setSelectedCity(city);
    setSearchQuery(city.name);
    setShowSearchResults(false);
    
    if (map.current) {
      map.current.flyTo({
        center: [city.coordinates.lon, city.coordinates.lat],
        zoom: 10,
        duration: 1000
      });
    }
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
        
        const validCities = data.filter((city: any) => 
          city.coordinates && 
          city.coordinates.lat && 
          city.coordinates.lon && 
          city.sampleData && 
          city.sampleData.length > 0 && 
          city.sampleData[0].components
        );
        
        setCitiesData(validCities);
        
        // Set default selected city to Kathmandu
        const kathmandu = validCities.find((city: CityData) => city.name === 'Kathmandu');
        if (kathmandu) {
          setSelectedCity(kathmandu);
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-screen relative bg-gray-900 overflow-hidden">
      {/* Full Screen Map */}
      <div className="absolute inset-0 w-full h-full">
        <div ref={mapContainer} className="w-full h-full" />
        
        {/* Loading and Error States */}
        {!mapLoaded && !mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90">
            <div className="flex flex-col items-center text-white">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2">Loading map...</p>
            </div>
          </div>
        )}
        
        {mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90">
            <div className="text-center p-4">
              <p className="text-red-400 font-medium">{mapError}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Top Right Controls */}
        <div className="absolute top-4 right-4 z-20 space-y-3">
          {/* Heatmap Toggle */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-4 py-2 text-sm font-medium rounded-md shadow-lg transition-colors ${
                showHeatmap 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700'
              }`}
            >
              {showHeatmap ? '🗺️ Show Points' : '🔥 Show Heatmap'}
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a city..."
              className="w-80 pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-lg"
            />
            
            {/* Search Results */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute z-30 mt-1 w-full bg-gray-800 border border-gray-600 max-h-60 overflow-auto shadow-xl">
                {searchResults.map((city, index) => (
                  <button
                    key={index}
                    onClick={() => handleCitySelect(city)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-700 border-b border-gray-600 last:border-b-0"
                  >
                    <div className="font-medium">{city.name}</div>
                    <div className="text-xs text-gray-400">
                      {city.coordinates.lat.toFixed(2)}°, {city.coordinates.lon.toFixed(2)}°
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Left Sidebar - Always Visible */}
      <div className="absolute top-0 left-12 z-30 w-96 h-full bg-gray-800 text-white border-r border-gray-700 shadow-2xl">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold">Nepal Air Quality</h1>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-700 mb-2"></div>
                  <div className="h-4 bg-gray-700 mb-2"></div>
                  <div className="h-4 bg-gray-700 mb-2"></div>
                </div>
              </div>
            ) : selectedCity ? (
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2">{selectedCity.name}</h2>
                  <p className="text-sm text-gray-400">
                    {selectedCity.coordinates.lat.toFixed(4)}°, {selectedCity.coordinates.lon.toFixed(4)}°
                  </p>
                  {selectedCity.sampleData?.[0]?.dt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Last updated: {new Date(selectedCity.sampleData[0].dt * 1000).toLocaleString()}
                    </p>
                  )}
                </div>

                {selectedCity.sampleData?.[0]?.components && (
                  <>
                    {/* AQI Overview */}
                    <div className="mb-6">
                      <h3 className="text-md font-semibold mb-3">Air Quality Index</h3>
                      {(() => {
                        const aqiData = calculateOverallAqi(selectedCity.sampleData[0].components);
                        const category = getAqiCategory(aqiData.aqi);
                        return (
                          <div className="bg-gray-700 p-4 border border-gray-600">
                            <div className="text-center mb-4">
                              <div className="text-4xl font-bold text-yellow-400">{Math.round(aqiData.aqi)}</div>
                              <div className="text-sm text-gray-300">{category.label}</div>
                            </div>
                            <div className="text-xs text-gray-400 mb-3">
                              Primary pollutant: {aqiData.dominantPollutant || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-300">
                              {category.description}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Pollutant Details */}
                    <div className="mb-6">
                      <h3 className="text-md font-semibold mb-3">Pollutant Levels</h3>
                      <div className="space-y-2">
                        {Object.entries(selectedCity.sampleData[0].components).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center py-2 px-3 bg-gray-700 border border-gray-600">
                            <span className="text-sm font-medium">{key.toUpperCase()}</span>
                            <span className="text-sm text-gray-300">{value.toFixed(2)} μg/m³</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Weather Info */}
                    {selectedCity.sampleData[0].weather && (
                      <div>
                        <h3 className="text-md font-semibold mb-3">Current Weather</h3>
                        <div className="bg-gray-700 p-4 border border-gray-600">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="text-2xl font-bold">{Math.round(selectedCity.sampleData[0].weather.temp)}°C</div>
                              <div className="text-xs text-gray-400">Feels like {Math.round(selectedCity.sampleData[0].weather.feels_like)}°C</div>
                            </div>
                            {selectedCity.sampleData[0].weather.icon && (
                              <img 
                                src={`https://openweathermap.org/img/wn/${selectedCity.sampleData[0].weather.icon}.png`} 
                                alt="Weather icon"
                                className="w-12 h-12"
                              />
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Humidity:</span>
                              <span>{selectedCity.sampleData[0].weather.humidity}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Wind:</span>
                              <span>{selectedCity.sampleData[0].weather.wind_speed} m/s</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Pressure:</span>
                              <span>{selectedCity.sampleData[0].weather.pressure} hPa</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-400">
                <p>Select a city from the map or search to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
