import { NextResponse } from 'next/server';

const API_KEY = process.env.OPENWEATHER_API_KEY!;
const BASE_URL = process.env.OPENWEATHER_BASE_URL!;

const cities = [
    { name: 'Kathmandu', lat: 27.7172, lon: 85.3240 },
    { name: 'Pokhara', lat: 28.2096, lon: 83.9856 },
    { name: 'Lalitpur', lat: 27.6717, lon: 85.3200 },
    { name: 'Biratnagar', lat: 26.4521, lon: 87.2717 },
    { name: 'Bharatpur', lat: 27.6830, lon: 84.4340 },
    { name: 'Birgunj', lat: 27.0111, lon: 84.8667 },
    { name: 'Hetauda', lat: 27.4284, lon: 85.0322 },
    { name: 'Dharan', lat: 26.8147, lon: 87.2842 },
    { name: 'Itahari', lat: 26.6567, lon: 87.2747 },
    { name: 'Janakpur', lat: 26.7288, lon: 85.9263 },
    { name: 'Butwal', lat: 27.6868, lon: 83.4323 },
    { name: 'Nepalgunj', lat: 28.0500, lon: 81.6167 },
    { name: 'Dhangadhi', lat: 28.7000, lon: 80.6000 },
    { name: 'Ghorahi', lat: 28.0500, lon: 82.4833 },
    { name: 'Tulsipur', lat: 28.1300, lon: 82.3000 },
    { name: 'Bhaktapur', lat: 27.6712, lon: 85.4298 },
    { name: 'Bhairahawa', lat: 27.5000, lon: 83.4500 },
    { name: 'Gorkha', lat: 28.0000, lon: 84.6333 },
    { name: 'Rajbiraj', lat: 26.5333, lon: 86.7500 },
    { name: 'Kirtipur', lat: 27.6769, lon: 85.2759 },
    { name: 'Lumbini', lat: 27.4833, lon: 83.2667 },
  { name: 'Damak', lat: 26.6667, lon: 87.7000 },
  { name: 'Syangja', lat: 28.0167, lon: 83.8833 },
  { name: 'Gaur', lat: 26.7667, lon: 85.2833 },
  { name: 'Ilam', lat: 26.9000, lon: 87.9333 },
  { name: 'Tikapur', lat: 28.5167, lon: 81.1333 },
  { name: 'Tansen', lat: 27.8667, lon: 83.5333 },
  { name: 'Besisahar', lat: 28.2333, lon: 84.3833 },
  { name: 'Banepa', lat: 27.6333, lon: 85.5167 },
  { name: 'Dhulikhel', lat: 27.6167, lon: 85.5500 },
  { name: 'Jomsom', lat: 28.7805, lon: 83.7255 },
  { name: 'Namche Bazaar', lat: 27.8069, lon: 86.7140 },
  { name: 'Lukla', lat: 27.6857, lon: 86.7278 },
  { name: 'Manang', lat: 28.6667, lon: 84.0167 },
  { name: 'Jumla', lat: 29.2752, lon: 82.1838 },
  { name: 'Dolpa', lat: 29.0541, lon: 83.0500 },
  { name: 'Phakding', lat: 27.7446, lon: 86.7131 },
  { name: 'Chame', lat: 28.5561, lon: 84.2291 },
  { name: 'Simikot', lat: 29.9646, lon: 81.8237 },
  { name: 'Jiri', lat: 27.6347, lon: 86.2303 },
  { name: 'Phungling', lat: 27.3538, lon: 87.6935 },
  { name: 'Tengboche', lat: 27.8369, lon: 86.7640 },
  { name: 'Mustang', lat: 29.1895, lon: 83.9631 },
  { name: 'Pheriche', lat: 27.8953, lon: 86.8220 },
  { name: 'Muktinath', lat: 28.8172, lon: 83.8652 }
  ];
  

export async function GET() {
  try {
    const results = await Promise.all(
      cities.map(async city => {
        try {
          // Fetch air pollution data
          const airResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}`
          );
          const airData = await airResponse.json();

          // Fetch weather data
          const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric`
          );
          const weatherData = await weatherResponse.json();

          return {
            name: city.name,
            coordinates: {
              lat: city.lat,
              lon: city.lon
            },
            sampleData: [{
              components: airData.list[0].components,
              dt: airData.list[0].dt,
              weather: {
                temp: weatherData.main.temp,
                feels_like: weatherData.main.feels_like,
                humidity: weatherData.main.humidity,
                pressure: weatherData.main.pressure,
                wind_speed: weatherData.wind.speed,
                description: weatherData.weather[0].description,
                icon: weatherData.weather[0].icon
              }
            }]
          };
        } catch (error) {
          console.error(`Error fetching data for ${city.name}:`, error);
          return null;
        }
      })
    );

    const validResults = results.filter(result => result !== null);
    return NextResponse.json(validResults);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
