// src/services/overallAqiUtils.ts

interface AqiBreakpoint {
    pollutant: string;
    unit: string;
    breakpoints: { Clow: number; Chigh: number; Ilow: number; Ihigh: number }[];
  }

  interface PollutantLevel {
    label: string;
    range: string;
  }
  
  export const getPollutantLevel = (pollutant: string, value: number): PollutantLevel => {
    switch (pollutant) {
      case 'co':
        if (value < 4400) return { label: 'Good', range: '0–4400 μg/m³' };
        if (value < 9400) return { label: 'Fair', range: '4400–9400 μg/m³' };
        if (value < 12400) return { label: 'Moderate', range: '9400–12400 μg/m³' };
        if (value < 15400) return { label: 'Poor', range: '12400–15400 μg/m³' };
        return { label: 'Very Poor', range: '15400+ μg/m³' };
      case 'no':
        if (value < 1) return { label: 'Good', range: '0.1–1 μg/m³' };
        if (value < 10) return { label: 'Fair', range: '1–10 μg/m³' };
        if (value < 50) return { label: 'Moderate', range: '10–50 μg/m³' };
        return { label: 'Poor', range: '50+ μg/m³' };
      case 'no2':
        if (value < 40) return { label: 'Good', range: '0–40 μg/m³' };
        if (value < 70) return { label: 'Fair', range: '40–70 μg/m³' };
        if (value < 150) return { label: 'Moderate', range: '70–150 μg/m³' };
        if (value < 200) return { label: 'Poor', range: '150–200 μg/m³' };
        return { label: 'Very Poor', range: '200+ μg/m³' };
      case 'o3':
        if (value < 60) return { label: 'Good', range: '0–60 μg/m³' };
        if (value < 100) return { label: 'Fair', range: '60–100 μg/m³' };
        if (value < 140) return { label: 'Moderate', range: '100–140 μg/m³' };
        if (value < 180) return { label: 'Poor', range: '140–180 μg/m³' };
        return { label: 'Very Poor', range: '180+ μg/m³' };
      case 'so2':
        if (value < 20) return { label: 'Good', range: '0–20 μg/m³' };
        if (value < 80) return { label: 'Fair', range: '20–80 μg/m³' };
        if (value < 250) return { label: 'Moderate', range: '80–250 μg/m³' };
        if (value < 350) return { label: 'Poor', range: '250–350 μg/m³' };
        return { label: 'Very Poor', range: '350+ μg/m³' };
      case 'pm2_5':
        if (value < 10) return { label: 'Good', range: '0–10 μg/m³' };
        if (value < 25) return { label: 'Fair', range: '10–25 μg/m³' };
        if (value < 50) return { label: 'Moderate', range: '25–50 μg/m³' };
        if (value < 75) return { label: 'Poor', range: '50–75 μg/m³' };
        return { label: 'Very Poor', range: '75+ μg/m³' };
      case 'pm10':
        if (value < 20) return { label: 'Good', range: '0–20 μg/m³' };
        if (value < 50) return { label: 'Fair', range: '20–50 μg/m³' };
        if (value < 100) return { label: 'Moderate', range: '50–100 μg/m³' };
        if (value < 200) return { label: 'Poor', range: '100–200 μg/m³' };
        return { label: 'Very Poor', range: '200+ μg/m³' };
      case 'nh3':
        if (value < 1) return { label: 'Good', range: '0.1–1 μg/m³' };
        if (value < 10) return { label: 'Fair', range: '1–10 μg/m³' };
        if (value < 50) return { label: 'Moderate', range: '10–50 μg/m³' };
        if (value < 100) return { label: 'Poor', range: '50–100 μg/m³' };
        return { label: 'Very Poor', range: '100+ μg/m³' };
      default:
        return { label: 'Unknown', range: '' };
    }
  };
  
  
  const breakpointsMap: Record<string, AqiBreakpoint> = {
    pm2_5: {
      pollutant: 'PM2.5',
      unit: 'μg/m³',
      breakpoints: [
        { Clow: 0.0, Chigh: 12.0, Ilow: 0, Ihigh: 50 },
        { Clow: 12.1, Chigh: 35.4, Ilow: 51, Ihigh: 100 },
        { Clow: 35.5, Chigh: 55.4, Ilow: 101, Ihigh: 150 },
        { Clow: 55.5, Chigh: 150.4, Ilow: 151, Ihigh: 200 },
        { Clow: 150.5, Chigh: 250.4, Ilow: 201, Ihigh: 300 },
        { Clow: 250.5, Chigh: 350.4, Ilow: 301, Ihigh: 400 },
        { Clow: 350.5, Chigh: 500.4, Ilow: 401, Ihigh: 500 },
      ],
    },
    pm10: {
      pollutant: 'PM10',
      unit: 'μg/m³',
      breakpoints: [
        { Clow: 0, Chigh: 54, Ilow: 0, Ihigh: 50 },
        { Clow: 55, Chigh: 154, Ilow: 51, Ihigh: 100 },
        { Clow: 155, Chigh: 254, Ilow: 101, Ihigh: 150 },
        { Clow: 255, Chigh: 354, Ilow: 151, Ihigh: 200 },
        { Clow: 355, Chigh: 424, Ilow: 201, Ihigh: 300 },
        { Clow: 425, Chigh: 504, Ilow: 301, Ihigh: 400 },
        { Clow: 505, Chigh: 604, Ilow: 401, Ihigh: 500 },
      ],
    },
    o3: {
      pollutant: 'O3',
      unit: 'ppb',
      breakpoints: [
        { Clow: 0, Chigh: 54, Ilow: 0, Ihigh: 50 },
        { Clow: 55, Chigh: 70, Ilow: 51, Ihigh: 100 },
        { Clow: 71, Chigh: 85, Ilow: 101, Ihigh: 150 },
        { Clow: 86, Chigh: 105, Ilow: 151, Ihigh: 200 },
        { Clow: 106, Chigh: 200, Ilow: 201, Ihigh: 300 },
      ],
    },
    no2: {
      pollutant: 'NO2',
      unit: 'ppb',
      breakpoints: [
        { Clow: 0, Chigh: 53, Ilow: 0, Ihigh: 50 },
        { Clow: 54, Chigh: 100, Ilow: 51, Ihigh: 100 },
        { Clow: 101, Chigh: 360, Ilow: 101, Ihigh: 150 },
        { Clow: 361, Chigh: 649, Ilow: 151, Ihigh: 200 },
        { Clow: 650, Chigh: 1249, Ilow: 201, Ihigh: 300 },
        { Clow: 1250, Chigh: 1649, Ilow: 301, Ihigh: 400 },
        { Clow: 1650, Chigh: 2049, Ilow: 401, Ihigh: 500 },
      ],
    },
    so2: {
      pollutant: 'SO2',
      unit: 'ppb',
      breakpoints: [
        { Clow: 0, Chigh: 35, Ilow: 0, Ihigh: 50 },
        { Clow: 36, Chigh: 75, Ilow: 51, Ihigh: 100 },
        { Clow: 76, Chigh: 185, Ilow: 101, Ihigh: 150 },
        { Clow: 186, Chigh: 304, Ilow: 151, Ihigh: 200 },
        { Clow: 305, Chigh: 604, Ilow: 201, Ihigh: 300 },
        { Clow: 605, Chigh: 804, Ilow: 301, Ihigh: 400 },
        { Clow: 805, Chigh: 1004, Ilow: 401, Ihigh: 500 },
      ],
    },
    co: {
      pollutant: 'CO',
      unit: 'ppm',
      breakpoints: [
        { Clow: 0.0, Chigh: 4.4, Ilow: 0, Ihigh: 50 },
        { Clow: 4.5, Chigh: 9.4, Ilow: 51, Ihigh: 100 },
        { Clow: 9.5, Chigh: 12.4, Ilow: 101, Ihigh: 150 },
        { Clow: 12.5, Chigh: 15.4, Ilow: 151, Ihigh: 200 },
        { Clow: 15.5, Chigh: 30.4, Ilow: 201, Ihigh: 300 },
        { Clow: 30.5, Chigh: 40.4, Ilow: 301, Ihigh: 400 },
        { Clow: 40.5, Chigh: 50.4, Ilow: 401, Ihigh: 500 },
      ],
    },
  };
  
  export const getAqiCategoryColor = (aqi: number): { label: string; color: string } => {
    if (aqi <= 50) return { label: 'Good', color: 'bg-green-500 text-white' };
    if (aqi <= 100) return { label: 'Moderate', color: 'bg-yellow-400 text-black' };
    if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: 'bg-orange-400 text-white' };
    if (aqi <= 200) return { label: 'Unhealthy', color: 'bg-red-500 text-white' };
    if (aqi <= 300) return { label: 'Very Unhealthy', color: 'bg-purple-600 text-white' };
    return { label: 'Hazardous', color: 'bg-maroon-700 text-white' };
  };
