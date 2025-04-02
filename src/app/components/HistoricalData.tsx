import React from 'react';

interface HistoricalDataProps {
  cityName: string | null;
}

interface HistoricalDataPoint {
  date: string;
  aqi: number;
}

interface HistoricalDataMap {
  [key: string]: HistoricalDataPoint[];
}

const HistoricalData: React.FC<HistoricalDataProps> = ({ cityName }) => {
  // Sample historical data - in a real app, this would come from an API
  const historicalData: HistoricalDataMap = {
    kathmandu: [
      { date: '2025-02-24', aqi: 290 },
      { date: '2025-02-25', aqi: 315 },
      { date: '2025-02-26', aqi: 276 },
      { date: '2025-02-27', aqi: 305 },
      { date: '2025-02-28', aqi: 289 },
      { date: '2025-03-01', aqi: 298 },
      { date: '2025-03-02', aqi: 301 }
    ],
    pokhara: [
      { date: '2025-02-24', aqi: 132 },
      { date: '2025-02-25', aqi: 120 },
      { date: '2025-02-26', aqi: 115 },
      { date: '2025-02-27', aqi: 123 },
      { date: '2025-02-28', aqi: 130 },
      { date: '2025-03-01', aqi: 128 },
      { date: '2025-03-02', aqi: 125 }
    ],
    lalitpur: [
      { date: '2025-02-24', aqi: 265 },
      { date: '2025-02-25', aqi: 258 },
      { date: '2025-02-26', aqi: 271 },
      { date: '2025-02-27', aqi: 280 },
      { date: '2025-02-28', aqi: 269 },
      { date: '2025-03-01', aqi: 272 },
      { date: '2025-03-02', aqi: 275 }
    ],
    bhaktapur: [
      { date: '2025-02-24', aqi: 182 },
      { date: '2025-02-25', aqi: 178 },
      { date: '2025-02-26', aqi: 185 },
      { date: '2025-02-27', aqi: 190 },
      { date: '2025-02-28', aqi: 179 },
      { date: '2025-03-01', aqi: 183 },
      { date: '2025-03-02', aqi: 186 }
    ],
    biratnagar: [
      { date: '2025-02-24', aqi: 150 },
      { date: '2025-02-25', aqi: 148 },
      { date: '2025-02-26', aqi: 154 },
      { date: '2025-02-27', aqi: 160 },
      { date: '2025-02-28', aqi: 152 },
      { date: '2025-03-01', aqi: 155 },
      { date: '2025-03-02', aqi: 156 }
    ]
  };

  // Get data for the selected city or default to Kathmandu
  const data = cityName && historicalData[cityName.toLowerCase()]
    ? historicalData[cityName.toLowerCase()]
    : historicalData.kathmandu;

  // Function to get bar color based on AQI
  const getBarColor = (aqi: number): string => {
    if (aqi <= 50) return 'bg-green-500';
    if (aqi <= 100) return 'bg-yellow-400';
    if (aqi <= 150) return 'bg-orange-500';
    if (aqi <= 200) return 'bg-red-500';
    if (aqi <= 300) return 'bg-purple-500';
    return 'bg-rose-500';
  };

  // Format date to display only day and month
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 mt-6">
      <h3 className="font-bold text-gray-800 mb-3">7-Day Historical AQI</h3>
      
      <div className="flex items-end justify-between h-40 mt-4 gap-1">
        {data.map((day, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className={`${getBarColor(day.aqi)} w-full rounded-t-md transition-all duration-300 hover:opacity-90`}
              style={{ height: `${(day.aqi / 400) * 100}%`, minHeight: '10%' }}
            >
              <span className="text-xs text-white font-bold p-1 hidden sm:block text-center">{day.aqi}</span>
            </div>
            <span className="text-xs text-gray-600 mt-1 truncate w-full text-center">{formatDate(day.date)}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-2 border-t border-gray-200 flex justify-between">
        <div className="text-xs text-gray-500">
          <span className="font-medium">Min:</span> {Math.min(...data.map(d => d.aqi))} AQI
        </div>
        <div className="text-xs text-gray-500">
          <span className="font-medium">Max:</span> {Math.max(...data.map(d => d.aqi))} AQI
        </div>
        <div className="text-xs text-gray-500">
          <span className="font-medium">Avg:</span> {Math.round(data.reduce((sum, d) => sum + d.aqi, 0) / data.length)} AQI
        </div>
      </div>
    </div>
  );
};

export default HistoricalData;