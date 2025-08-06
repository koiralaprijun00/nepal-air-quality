
'use client'

import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface CityData {
  city: string;
  state: string;
  country: string;
  location: {
    coordinates: [number, number];
  };
  current: {
    pollution: {
      ts: string;
      aqius: number;
      mainus: string;
      aqicn: number;
      maincn: string;
    };
    weather: {
      ts: string;
      tp: number;
      pr: number;
      hu: number;
      ws: number;
      wd: number;
      ic: string;
    };
  };
}

export default function Home() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [citiesData, setCitiesData] = useState<CityData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CityData[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [hoveredCity, setHoveredCity] = useState<CityData | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const popups = useRef<mapboxgl.Popup[]>([]);
  const [showHeatmap, setShowHeatmap] = useState(false);

  useEffect(() => {
    const fetchCitiesData = async () => {
      try {
        const response = await fetch('/api/data-points');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCitiesData(data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMapError('Error loading data');
      }
    };

    fetchCitiesData();
  }, []);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
      setMapError('Mapbox token is missing');
      return;
    }

    if (map.current) return; // initialize map only once

    console.log('Initializing map');
    
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [85.3206, 27.7172], // Kathmandu coordinates
      zoom: 2,
    });

    map.current.on('load', () => {
      console.log('Map loaded');
      setMapLoaded(true);
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
  }, []);

  // Add markers when map is loaded and data is available
  useEffect(() => {
    if (mapLoaded && citiesData.length > 0) {
      console.log('Adding markers for', citiesData.length, 'cities');
      addMarkers();
    } else {
      console.log('Skipping marker addition - map not ready or no cities');
    }
  }, [citiesData, mapLoaded, showHeatmap]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const filtered = citiesData.filter(city =>
      city.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (city.state && city.state.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setSearchResults(filtered);
    setShowSearchResults(filtered.length > 0);
  }, [searchQuery, citiesData]);

  const addHeatmapLayer = () => {
    if (!map.current || !mapLoaded || !citiesData.length) return;

    // Remove existing heatmap layer if it exists
    if (map.current.getLayer('heatmap-layer')) {
      map.current.removeLayer('heatmap-layer');
    }
    if (map.current.getSource('heatmap-data')) {
      map.current.removeSource('heatmap-data');
    }

    // Create GeoJSON from cities data
    const geojsonData = {
      type: 'FeatureCollection' as const,
      features: citiesData.map(city => ({
        type: 'Feature' as const,
        properties: {
          aqi: city.current.pollution.aqius,
          city: city.city,
          country: city.country
        },
        geometry: {
          type: 'Point' as const,
          coordinates: city.location.coordinates
        }
      }))
    };

    // Add source
    map.current.addSource('heatmap-data', {
      type: 'geojson',
      data: geojsonData
    });

    // Add heatmap layer
    map.current.addLayer({
      id: 'heatmap-layer',
      type: 'heatmap',
      source: 'heatmap-data',
      maxzoom: 9,
      paint: {
        // Increase the heatmap weight based on AQI value
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'aqi'],
          0, 0,
          300, 1
        ],
        // Increase the heatmap color weight by zoom level
        // heatmap-intensity is a multiplier on top of heatmap-weight
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 1,
          9, 3
        ],
        // Color ramp for heatmap. Domain is 0 (low) to 1 (high).
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(33,102,172,0)',
          0.2, 'rgb(103,169,207)',
          0.4, 'rgb(209,229,240)',
          0.6, 'rgb(253,219,199)',
          0.8, 'rgb(239,138,98)',
          1, 'rgb(178,24,43)'
        ],
        // Adjust the heatmap radius by zoom level
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 2,
          9, 20
        ],
        // Transition from heatmap to circle layer by zoom level
        'heatmap-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          7, 1,
          9, 0
        ]
      }
    }, 'waterway-label');
  };

  const removeHeatmapLayer = () => {
    if (!map.current) return;

    if (map.current.getLayer('heatmap-layer')) {
      map.current.removeLayer('heatmap-layer');
    }
    if (map.current.getSource('heatmap-data')) {
      map.current.removeSource('heatmap-data');
    }
  };

  const addMarkers = () => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    citiesData.forEach((city) => {
      const aqi = city.current.pollution.aqius;
      const color = getAQIColor(aqi);

      // Create marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'relative cursor-pointer';
      markerEl.innerHTML = `
        <div class="w-4 h-4 rounded-full border-2 border-white shadow-lg" style="background-color: ${color}"></div>
      `;

      // Create marker
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat(city.location.coordinates)
        .addTo(map.current!);

      // Add hover events
      markerEl.addEventListener('mouseenter', () => {
        setHoveredCity(city);
      });

      markerEl.addEventListener('mouseleave', () => {
        setHoveredCity(null);
      });

      markers.current.push(marker);
    });

    console.log('Added', markers.current.length, 'markers');
  };

  const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) return '#3BD16F'; // Good - Green
    if (aqi <= 100) return '#F7D63E'; // Moderate - Yellow
    if (aqi <= 150) return '#FF9B57'; // Unhealthy for Sensitive Groups - Orange
    if (aqi <= 200) return '#FE6A69'; // Unhealthy - Red
    if (aqi <= 300) return '#A97ABC'; // Very Unhealthy - Purple
    return '#A87383'; // Hazardous - Maroon
  };

  const getAQIStatus = (aqi: number): string => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const handleCityClick = (city: CityData) => {
    if (map.current) {
      map.current.flyTo({
        center: city.location.coordinates,
        zoom: 10,
        duration: 2000
      });
    }
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const toggleHeatmap = () => {
    if (showHeatmap) {
      removeHeatmapLayer();
      setShowHeatmap(false);
    } else {
      addHeatmapLayer();
      setShowHeatmap(true);
    }
  };

  if (mapError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Map</h2>
          <p className="text-gray-400">{mapError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="absolute left-12 top-0 bottom-0 w-80 bg-gray-800/95 backdrop-blur-sm border-r border-gray-700 z-10 overflow-y-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Air Quality</h1>
            <p className="text-gray-400 text-sm">Real-time air quality monitoring</p>
          </div>

          {/* Heatmap Toggle */}
          <div className="mb-6">
            <button
              onClick={toggleHeatmap}
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                showHeatmap
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {showHeatmap ? 'Show Points' : 'Show Heatmap'}
            </button>
          </div>

          {/* Cities List */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white mb-3">Cities ({citiesData.length})</h3>
            {citiesData.map((city, index) => (
              <div
                key={index}
                onClick={() => handleCityClick(city)}
                className="p-3 bg-gray-700/50 rounded-lg border border-gray-600 hover:bg-gray-600/50 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-white font-medium">{city.city}</h4>
                    <p className="text-gray-400 text-sm">{city.country}</p>
                  </div>
                  <div className="text-right">
                    <div 
                      className="text-lg font-bold"
                      style={{ color: getAQIColor(city.current.pollution.aqius) }}
                    >
                      {city.current.pollution.aqius}
                    </div>
                    <div className="text-xs text-gray-400">AQI</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {getAQIStatus(city.current.pollution.aqius)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar - Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <div className="relative">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10 pr-4 py-3 bg-gray-800/95 backdrop-blur-sm border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Search Results */}
          {showSearchResults && (
            <div className="absolute top-full mt-2 w-full bg-gray-800/95 backdrop-blur-sm border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((city, index) => (
                <div
                  key={index}
                  onClick={() => handleCityClick(city)}
                  className="p-3 hover:bg-gray-700/50 cursor-pointer border-b border-gray-700 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-medium">{city.city}</div>
                      <div className="text-gray-400 text-sm">{city.country}</div>
                    </div>
                    <div className="text-right">
                      <div 
                        className="font-bold"
                        style={{ color: getAQIColor(city.current.pollution.aqius) }}
                      >
                        {city.current.pollution.aqius}
                      </div>
                      <div className="text-xs text-gray-400">AQI</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Hover Info Box */}
      {hoveredCity && (
        <div className="absolute top-20 right-4 z-20 bg-gray-800/95 backdrop-blur-sm border border-gray-600 rounded-lg p-4 text-white shadow-lg min-w-72">
          <h3 className="font-bold text-lg mb-2">{hoveredCity.city}</h3>
          <p className="text-gray-400 mb-3">{hoveredCity.country}</p>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>AQI:</span>
              <span 
                className="font-bold"
                style={{ color: getAQIColor(hoveredCity.current.pollution.aqius) }}
              >
                {hoveredCity.current.pollution.aqius}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-gray-300">{getAQIStatus(hoveredCity.current.pollution.aqius)}</span>
            </div>
            <div className="flex justify-between">
              <span>Temperature:</span>
              <span className="text-gray-300">{hoveredCity.current.weather.tp}°C</span>
            </div>
            <div className="flex justify-between">
              <span>Humidity:</span>
              <span className="text-gray-300">{hoveredCity.current.weather.hu}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
