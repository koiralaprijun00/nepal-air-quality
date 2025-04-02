import React from 'react';

interface Pollutants {
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
}

interface Weather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
}

interface AirQualityDetailsProps {
  data: {
    pollutants: Pollutants;
    weather: Weather;
  };
}

const AirQualityDetails: React.FC<AirQualityDetailsProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <h3 className="font-bold text-gray-800 mb-3">Pollutant Levels</h3>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">PM2.5</span>
            <span className="text-sm font-semibold">{data.pollutants.pm25} μg/m³</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${Math.min(100, (data.pollutants.pm25 / 250) * 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">PM10</span>
            <span className="text-sm font-semibold">{data.pollutants.pm10} μg/m³</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-500 h-2 rounded-full" 
              style={{ width: `${Math.min(100, (data.pollutants.pm10 / 430) * 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">O₃ (Ozone)</span>
            <span className="text-sm font-semibold">{data.pollutants.o3} ppb</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${Math.min(100, (data.pollutants.o3 / 120) * 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">NO₂</span>
            <span className="text-sm font-semibold">{data.pollutants.no2} ppb</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full" 
              style={{ width: `${Math.min(100, (data.pollutants.no2 / 100) * 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">SO₂</span>
            <span className="text-sm font-semibold">{data.pollutants.so2} ppb</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full" 
              style={{ width: `${Math.min(100, (data.pollutants.so2 / 75) * 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">CO</span>
            <span className="text-sm font-semibold">{data.pollutants.co} ppm</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full" 
              style={{ width: `${Math.min(100, (data.pollutants.co / 9) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <h3 className="font-bold text-gray-800 mb-2">Weather Conditions</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10a7 7 0 0114 0m-14 0v2a7 7 0 0114 0v-2" />
            </svg>
            <span className="text-sm truncate">{data.weather.temperature}°C</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            <span className="text-sm truncate">{data.weather.humidity}% Humidity</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span className="text-sm truncate">{data.weather.windSpeed} m/s</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
            </svg>
            <span className="text-sm truncate">{data.weather.windDirection}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirQualityDetails;