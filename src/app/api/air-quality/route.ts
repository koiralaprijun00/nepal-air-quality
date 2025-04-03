import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  console.log(`API Route called with lat=${lat}, lon=${lon}`);

  if (!lat || !lon) {
    return NextResponse.json({ message: 'Missing lat or lon parameters' }, { status: 400 });
  }

  const API_KEY = process.env.NEXT_PUBLIC_METEOSOURCE_API_KEY;
  const BASE_URL = process.env.NEXT_PUBLIC_METEOSOURCE_BASE_URL;

  if (!API_KEY || !BASE_URL) {
    console.error('Missing API key or base URL in environment variables');
    return NextResponse.json({ message: 'Server configuration error: Missing API credentials' }, { status: 500 });
  }

  const apiUrl = `${BASE_URL}/free/point?lat=${lat}&lon=${lon}&sections=all&key=${API_KEY}`;
  
  try {
    console.log('Requesting from Meteosource API:', apiUrl); 
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details');
      console.error('API Error:', response.status, errorText);
      return NextResponse.json(
        { 
          message: `External API error: ${response.status} ${response.statusText}`,
          details: errorText
        }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('API Response:', data);

    const expires = response.headers.get('Expires');
    if (expires) {
      const cacheDuration = Math.max(
        (new Date(expires).getTime() - Date.now()) / 1000,
        3600
      );
      return NextResponse.json(data, {
        headers: { 'Cache-Control': `public, max-age=${cacheDuration}` }
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    return NextResponse.json(
      { message: 'Failed to fetch data from external API', error: String(error) }, 
      { status: 500 }
    );
  }
}