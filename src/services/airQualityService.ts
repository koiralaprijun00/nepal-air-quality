// services/airQualityService.ts

interface AirQualityData {
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
  
  export const getAirQualityData = async (lat: number, lon: number): Promise<AirQualityData> => {
    try {
      console.log('Sending request to API endpoint...');
      const response = await fetch(`/api/air-quality?lat=${lat}&lon=${lon}`);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `API response error: ${response.status} ${response.statusText}. ${errorData.message || ''}`
        );
      }
    
      const data = await response.json();
      
      if (!data || Object.keys(data).length === 0) {
        throw new Error('Empty response from API');
      }
    
      return data;
    } catch (error) {
      console.error('Error fetching air quality data:', error);
      throw error;
    }
  };