// src/services/airQualityService.ts

// OpenWeather API returns components in this format
interface AirQualityComponent {
    co: number;
    no: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    nh3: number;
  }
  
  // Single point of air quality data
  interface AirQualityPoint {
    dt?: number;
    main: {
      aqi: number;
    };
    components: AirQualityComponent;
  }
  
  // Historical data point structure
  interface HistoricalDataPoint {
    date: string;
    air_quality: number;
    co_surface: number;
    pm10: number;
    pm25: number;
    so2_surface?: number;
    no2_surface?: number;
    o3_surface?: number;
    nh3_surface?: number;
  }
  
  // Complete air quality data structure
  interface AirQualityData {
    lat: number;
    lon: number;
    elevation?: number;
    timezone?: string;
    current: AirQualityPoint;
    data: HistoricalDataPoint[];
  }
  
  /**
   * Fetches air quality data from the API
   */
  export const getAirQualityData = async (lat: number, lon: number): Promise<AirQualityData> => {
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
      console.log('Data received from API', typeof data, data ? Object.keys(data) : 'null');
      
      // Validate data
      if (!data) {
        throw new Error('Empty response from API');
      }
      
      // Additional validation and data structure checks
      if (!data.current || !data.current.main || typeof data.current.main.aqi === 'undefined') {
        console.warn('Current AQI data not available in expected format:', data);
        
        // If data exists but has invalid structure, try to fix it - the server should have returned fallback data
        if (data.current && !data.current.main && data.current.icon) {
          console.warn('Got weather data instead of air quality data, this should not happen with the updated API');
        }
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