import React from 'react';

interface HealthRecommendationsProps {
  aqiStatus: string;
}

interface RecommendationData {
  icon: string;
  title: string;
  recommendations: string[];
}

const HealthRecommendations: React.FC<HealthRecommendationsProps> = ({ aqiStatus }) => {
  const getRecommendations = (status: string): RecommendationData => {
    switch(status) {
      case "Good":
        return {
          icon: "👍",
          title: "Good Air Quality",
          recommendations: [
            "Ideal for outdoor activities",
            "Open windows to ventilate indoor spaces",
            "Enjoy the fresh air"
          ]
        };
      case "Moderate":
        return {
          icon: "👌",
          title: "Moderate Air Quality",
          recommendations: [
            "Sensitive individuals should consider limiting prolonged outdoor exertion",
            "Keep windows closed during peak traffic hours",
            "Ventilate during morning hours"
          ]
        };
      case "Unhealthy for Sensitive Groups":
        return {
          icon: "⚠️",
          title: "Unhealthy for Sensitive Groups",
          recommendations: [
            "People with respiratory or heart disease, children and older adults should limit prolonged outdoor exertion",
            "Use indoor air purifiers if available",
            "Limit outdoor physical activities"
          ]
        };
      case "Unhealthy":
        return {
          icon: "😷",
          title: "Unhealthy Air Quality",
          recommendations: [
            "Everyone should reduce prolonged or heavy outdoor exertion",
            "Wear masks when outdoors",
            "Run air purifiers indoors",
            "Keep windows closed"
          ]
        };
      case "Very Unhealthy":
        return {
          icon: "🚫",
          title: "Very Unhealthy Air Quality",
          recommendations: [
            "Everyone should avoid outdoor activities",
            "Keep all windows closed",
            "Run air purifiers indoors",
            "Wear N95 or similar masks when outdoors",
            "Consider relocating temporarily if possible"
          ]
        };
      case "Hazardous":
        return {
          icon: "⛔",
          title: "Hazardous Air Quality",
          recommendations: [
            "Everyone should avoid all physical activities outdoors",
            "Remain indoors with windows and doors closed",
            "Use air purifiers on highest setting",
            "Wear N95 or similar masks if you must go outside",
            "Consider evacuation to areas with better air quality"
          ]
        };
      default:
        return {
          icon: "❓",
          title: "Unknown Air Quality",
          recommendations: [
            "Check official sources for air quality updates",
            "Exercise caution and limit outdoor activities"
          ]
        };
    }
  };

  const { icon, title, recommendations } = getRecommendations(aqiStatus);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex items-center mb-3">
        <span className="text-2xl mr-2">{icon}</span>
        <h3 className="font-bold text-gray-800">{title}</h3>
      </div>
      
      <ul className="space-y-2">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-blue-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-600 break-words">{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HealthRecommendations;