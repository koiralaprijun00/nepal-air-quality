// services/airQualityService.ts

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
  
  interface AirQualityPoint {
    dt: number;
    main: {
      aqi: number;
    };
    components: AirQualityComponent;
  }
  
  interface AirQualityData {
    lat: string;
    lon: string;
    elevation: number;
    timezone: string;
    current: AirQualityPoint;
    data: Array<{
      date: string;
      air_quality: number;
      co_surface: number;
      pm10: number;
      pm25: number;
      so2_surface: number;
      no2_surface: number;
      o3_surface: number;
      nh3_surface: number;
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
  
  // Convert AQI to descriptive categories based on OpenWeather documentation
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
  
  // Convert AQI to color for visualization
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