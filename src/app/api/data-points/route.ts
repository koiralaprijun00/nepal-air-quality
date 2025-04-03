import { NextResponse } from 'next/server';

const API_KEY = process.env.OPENWEATHER_API_KEY!;
const BASE_URL = process.env.OPENWEATHER_BASE_URL!;

const cities = [
    { name: 'Kathmandu', lat: 27.7172, lon: 85.3240 },
    { name: 'Pokhara', lat: 28.2096, lon: 83.9856 },
    { name: 'Lalitpur', lat: 27.6644, lon: 85.3188 },
    { name: 'Biratnagar', lat: 26.4525, lon: 87.2718 },
    { name: 'Bharatpur', lat: 27.6833, lon: 84.4333 },
    { name: 'Birgunj', lat: 27.0000, lon: 84.8667 },
    { name: 'Hetauda', lat: 27.4333, lon: 85.0333 },
    { name: 'Dharan', lat: 26.8167, lon: 87.2833 },
    { name: 'Itahari', lat: 26.6667, lon: 87.2833 },
    { name: 'Janakpur', lat: 26.7167, lon: 85.9333 },
    { name: 'Butwal', lat: 27.7000, lon: 83.4500 },
    { name: 'Nepalgunj', lat: 28.0500, lon: 81.6167 },
    { name: 'Dhangadhi', lat: 28.7000, lon: 80.6000 },
    { name: 'Ghorahi', lat: 28.0500, lon: 82.4833 },
    { name: 'Tulsipur', lat: 28.1300, lon: 82.3000 },
    { name: 'Bhaktapur', lat: 27.6722, lon: 85.4278 },
    { name: 'Bhairahawa', lat: 27.5000, lon: 83.4500 },
    { name: 'Gorkha', lat: 28.0000, lon: 84.6333 },
    { name: 'Rajbiraj', lat: 26.5333, lon: 86.7500 },
    { name: 'Kirtipur', lat: 27.6672, lon: 85.2778 },
  ];
  

export async function GET() {
  const results = await Promise.all(
    cities.map(async city => {
      try {
        const res = await fetch(
          `${BASE_URL}/air_pollution?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}`
        );
        const data = await res.json();
        return {
          name: city.name,
          coordinates: { lat: city.lat, lon: city.lon },
          sampleData: data.list,
        };
      } catch (err) {
        return {
          name: city.name,
          coordinates: { lat: city.lat, lon: city.lon },
          sampleData: [],
        };
      }
    })
  );

  return NextResponse.json(results);
}
