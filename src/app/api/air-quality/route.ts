// src/app/api/air-quality/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  console.log(`API Route called with lat=${lat}, lon=${lon}`);

  if (!lat || !lon) {
    return NextResponse.json({ message: 'Missing lat or lon parameters' }, { status: 400 });
  }

  const API_KEY = process.env.OPENWEATHER_API_KEY || process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const BASE_URL = process.env.OPENWEATHER_BASE_URL || process.env.NEXT_PUBLIC_OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';

  if (!API_KEY) {
    console.error('Missing API key in environment variables');
    return NextResponse.json({ message: 'Server configuration error: Missing API key' }, { status: 500 });
  }

  // Endpoints for different types of air pollution data
  const endpoints = {
    current: `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
    historical: `${BASE_URL}/air_pollution/history?lat=${lat}&lon=${lon}&start=${Math.floor(Date.now()/1000) - 432000}&end=${Math.floor(Date.now()/1000)}&appid=${API_KEY}`
  };
  
  try {
    console.log('Requesting from OpenWeather API - Air Pollution Endpoint'); 
    console.log('Endpoint:', endpoints.current);
    
    // Fetch current air pollution data
    const currentResponse = await fetch(endpoints.current, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });

    console.log('Current Response Status:', currentResponse.status);
    
    if (!currentResponse.ok) {
      const errorText = await currentResponse.text().catch(() => 'No error details');
      console.error('API Error:', currentResponse.status, errorText);
      return NextResponse.json(
        { 
          message: `OpenWeather API error: ${currentResponse.status} ${currentResponse.statusText}`,
          details: errorText
        }, 
        { status: currentResponse.status }
      );
    }

    const currentData = await currentResponse.json();
    console.log('Air Pollution Data:', JSON.stringify(currentData).substring(0, 300) + '...');
    
    // Validate the data structure
    if (!currentData.list || !Array.isArray(currentData.list) || currentData.list.length === 0) {
      console.error('Unexpected current data structure:', currentData);
      return NextResponse.json(
        { message: 'Invalid response from OpenWeather API: Current data missing or malformed' }, 
        { status: 500 }
      );
    }

    // Try to fetch historical data
    let historicalData = { list: [] };
    try {
      const historicalResponse = await fetch(endpoints.historical, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });

      console.log('Historical Response Status:', historicalResponse.status);
      
      if (historicalResponse.ok) {
        historicalData = await historicalResponse.json();
        console.log('Historical data points:', historicalData.list?.length || 0);
      } else {
        console.warn('Could not retrieve historical data');
      }
    } catch (histErr) {
      console.warn('Error fetching historical data:', histErr);
    }

    // Transform the data
    const transformedData = {
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      timezone: "UTC", 
      current: currentData.list[0],
      data: (historicalData.list || []).map((item: any) => ({
        date: new Date(item.dt * 1000).toISOString(),
        air_quality: item.main?.aqi || 0,
        co_surface: item.components?.co || 0,
        pm10: item.components?.pm10 || 0,
        pm25: item.components?.pm2_5 || 0,
        so2_surface: item.components?.so2 || 0,
        no2_surface: item.components?.no2 || 0,
        o3_surface: item.components?.o3 || 0,
        nh3_surface: item.components?.nh3 || 0
      })).filter((item: any) => item.air_quality > 0)
    };

    return NextResponse.json(transformedData, {
      headers: { 'Cache-Control': 'public, max-age=3600' }
    });
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    return NextResponse.json(
      { message: 'Failed to fetch data from OpenWeather API', error: String(error) }, 
      { status: 500 }
    );
  }
}