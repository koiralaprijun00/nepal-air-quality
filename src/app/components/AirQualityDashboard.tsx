
'use client'

import React, { useState } from 'react';
import { getPollutantLevel } from '../../services/overallAqiUtils';

interface CityAirQualityData {
  name: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  sampleData: any[];
}

interface AirQualityDashboardProps {
  citiesData: CityAirQualityData[];
  loading: boolean;
  error: string | null;
}

const AirQualityDashboard: React.FC<AirQualityDashboardProps> = ({ 
  citiesData, 
  loading, 
  error 
}) => {
  const [search, setSearch] = useState('');

  if (loading) {
    return (
      <div className="text-center py-6 bg-white rounded-lg shadow">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
        <p>Loading air quality data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p className="font-medium">Error Loading Data</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!citiesData || citiesData.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
        <p className="font-medium">No Air Quality Data Available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Air Quality in Cities</h2>

      <input
        type="text"
        placeholder="Search city..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full p-2 border rounded"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {citiesData
          .filter(city => city.name.toLowerCase().includes(search.toLowerCase()))
          .map((city, index) => {
            const sample = city.sampleData?.[0];
            const components = sample?.components || {};

            return (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-2">{city.name}</h3>

                <div className="text-sm text-gray-600 mb-1">
                  <p><strong>Lat:</strong> {city.coordinates.lat.toFixed(4)}°</p>
                  <p><strong>Lon:</strong> {city.coordinates.lon.toFixed(4)}°</p>
                </div>

                {sample && (
                  <>
                    <p className="text-sm text-gray-600 mb-1">
                      Date: {new Date(sample.dt * 1000).toLocaleString()}
                    </p>

                    <div className="mt-3 text-sm space-y-1">
                      {Object.entries(components).map(([key, value]) => {
                        const { label, range } = getPollutantLevel(key, value as number);
                        return (
                          <p key={key}>
                            <strong>{key.toUpperCase()}</strong>: {value as number} – {label} ({range})
                          </p>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default AirQualityDashboard;