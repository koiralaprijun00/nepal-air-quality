// services/airqualityServices.tsx

import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_METEOSOURCE_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_METEOSOURCE_BASE_URL;

interface AirQualityResponse {
  lat: string;
  lon: string;
  elevation: number;
  timezone: string;
  data: Array<{
    date: string;
    air_quality: number;
    co_surface: number;
    pm10: number;
    pm25: number;
    so2_surface: number;
  }>;
}

// services/airQualityService.ts
export const getAirQualityData = async (lat: number, lon: number) => {
    try {
      const response = await fetch(`/api/air-quality?lat=${lat}&lon=${lon}`);
      
      // Check if the response is ok (status 200)
      if (!response.ok) {
        throw new Error(`API response error: ${response.statusText}`);
      }
  
      // Check if the response body is empty
      const data = await response.json();
      
      // If the response is empty or invalid, return a default value or an error message
      if (!data || Object.keys(data).length === 0) {
        throw new Error('Empty response from API');
      }
  
      return data;
    } catch (error) {
      console.error('Error fetching air quality data:', error);
      throw error; // Re-throw the error so it can be handled by the caller
    }
  };
  