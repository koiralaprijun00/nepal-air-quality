import React from 'react';

interface AirQualityWidgetProps {
  data: {
    aqi: number;
    status: string;
    weather: {
      temperature: number;
      humidity: number;
    };
  };
}

interface AqiInfo {
  color: string;
  textColor: string;
  bgLight: string;
  label: string;
  description: string;
  icon: string;
}

const AirQualityWidget: React.FC<AirQualityWidgetProps> = ({ data }) => {
  // Get background color and text based on AQI range
  const getAqiInfo = (aqi: number): AqiInfo => {
    if (aqi <= 50) {
      return {
        color: 'bg-green-500',
        textColor: 'text-green-800',
        bgLight: 'bg-green-100',
        label: 'Good',
        description: 'Air quality is satisfactory, and air pollution poses little or no risk.',
        icon: '😊'
      };
    } else if (aqi <= 100) {
      return {
        color: 'bg-yellow-400',
        textColor: 'text-yellow-800',
        bgLight: 'bg-yellow-100',
        label: 'Moderate',
        description: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.',
        icon: '🙂'
      };
    } else if (aqi <= 150) {
      return {
        color: 'bg-orange-500',
        textColor: 'text-orange-800',
        bgLight: 'bg-orange-100',
        label: 'Unhealthy for Sensitive Groups',
        description: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
        icon: '😐'
      };
    } else if (aqi <= 200) {
      return {
        color: 'bg-red-500',
        textColor: 'text-red-800',
        bgLight: 'bg-red-100',
        label: 'Unhealthy',
        description: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.',
        icon: '😷'
      };
    } else if (aqi <= 300) {
      return {
        color: 'bg-purple-500',
        textColor: 'text-purple-800',
        bgLight: 'bg-purple-100',
        label: 'Very Unhealthy',
        description: 'Health alert: everyone may experience more serious health effects.',
        icon: '🤢'
      };
    } else {
      return {
        color: 'bg-rose-500',
        textColor: 'text-rose-800',
        bgLight: 'bg-rose-100',
        label: 'Hazardous',
        description: 'Health warnings of emergency conditions. The entire population is more likely to be affected.',
        icon: '☣️'
      };
    }
  };

  const { color, textColor, bgLight, label, description, icon } = getAqiInfo(data.aqi);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 animate-scaleIn">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-gray-800">Current Air Quality</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      
      <div className={`${bgLight} ${textColor} px-4 py-3 rounded-lg mb-3`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-lg">{label}</div>
            <div className="text-xs">AQI: {data.aqi}</div>
          </div>
          <div className="flex items-center">
            <div className="w-16 h-16 relative">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <path 
                  className="stroke-current text-gray-200" 
                  fill="none" 
                  strokeWidth="3" 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path 
                  className={`stroke-current ${color.replace('bg-', 'text-')}`}
                  fill="none" 
                  strokeWidth="3" 
                  strokeDasharray={`${Math.min(100, (data.aqi / 500) * 100)}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.5" className="text-xs font-bold" textAnchor="middle" fill="currentColor">
                  {data.aqi}
                </text>
              </svg>
            </div>
          </div>
        </div>
        <p className="text-xs mt-2">{description}</p>
      </div>
      
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Main Pollutant:</span>
          <span className="font-medium">PM2.5</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Temperature:</span>
          <span className="font-medium">{data.weather.temperature}°C</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Humidity:</span>
          <span className="font-medium">{data.weather.humidity}%</span>
        </div>
      </div>
    </div>
  );
};

export default AirQualityWidget;