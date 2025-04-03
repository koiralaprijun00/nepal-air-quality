import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  console.log(`API Route called with lat=${lat}, lon=${lon}`);

  if (!lat || !lon) {
    return NextResponse.json({ message: 'Missing lat or lon parameters' }, { status: 400 });
  }

  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const BASE_URL = process.env.NEXT_PUBLIC_OPENWEATHER_BASE_URL;

  if (!API_KEY || !BASE_URL) {
    console.error('Missing API key or base URL in environment variables');
    return NextResponse.json({ message: 'Server configuration error: Missing API credentials' }, { status: 500 });
  }

  // Endpoints for different types of air pollution data
  const endpoints = {
    current: `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
    forecast: `${BASE_URL}/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
    // For historical data, we need start and end timestamps
    // Using last 5 days for demo purposes
    historical: `${BASE_URL}/air_pollution/history?lat=${lat}&lon=${lon}&start=${Math.floor(Date.now()/1000) - 432000}&end=${Math.floor(Date.now()/1000)}&appid=${API_KEY}`
  };
  
  try {
    console.log('Requesting from OpenWeather API - Current Data'); 

    
    
    // Fetch current and historical data
    const [currentResponse, historicalResponse] = await Promise.all([
      fetch(endpoints.current, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 }
      }),
      fetch(endpoints.historical, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 }
      })
    ]);

    console.log('Current Response Status:', currentResponse.status);
    console.log('Historical Response Status:', historicalResponse.status);

    if (!currentResponse.ok || !historicalResponse.ok) {
      const failedResponse = !currentResponse.ok ? currentResponse : historicalResponse;
      const errorText = await failedResponse.text().catch(() => 'No error details');
      console.error('API Error:', failedResponse.status, errorText);
      return NextResponse.json(
        { 
          message: `OpenWeather API error: ${failedResponse.status} ${failedResponse.statusText}`,
          details: errorText
        }, 
        { status: failedResponse.status }
      );
    }

    const [currentData, historicalData] = await Promise.all([
      currentResponse.json(),
      historicalResponse.json()
    ]);

    console.log('API Response Current:', JSON.stringify(currentData));
    console.log('API Response Historical: Number of data points:', historicalData.list?.length || 0);

    // Validate the data structure to ensure it matches what we expect
    if (!currentData.list || !Array.isArray(currentData.list) || currentData.list.length === 0) {
      console.error('Unexpected current data structure:', currentData);
      return NextResponse.json(
        { message: 'Invalid response from OpenWeather API: Current data missing or malformed' }, 
        { status: 500 }
      );
    }

    if (!historicalData.list || !Array.isArray(historicalData.list)) {
      console.error('Unexpected historical data structure:', historicalData);
      return NextResponse.json(
        { message: 'Invalid response from OpenWeather API: Historical data missing or malformed' }, 
        { status: 500 }
      );
    }

    // Transform the data to a consistent format
    const transformedData = {
      lat: lat,
      lon: lon,
      elevation: 0, // OpenWeather doesn't provide elevation
      timezone: "UTC", // OpenWeather doesn't provide timezone
      current: currentData.list[0], // Current air quality
      data: historicalData.list.map((item: any) => ({
        date: new Date(item.dt * 1000).toISOString(),
        air_quality: item.main?.aqi || 0,
        co_surface: item.components?.co || 0,
        pm10: item.components?.pm10 || 0,
        pm25: item.components?.pm2_5 || 0,
        so2_surface: item.components?.so2 || 0,
        no2_surface: item.components?.no2 || 0,
        o3_surface: item.components?.o3 || 0,
        nh3_surface: item.components?.nh3 || 0
      })).filter((item: any) => item.air_quality > 0) // Filter out invalid entries
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