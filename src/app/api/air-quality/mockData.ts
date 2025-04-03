// src/app/api/air-quality/mockData.ts

export const mockAirQualityData = {
    lat: "27.70169",
    lon: "85.3206",
    elevation: 1337,
    timezone: "Asia/Kathmandu",
    data: [
      {
        date: "2025-04-03",
        air_quality: 62,
        co_surface: 420,
        pm10: 38,
        pm25: 18,
        so2_surface: 1.2
      },
      {
        date: "2025-04-02",
        air_quality: 68,
        co_surface: 440,
        pm10: 42,
        pm25: 20,
        so2_surface: 1.4
      },
      {
        date: "2025-04-01",
        air_quality: 75,
        co_surface: 480,
        pm10: 45,
        pm25: 23,
        so2_surface: 1.8
      },
      {
        date: "2025-03-31",
        air_quality: 82,
        co_surface: 510,
        pm10: 48,
        pm25: 26,
        so2_surface: 2.1
      },
      {
        date: "2025-03-30",
        air_quality: 70,
        co_surface: 460,
        pm10: 43,
        pm25: 22,
        so2_surface: 1.5
      }
    ]
  };
  
  // You can use this in your route.ts by importing it:
  // import { mockAirQualityData } from './mockData';
  // and returning it if the real API fails:
  // return NextResponse.json(mockAirQualityData);