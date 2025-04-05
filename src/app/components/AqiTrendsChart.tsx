// src/app/components/AqiTrendsChart.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateOverallAqi, getAqiCategory } from '../../services/AqiCalculator';

interface AqiTrendsChartProps {
  lat: number;
  lon: number;
  cityName: string;
}

interface HistoricalDataPoint {
  dt: number;
  main: { aqi: number };
  components: Record<string, number>;
}

interface ChartDataPoint {
  date: string;
  usEpaAqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
}

const AqiTrendsChart: React.FC<AqiTrendsChartProps> = ({ lat, lon, cityName }) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePollutant, setActivePollutant] = useState<string>('usEpaAqi');

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setLoading(true);
        
        // Calculate time range for historical data (5 days ago until now)
        const now = Math.floor(Date.now() / 1000);
        const fiveDaysAgo = now - (5 * 24 * 60 * 60);
        
        // Fetch historical data from OpenWeatherMap
        const response = await fetch(`/api/air-quality?lat=${lat}&lon=${lon}&start=${fiveDaysAgo}&end=${now}`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.data || !Array.isArray(data.data)) {
          setChartData([]);
          return;
        }
        
      // Modified data transformation in AqiTrendsChart
const transformedData: ChartDataPoint[] = data.data.map((point: any) => {
  // Calculate US EPA AQI
  const components = {
    pm2_5: point.pm25 || 0,
    pm10: point.pm10 || 0,
    o3: point.o3_surface || 0,
    no2: point.no2_surface || 0,
    so2: point.so2_surface || 0,
    co: point.co_surface || 0
  };
  
  const { aqi: usEpaAqi } = calculateOverallAqi(components);
  
  return {
    date: new Date(point.date).toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric' 
    }),
    usEpaAqi,
    pm25: point.pm25 || 0,
    pm10: point.pm10 || 0,
    o3: point.o3_surface || 0,
    no2: point.no2_surface || 0,
    so2: point.so2_surface || 0,
    co: point.co_surface / 100 // Scaling CO for better visualization
  };
});
        
        setChartData(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch historical data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistoricalData();
  }, [lat, lon]);
  
 // Modified pollutant options in AqiTrendsChart
const pollutantOptions = [
  { value: 'usEpaAqi', label: 'US EPA AQI' },
  { value: 'pm25', label: 'PM2.5' },
  { value: 'pm10', label: 'PM10' },
  { value: 'o3', label: 'Ozone (O₃)' },
  { value: 'no2', label: 'NO₂' },
  { value: 'so2', label: 'SO₂' },
  { value: 'co', label: 'CO (÷100)' }
];

// Modified getLineColor function
const getLineColor = (pollutant: string): string => {
  switch (pollutant) {
    case 'usEpaAqi': return '#8884d8';
    case 'pm25': return '#ff7300';
    case 'pm10': return '#ff0000';
    case 'o3': return '#0088fe';
    case 'no2': return '#00c49f';
    case 'so2': return '#ffbb28';
    case 'co': return '#ff8042';
    default: return '#8884d8';
  }
};
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p>Loading historical data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p className="font-medium">Error Loading Historical Data</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }
  
  if (chartData.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
        <p className="font-medium">No Historical Air Quality Data Available</p>
        <p className="text-sm">Historical data is not available for this location.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-xl font-bold mb-4">Air Quality Trends: {cityName}</h3>
      
      <div className="mb-4">
        <label htmlFor="pollutant-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select Pollutant:
        </label>
        <select
          id="pollutant-select"
          value={activePollutant}
          onChange={(e) => setActivePollutant(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md"
        >
          {pollutantOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              tickFormatter={(value) => value.split(',')[0]}
            />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [
                `${value.toFixed(2)}`,
                activePollutant === 'usEpaAqi' || activePollutant === 'openWeatherAqi' 
                  ? 'AQI' 
                  : 'μg/m³'
              ]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={activePollutant}
              stroke={getLineColor(activePollutant)}
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 6 }}
            />
            
            {/* Add reference lines for US EPA AQI categories if showing AQI */}
            {(activePollutant === 'usEpaAqi') && (
              <>
                {/* <ReferenceLine y={50} stroke="green" strokeDasharray="3 3" label={{ value: 'Good', position: 'insideLeft' }} />
                <ReferenceLine y={100} stroke="yellow" strokeDasharray="3 3" label={{ value: 'Moderate', position: 'insideLeft' }} />
                <ReferenceLine y={150} stroke="orange" strokeDasharray="3 3" label={{ value: 'Unhealthy for Sensitive Groups', position: 'insideLeft' }} />
                <ReferenceLine y={200} stroke="red" strokeDasharray="3 3" label={{ value: 'Unhealthy', position: 'insideLeft' }} />
                <ReferenceLine y={300} stroke="purple" strokeDasharray="3 3" label={{ value: 'Very Unhealthy', position: 'insideLeft' }} /> */}
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* AQI Legend for reference */}
      {(activePollutant === 'usEpaAqi') && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">US EPA AQI Categories:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 mr-2"></div>
              <span>0-50: Good</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-400 mr-2"></div>
              <span>51-100: Moderate</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-orange-400 mr-2"></div>
              <span>101-150: Unhealthy for Sensitive Groups</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 mr-2"></div>
              <span>151-200: Unhealthy</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-purple-600 mr-2"></div>
              <span>201-300: Very Unhealthy</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-900 mr-2"></div>
              <span>301+: Hazardous</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AqiTrendsChart;


// Modified AqiComparisonBox to remove OpenWeather AQI
export const AqiComparisonBox: React.FC<{
  components: Record<string, number>;
}> = ({ components }) => {
  const { aqi: usEpaAqi, dominantPollutant } = calculateOverallAqi(components);
  const epaCat = getAqiCategory(usEpaAqi);
  
  // Map pollutant keys to human-readable names
  const pollutantNames: Record<string, string> = {
    pm2_5: 'PM2.5',
    pm10: 'PM10',
    o3: 'Ozone (O₃)',
    no2: 'NO₂',
    so2: 'SO₂',
    co: 'CO'
  };
  
  return (
    <div className="border rounded-lg overflow-hidden">
    <div className="p-3">
      <h3 className="text-sm font-medium text-gray-700 mb-1">US EPA AQI</h3>
      <div className="flex items-center space-x-2">
        <div className={`w-4 h-4 rounded-full ${epaCat.color.split(' ')[0]}`}></div>
        <div className="text-xl font-bold">{usEpaAqi}</div>
        <div className="text-sm">{epaCat.label}</div>
      </div>
    </div>
    
    {dominantPollutant && (
      <div className="px-3 py-2 bg-gray-50 text-sm border-t">
        <span className="font-medium">Main Pollutant:</span> {pollutantNames[dominantPollutant] || dominantPollutant}
      </div>
    )}
  </div>
  );
};