// app/api/air-quality/route.ts (or pages/api/air-quality.ts)
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  const apiUrl = `https://www.meteosource.com/api/v1/free/air_quality?lat=${lat}&lon=${lon}`;
  
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.METEOSOURCE_API_KEY}`, // Make sure the API key is correct
      },
    });

    console.log('Response from external API:', response); // Log the raw response
    // Check if the external API returned a successful response
    if (!response.ok) {
      return NextResponse.error();
    }

    const data = await response.json();
    console.log('Parsed Data from external API:', data); // Log the parsed JSON data

    // If the data is empty or malformed, return an error
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ message: 'No data available' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
