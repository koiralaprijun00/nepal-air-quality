// src/app/api/air-quality/route.ts
import { NextResponse } from 'next/server';

// Sample mock data to use when the API isn't available
const createMockData = (lat: string, lon: string) => {
  return {
    lat,
    lon,
    elevation: 1337,
    timezone: "Asia/Kathmandu",
    data: [
      {
        date: new Date().toISOString().split('T')[0],
        air_quality: 75,
        co_surface: 480,
        pm10: 45,
        pm25: 23,
        so2_surface: 1.8
      },
      {
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        air_quality: 82,
        co_surface: 510,
        pm10: 48,
        pm25: 26,
        so2_surface: 2.1
      },
      {
        date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
        air_quality: 68,
        co_surface: 450,
        pm10: 42,
        pm25: 20,
        so2_surface: 1.5
      },
      {
        date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
        air_quality: 72,
        co_surface: 465,
        pm10: 44,
        pm25: 22,
        so2_surface: 1.6
      },
      {
        date: new Date(Date.now() - 345600000).toISOString().split('T')[0],
        air_quality: 65,
        co_surface: 430,
        pm10: 40,
        pm25: 19,
        so2_surface: 1.4
      }
    ]
  };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  console.log(`API Route called with lat=${lat}, lon=${lon}`);

  if (!lat || !lon) {
    return NextResponse.json({ message: 'Missing lat or lon parameters' }, { status: 400 });
  }

  // Using the real API now
  const API_KEY = process.env.NEXT_PUBLIC_METEOSOURCE_API_KEY;
  const BASE_URL = process.env.NEXT_PUBLIC_METEOSOURCE_BASE_URL;
  
  if (!API_KEY || !BASE_URL) {
    console.error('Missing API key or base URL in environment variables');
    return NextResponse.json(createMockData(lat, lon));
  }

  const apiUrl = `${BASE_URL}/free/air_quality?lat=${lat}&lon=${lon}&key=${API_KEY}`;
  
  try {
    console.log('Requesting from Meteosource API...'); 
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.error('API Error:', response.status);
      return NextResponse.json(createMockData(lat, lon));
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    return NextResponse.json(createMockData(lat, lon));
  }
}