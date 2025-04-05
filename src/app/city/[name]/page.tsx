// src/app/city/[name]/page.tsx
'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import UsAqiCard from '../../components/UsAqiCard';
import AqiTrendsChart, { AqiComparisonBox } from '../../components/AqiTrendsChart';
import { getPollutantLevel } from '../../../services/overallAqiUtils';
import { calculateOverallAqi, getAqiCategory } from '../../../services/AqiCalculator';

interface CityData {
  name: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  sampleData: any[];
}

const CityDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const cityName = params?.name as string;
  
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        setLoading(true);
        
        // Fetch all cities data
        const response = await fetch('/api/data-points');
        if (!response.ok) throw new Error('Failed to fetch air quality data');
        
        const allCitiesData = await response.json();
        
        // Find the matching city
        const decodedCityName = decodeURIComponent(cityName);
        const city = allCitiesData.find((city: CityData) => 
          city.name.toLowerCase() === decodedCityName.toLowerCase()
        );
        
        if (!city) {
          throw new Error(`City "${decodedCityName}" not found`);
        }
        
        setCityData(city);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (cityName) {
      fetchCityData();
    }
  }, [cityName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center py-6">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p>Loading city data...</p>
        </div>
      </div>
    );
  }

  if (error || !cityData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => router.push('/')} 
          className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          &larr; Back to All Cities
        </button>
        
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Error Loading City Data</p>
          <p className="text-sm">{error || 'City not found'}</p>
        </div>
      </div>
    );
  }

  const sample = cityData.sampleData?.[0];
  const components = sample?.components || {};

  return (
    // Modified Air Quality Details section in CityDetailsPage
<div className="bg-white rounded-lg shadow p-4">
  <h2 className="text-xl font-bold mb-4">Air Quality Details</h2>
  
  <div className="mb-6">
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-medium">US EPA AQI System</h3>
      <a href="https://www.airnow.gov/aqi/aqi-basics/" target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm hover:underline">
        Learn more
      </a>
    </div>
    <div className="bg-gray-50 p-3 rounded">
      {(() => {
        const { aqi, dominantPollutant } = calculateOverallAqi(components);
        const category = getAqiCategory(aqi);
        return (
          <>
            <p className="text-2xl font-bold">{aqi}</p>
            <p className="text-gray-600">{category.label}</p>
            <p className="text-sm text-gray-500 mt-1">
              AQI scale ranges from 0 (Good) to 500+ (Hazardous)
            </p>
          </>
        );
      })()}
    </div>
  </div>
  
  <h3 className="font-medium mb-2">Pollutant Concentrations:</h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
    {Object.entries(components).map(([key, value]) => {
      const { label, range } = getPollutantLevel(key, value as number);
      return (
        <div key={key} className="border-b pb-2">
          <div className="font-medium">{key.toUpperCase()}: {(value as number).toFixed(2)} µg/m³</div>
          <div className="text-sm text-gray-600">{label} ({range})</div>
        </div>
      );
    })}
  </div>
</div>
  );
};

export default CityDetailsPage;