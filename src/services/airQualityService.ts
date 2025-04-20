// src/services/airQualityService.ts

import axios from 'axios';

const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

interface CityData {
  name: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  sampleData: Array<{
    components: Record<string, number>;
    dt: number;
    weather: {
      temp: number;
      feels_like: number;
      humidity: number;
      pressure: number;
      wind_speed: number;
      description: string;
      icon: string;
    };
  }>;
}

/**
 * Fetches air quality data from the OpenWeather API
 * This function only returns real data without any fallbacks
 */
export const getAirQualityData = async (lat: number, lon: number): Promise<any> => {
    try {
      console.log('Sending request to API endpoint...');
      const response = await fetch(`/api/air-quality?lat=${lat}&lon=${lon}`);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        let errorMsg = `API error: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMsg = errorData.message;
          }
        } catch (e) {
          // If JSON parsing fails, just use the status text
        }
        
        throw new Error(errorMsg);
      }
      
      // Parse response
      const data = await response.json();
      
      // Validate data
      if (!data) {
        throw new Error('Empty response from API');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching air quality data:', error);
      throw error;
    }
  };
  
  /**
   * Convert OpenWeather AQI to descriptive categories
   */
  export const getAqiCategory = (aqi: number): string => {
    switch(aqi) {
      case 1: return 'Good';
      case 2: return 'Fair';
      case 3: return 'Moderate';
      case 4: return 'Poor';
      case 5: return 'Very Poor';
      default: return 'Unknown';
    }
  };
  
  /**
   * Convert AQI to color for visualization
   */
  export const getAqiColor = (aqi: number): string => {
    switch(aqi) {
      case 1: return '#10B981'; // Good - green
      case 2: return '#34D399'; // Fair - lighter green
      case 3: return '#FBBF24'; // Moderate - yellow
      case 4: return '#F97316'; // Poor - orange
      case 5: return '#EF4444'; // Very Poor - red
      default: return '#9CA3AF'; // Unknown - gray
    }
  };

export const fetchAirQualityData = async (cityName: string): Promise<CityData> => {
  try {
    // First, get the city coordinates
    const geocodeResponse = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: cityName,
        appid: API_KEY,
      },
    });

    const { lat, lon } = geocodeResponse.data.coord;

    // Then, get the air quality data
    const airQualityResponse = await axios.get(`${BASE_URL}/air_pollution`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
      },
    });

    // Get weather data
    const weatherResponse = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
      },
    });

    return {
      name: cityName,
      coordinates: { lat, lon },
      sampleData: [
        {
          components: airQualityResponse.data.list[0].components,
          dt: airQualityResponse.data.list[0].dt,
          weather: {
            temp: weatherResponse.data.main.temp,
            feels_like: weatherResponse.data.main.feels_like,
            humidity: weatherResponse.data.main.humidity,
            pressure: weatherResponse.data.main.pressure,
            wind_speed: weatherResponse.data.wind.speed,
            description: weatherResponse.data.weather[0].description,
            icon: weatherResponse.data.weather[0].icon,
          },
        },
      ],
    };
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    throw new Error('Failed to fetch air quality data');
  }
};

export const fetchMultipleCitiesData = async (cityNames: string[]): Promise<CityData[]> => {
  try {
    const promises = cityNames.map(cityName => fetchAirQualityData(cityName));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Error fetching multiple cities data:', error);
    throw new Error('Failed to fetch multiple cities data');
  }
};