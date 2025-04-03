// src/services/airQualityService.ts

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