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

interface AqiResult {
  aqi: number;
  category: string;
  color: string;
}

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
  export const calculatePollutantAqi = (pollutant: string, concentration: number): AqiResult => {
    // AQI breakpoints and corresponding concentrations for different pollutants
    const breakpoints: Record<string, number[][]> = {
      pm2_5: [
        [0, 12, 0, 50],
        [12.1, 35.4, 51, 100],
        [35.5, 55.4, 101, 150],
        [55.5, 150.4, 151, 200],
        [150.5, 250.4, 201, 300],
        [250.5, 350.4, 301, 400],
        [350.5, 500.4, 401, 500],
      ],
      pm10: [
        [0, 54, 0, 50],
        [55, 154, 51, 100],
        [155, 254, 101, 150],
        [255, 354, 151, 200],
        [355, 424, 201, 300],
        [425, 504, 301, 400],
        [505, 604, 401, 500],
      ],
      co: [
        [0, 4.4, 0, 50],
        [4.5, 9.4, 51, 100],
        [9.5, 12.4, 101, 150],
        [12.5, 15.4, 151, 200],
        [15.5, 30.4, 201, 300],
        [30.5, 40.4, 301, 400],
        [40.5, 50.4, 401, 500],
      ],
      no2: [
        [0, 53, 0, 50],
        [54, 100, 51, 100],
        [101, 360, 101, 150],
        [361, 649, 151, 200],
        [650, 1249, 201, 300],
        [1250, 1649, 301, 400],
        [1650, 2049, 401, 500],
      ],
      o3: [
        [0, 54, 0, 50],
        [55, 70, 51, 100],
        [71, 85, 101, 150],
        [86, 105, 151, 200],
        [106, 200, 201, 300],
      ],
      so2: [
        [0, 35, 0, 50],
        [36, 75, 51, 100],
        [76, 185, 101, 150],
        [186, 304, 151, 200],
        [305, 604, 201, 300],
        [605, 804, 301, 400],
        [805, 1004, 401, 500],
      ],
    };

    const pollutantBreakpoints = breakpoints[pollutant] || breakpoints.pm2_5;
    const breakpoint = pollutantBreakpoints.find(
      ([low, high]) => concentration >= low && concentration <= high
    );

    if (!breakpoint) {
      return {
        aqi: 500,
        category: 'Hazardous',
        color: '#660066',
      };
    }

    const [cLow, cHigh, aqiLow, aqiHigh] = breakpoint;
    const aqi = Math.round(
      ((aqiHigh - aqiLow) / (cHigh - cLow)) * (concentration - cLow) + aqiLow
    );

    const { category, color } = getAqiCategory(aqi);

    return {
      aqi,
      category,
      color,
    };
  };
  
  /**
   * Calculate overall US EPA AQI from OpenWeather API components
   * The overall AQI is the highest individual AQI value among all pollutants
   * @param components The components object from OpenWeather API
   * @returns Object containing overall AQI value and dominant pollutant
   */
  export const calculateOverallAqi = (components: Record<string, number>): AqiResult => {
    // Calculate individual AQIs for each pollutant
    const aqis = Object.entries(components).map(([pollutant, concentration]) => {
      return calculatePollutantAqi(pollutant, concentration);
    });

    // Return the highest AQI value
    const maxAqi = Math.max(...aqis.map(aqi => aqi.aqi));

    // Get the corresponding category and color
    const { category, color } = getAqiCategory(maxAqi);

    return {
      aqi: maxAqi,
      category,
      color,
    };
  };
  
  /**
   * Get AQI category and corresponding color based on AQI value
   * @param aqi The AQI value
   * @returns Object with category label and CSS color class
   */
  export const getAqiCategory = (aqi: number): { category: string; color: string } => {
    if (aqi <= 50) return { category: 'Good', color: '#00ff00' };
    if (aqi <= 100) return { category: 'Moderate', color: '#ffff00' };
    if (aqi <= 150) return { category: 'Unhealthy for Sensitive Groups', color: '#ff9900' };
    if (aqi <= 200) return { category: 'Unhealthy', color: '#ff0000' };
    if (aqi <= 300) return { category: 'Very Unhealthy', color: '#990099' };
    return { category: 'Hazardous', color: '#660066' };
  };