// src/app/components/UsAqiCard.tsx
'use client'

import React from 'react';
import { calculateOverallAqi, getAqiCategory } from '../../services/AqiCalculator';

interface UsAqiCardProps {
  pollutants: Record<string, number>;
  timestamp?: number;
}

const UsAqiCard: React.FC<UsAqiCardProps> = ({ pollutants, timestamp }) => {
  const { aqi, dominantPollutant, pollutantAqis } = calculateOverallAqi(pollutants);
  const category = getAqiCategory(aqi);
  
  // Map pollutant keys to human-readable names
  const pollutantNames: Record<string, string> = {
    pm2_5: 'PM2.5',
    pm10: 'PM10',
    o3: 'Ozone (O₃)',
    no2: 'Nitrogen Dioxide (NO₂)',
    so2: 'Sulfur Dioxide (SO₂)',
    co: 'Carbon Monoxide (CO)'
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className={`p-4 ${category.color}`}>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">US EPA Air Quality Index</h3>
          {timestamp && (
            <div className="text-sm opacity-90">
              {new Date(timestamp * 1000).toLocaleString()}
            </div>
          )}
        </div>
        <div className="mt-2 flex items-end">
          <span className="text-5xl font-bold">{aqi}</span>
          <span className="ml-3 text-xl">{category.label}</span>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-gray-700">{category.description}</p>
        
        {dominantPollutant && (
          <div className="mt-4">
            <div className="font-medium text-gray-800">Primary Pollutant:</div>
            <div className="text-lg">{pollutantNames[dominantPollutant] || dominantPollutant}</div>
          </div>
        )}
        
        <div className="mt-4 space-y-2">
          <div className="font-medium text-gray-800">Individual Pollutant AQI Values:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(pollutantAqis).map(([key, value]) => (
              <div key={key} className="flex justify-between p-2 bg-gray-50 rounded">
                <span>{pollutantNames[key] || key}:</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsAqiCard;