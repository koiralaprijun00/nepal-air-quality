import { NextResponse } from 'next/server';
import { calculateOverallAqi } from '@/services/AqiCalculator';

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const MAJOR_CITIES = [
  { name: 'Delhi', country: 'IN', lat: 28.6139, lon: 77.2090 },
  { name: 'Wuhan', country: 'CN', lat: 30.5928, lon: 114.3055 },
  { name: 'Karachi', country: 'PK', lat: 24.8607, lon: 67.0011 },
  { name: 'Dhaka', country: 'BD', lat: 23.8103, lon: 90.4125 },
  { name: 'Phnom Penh', country: 'KH', lat: 11.5564, lon: 104.9282 },
  { name: 'Kolkata', country: 'IN', lat: 22.5726, lon: 88.3639 },
  { name: 'Dakar', country: 'SN', lat: 14.7167, lon: -17.4677 },
  { name: 'Riyadh', country: 'SA', lat: 24.7136, lon: 46.6753 },
  { name: 'Beijing', country: 'CN', lat: 39.9042, lon: 116.4074 },
  { name: 'Auckland', country: 'NZ', lat: -36.8485, lon: 174.7633 },
  { name: 'Honolulu', country: 'US', lat: 21.3069, lon: -157.8583 },
  { name: 'Zurich', country: 'CH', lat: 47.3769, lon: 8.5417 },
  { name: 'Stockholm', country: 'SE', lat: 59.3293, lon: 18.0686 },
  { name: 'Wellington', country: 'NZ', lat: -41.2866, lon: 174.7756 }
];

const COUNTRY_NAMES: { [key: string]: string } = {
  'IN': 'India',
  'CN': 'China',
  'PK': 'Pakistan',
  'BD': 'Bangladesh',
  'KH': 'Cambodia',
  'SN': 'Senegal',
  'SA': 'Saudi Arabia',
  'NZ': 'New Zealand',
  'US': 'USA',
  'CH': 'Switzerland',
  'SE': 'Sweden'
};

export async function GET() {
  try {
    if (!OPENWEATHER_API_KEY) {
      throw new Error('OPENWEATHER_API_KEY is not configured');
    }

    // Fetch data for all cities in parallel
    const citiesData = await Promise.all(
      MAJOR_CITIES.map(async (city) => {
        try {
          const response = await fetch(
            `http://api.openweathermap.org/data/2.5/air_pollution?lat=${city.lat}&lon=${city.lon}&appid=${OPENWEATHER_API_KEY}`
          );

          if (!response.ok) {
            console.error(`Failed to fetch data for ${city.name}: ${response.statusText}`);
            return null;
          }

          const data = await response.json();
          const { aqi } = calculateOverallAqi(data.list[0].components);

          return {
            name: city.name,
            country: COUNTRY_NAMES[city.country] || city.country,
            aqi: aqi,
            components: data.list[0].components
          };
        } catch (error) {
          console.error(`Error fetching data for ${city.name}:`, error);
          return null;
        }
      })
    );

    // Filter out failed requests and sort by AQI
    const validCitiesData = citiesData
      .filter((city): city is NonNullable<typeof city> => city !== null)
      .sort((a, b) => b.aqi - a.aqi);

    return NextResponse.json(validCitiesData);
  } catch (error) {
    console.error('Error in world-cities API:', error);
    return NextResponse.json({ error: 'Failed to fetch world cities data' }, { status: 500 });
  }
} 