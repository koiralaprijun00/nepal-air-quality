// src/services/usEpaAqiCalculator.ts

/**
 * Calculates the US EPA Air Quality Index (AQI) based on pollutant concentrations
 * Using the formula: AQI = ((Ihigh - Ilow) / (Chigh - Clow)) * (C - Clow) + Ilow
 * where:
 * - C is the pollutant concentration
 * - Clow is the concentration breakpoint that is ≤ C
 * - Chigh is the concentration breakpoint that is ≥ C
 * - Ilow is the index breakpoint corresponding to Clow
 * - Ihigh is the index breakpoint corresponding to Chigh
 */

// EPA AQI Breakpoints for each pollutant
interface AqiBreakpoint {
    Clow: number;
    Chigh: number;
    Ilow: number;
    Ihigh: number;
  }
  
  interface PollutantBreakpoints {
    [key: string]: AqiBreakpoint[];
  }
  
  // EPA AQI breakpoints for common pollutants (concentrations in μg/m³)
  const aqiBreakpoints: PollutantBreakpoints = {
    // PM2.5 (24-hour average) in μg/m³
    pm2_5: [
      { Clow: 0.0, Chigh: 12.0, Ilow: 0, Ihigh: 50 },
      { Clow: 12.1, Chigh: 35.4, Ilow: 51, Ihigh: 100 },
      { Clow: 35.5, Chigh: 55.4, Ilow: 101, Ihigh: 150 },
      { Clow: 55.5, Chigh: 150.4, Ilow: 151, Ihigh: 200 },
      { Clow: 150.5, Chigh: 250.4, Ilow: 201, Ihigh: 300 },
      { Clow: 250.5, Chigh: 350.4, Ilow: 301, Ihigh: 400 },
      { Clow: 350.5, Chigh: 500.4, Ilow: 401, Ihigh: 500 }
    ],
    
    // PM10 (24-hour average) in μg/m³
    pm10: [
      { Clow: 0, Chigh: 54, Ilow: 0, Ihigh: 50 },
      { Clow: 55, Chigh: 154, Ilow: 51, Ihigh: 100 },
      { Clow: 155, Chigh: 254, Ilow: 101, Ihigh: 150 },
      { Clow: 255, Chigh: 354, Ilow: 151, Ihigh: 200 },
      { Clow: 355, Chigh: 424, Ilow: 201, Ihigh: 300 },
      { Clow: 425, Chigh: 504, Ilow: 301, Ihigh: 400 },
      { Clow: 505, Chigh: 604, Ilow: 401, Ihigh: 500 }
    ],
    
    // O3 (8-hour average) in μg/m³ - converted from ppb
    o3: [
      { Clow: 0, Chigh: 108, Ilow: 0, Ihigh: 50 },
      { Clow: 109, Chigh: 140, Ilow: 51, Ihigh: 100 },
      { Clow: 141, Chigh: 170, Ilow: 101, Ihigh: 150 },
      { Clow: 171, Chigh: 210, Ilow: 151, Ihigh: 200 },
      { Clow: 211, Chigh: 400, Ilow: 201, Ihigh: 300 }
    ],
    
    // NO2 (1-hour average) in μg/m³ - converted from ppb
    no2: [
      { Clow: 0, Chigh: 100, Ilow: 0, Ihigh: 50 },
      { Clow: 101, Chigh: 188, Ilow: 51, Ihigh: 100 },
      { Clow: 189, Chigh: 677, Ilow: 101, Ihigh: 150 },
      { Clow: 678, Chigh: 1220, Ilow: 151, Ihigh: 200 },
      { Clow: 1221, Chigh: 2350, Ilow: 201, Ihigh: 300 },
      { Clow: 2351, Chigh: 3100, Ilow: 301, Ihigh: 400 },
      { Clow: 3101, Chigh: 3850, Ilow: 401, Ihigh: 500 }
    ],
    
    // SO2 (1-hour average) in μg/m³ - converted from ppb
    so2: [
      { Clow: 0, Chigh: 91, Ilow: 0, Ihigh: 50 },
      { Clow: 92, Chigh: 196, Ilow: 51, Ihigh: 100 },
      { Clow: 197, Chigh: 484, Ilow: 101, Ihigh: 150 },
      { Clow: 485, Chigh: 796, Ilow: 151, Ihigh: 200 },
      { Clow: 797, Chigh: 1583, Ilow: 201, Ihigh: 300 },
      { Clow: 1584, Chigh: 2104, Ilow: 301, Ihigh: 400 },
      { Clow: 2105, Chigh: 2630, Ilow: 401, Ihigh: 500 }
    ],
    
    // CO (8-hour average) in μg/m³ - converted from ppm
    co: [
      { Clow: 0, Chigh: 5000, Ilow: 0, Ihigh: 50 },
      { Clow: 5001, Chigh: 10000, Ilow: 51, Ihigh: 100 },
      { Clow: 10001, Chigh: 14000, Ilow: 101, Ihigh: 150 },
      { Clow: 14001, Chigh: 17000, Ilow: 151, Ihigh: 200 },
      { Clow: 17001, Chigh: 34000, Ilow: 201, Ihigh: 300 },
      { Clow: 34001, Chigh: 46000, Ilow: 301, Ihigh: 400 },
      { Clow: 46001, Chigh: 57500, Ilow: 401, Ihigh: 500 }
    ]
  };
  
  /**
   * Calculate AQI for a specific pollutant using the EPA formula
   * @param pollutant The pollutant key (pm2_5, pm10, o3, etc.)
   * @param concentration The concentration value in μg/m³
   * @returns The calculated AQI value
   */
  export const calculatePollutantAqi = (pollutant: string, concentration: number): number => {
    // Map OpenWeather API keys to our breakpoint keys
    const pollutantKey = pollutant === 'pm2_5' ? 'pm2_5' : pollutant;
    
    const breakpoints = aqiBreakpoints[pollutantKey];
    if (!breakpoints) {
      console.warn(`No breakpoints defined for pollutant: ${pollutant}`);
      return 0;
    }
  
    // If concentration is below the lowest breakpoint
    if (concentration <= breakpoints[0].Clow) {
      return 0;
    }
    
    // If concentration is above the highest breakpoint
    const lastIndex = breakpoints.length - 1;
    if (concentration >= breakpoints[lastIndex].Chigh) {
      return breakpoints[lastIndex].Ihigh;
    }
    
    // Find the appropriate breakpoint bracket
    for (const bp of breakpoints) {
      if (concentration >= bp.Clow && concentration <= bp.Chigh) {
        // Apply the AQI formula
        return Math.round(
          ((bp.Ihigh - bp.Ilow) / (bp.Chigh - bp.Clow)) * 
          (concentration - bp.Clow) + 
          bp.Ilow
        );
      }
    }
    
    return 0;
  };
  
  /**
   * Calculate overall US EPA AQI from OpenWeather API components
   * The overall AQI is the highest individual AQI value among all pollutants
   * @param components The components object from OpenWeather API
   * @returns Object containing overall AQI value and dominant pollutant
   */
  export const calculateOverallAqi = (components: Record<string, number>): { 
    aqi: number; 
    dominantPollutant: string;
    pollutantAqis: Record<string, number>;
  } => {
    const pollutantAqis: Record<string, number> = {};
    let maxAqi = 0;
    let dominantPollutant = '';
    
    // Map from OpenWeather component names to our breakpoint keys
    const pollutantMap: Record<string, string> = {
      pm2_5: 'pm2_5',
      pm10: 'pm10',
      o3: 'o3',
      no2: 'no2',
      so2: 'so2',
      co: 'co'
    };
    
    // Calculate AQI for each available pollutant
    for (const [key, value] of Object.entries(components)) {
      const mappedKey = pollutantMap[key];
      
      // Skip pollutants we don't have breakpoints for (like NH3 and NO)
      if (!mappedKey || !aqiBreakpoints[mappedKey]) continue;
      
      const aqi = calculatePollutantAqi(mappedKey, value);
      pollutantAqis[key] = aqi;
      
      // Keep track of the highest AQI and its pollutant
      if (aqi > maxAqi) {
        maxAqi = aqi;
        dominantPollutant = key;
      }
    }
    
    return {
      aqi: maxAqi,
      dominantPollutant,
      pollutantAqis
    };
  };
  
  /**
   * Get AQI category and corresponding color based on AQI value
   * @param aqi The AQI value
   * @returns Object with category label and CSS color class
   */
  export const getAqiCategory = (aqi: number): { label: string; color: string; description: string } => {
    if (aqi <= 50) {
      return { 
        label: 'Good', 
        color: 'bg-green-500 text-white',
        description: 'Air quality is satisfactory, and air pollution poses little or no risk.'
      };
    }
    if (aqi <= 100) {
      return { 
        label: 'Moderate', 
        color: 'bg-yellow-400 text-black',
        description: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.'
      };
    }
    if (aqi <= 150) {
      return { 
        label: 'Unhealthy for Sensitive Groups', 
        color: 'bg-orange-400 text-white',
        description: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.'
      };
    }
    if (aqi <= 200) {
      return { 
        label: 'Unhealthy', 
        color: 'bg-red-500 text-white',
        description: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.'
      };
    }
    if (aqi <= 300) {
      return { 
        label: 'Very Unhealthy', 
        color: 'bg-purple-600 text-white',
        description: 'Health alert: The risk of health effects is increased for everyone.'
      };
    }
    
    return { 
      label: 'Hazardous', 
      color: 'bg-red-900 text-white',
      description: 'Health warning of emergency conditions: everyone is more likely to be affected.'
    };
  };