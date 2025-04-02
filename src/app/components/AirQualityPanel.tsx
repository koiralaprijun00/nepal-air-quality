import React from 'react';

interface AirQualityPanelProps {
  data: {
    location: string;
    aqi: number;
    status: string;
    isLoaded: boolean;
  };
}

const AirQualityPanel: React.FC<AirQualityPanelProps> = ({ data }) => {
  // Get background color based on AQI status
  const getBgColor = (status: string): string => {
    switch(status) {
      case "Good":
        return "bg-green-400";
      case "Moderate":
        return "bg-yellow-400";
      case "Unhealthy for Sensitive Groups":
        return "bg-orange-400";
      case "Unhealthy":
        return "bg-red-400";
      case "Very Unhealthy":
        return "bg-purple-500";
      case "Hazardous":
        return "bg-rose-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className={`${
      data.isLoaded 
        ? getBgColor(data.status) 
        : 'bg-gray-300'
      } bg-opacity-80 px-8 py-4 rounded-lg shadow-md text-gray-800 mt-6 ${
      !data.isLoaded ? 'opacity-50' : ''
    }`}>
      {/* Component content */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <div className="w-full sm:w-3/4 mb-3 sm:mb-0">
          <h3 className="font-semibold text-2xl">
            {data.isLoaded ? `${data.location}` : "Search for a location to view air quality data"}
          </h3>
        </div>
        <div className="flex items-center justify-between sm:flex-col sm:items-end">
          <div className="font-bold text-lg md:text-xl">AQI</div>
          <div className="font-bold text-lg md:text-xl text-white">
            {data.isLoaded ? data.aqi : '—'}
          </div>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-white mr-2"></div>
        <div className="text-white font-semibold text-lg">
          {data.isLoaded ? data.status : 'No Data'}
        </div>
      </div>
    </div>
  );
};

export default AirQualityPanel;