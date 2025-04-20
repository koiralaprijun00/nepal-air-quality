export interface CityData {
  name: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  sampleData: Array<{
    components: Record<string, number>;
    dt: number;
    weather: {
      temp: number;
      feels_like: number;
      humidity: number;
      pressure: number;
      wind_speed: number;
      description: string;
      icon: string;
    };
  }>;
}

export interface AqiResult {
  aqi: number;
  category: string;
  color: string;
}

export type RootStackParamList = {
  Home: undefined;
  CityDetail: { city: CityData };
}; 