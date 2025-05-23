'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPollutantLevel } from '../../../services/overallAqiUtils';
import { getAqiCategory, calculateOverallAqi } from '../../../services/AqiCalculator';
import { 
  MapPinIcon, 
  ChartBarIcon, 
  MagnifyingGlassIcon,
  ViewColumnsIcon,
  AdjustmentsHorizontalIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

interface CityData {
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

interface WorldCityData {
  name: string;
  country: string;
  aqi: number;
  components: Record<string, number>;
}

interface AirQualityDashboardProps {
  citiesData: CityData[];
  worldCitiesData: WorldCityData[];
  loading: boolean;
  error: string | null;
}

// Type guard functions
const isWorldCity = (city: CityData | WorldCityData): city is WorldCityData => {
  return 'country' in city && 'aqi' in city;
};

const isNepalCity = (city: CityData | WorldCityData): city is CityData => {
  return 'sampleData' in city && 'coordinates' in city;
};

const getStatusColor = (aqi: number): string => {
  if (aqi <= 50) return '#10B981'; // Green
  if (aqi <= 100) return '#FBBF24'; // Yellow
  if (aqi <= 150) return '#F97316'; // Orange
  if (aqi <= 200) return '#EF4444'; // Red
  if (aqi <= 300) return '#7C3AED'; // Purple
  return '#991B1B'; // Dark Red
};

const AirQualityDashboard: React.FC<AirQualityDashboardProps> = ({ 
  citiesData, 
  worldCitiesData = [],
  loading, 
  error 
}) => {
  const t = useTranslations('common');
  const dashboardT = useTranslations('dashboard');
  const params = useParams();
  const locale = params.locale as string;
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'city-details' | 'world'>('world');
  const [worldToggle, setWorldToggle] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const citiesPerPage = 3;

  // Filter cities based on search term
  const filteredCities = viewMode === 'world' 
    ? worldCitiesData.filter(city => 
        city.name.toLowerCase().includes(search.toLowerCase()) ||
        city.country.toLowerCase().includes(search.toLowerCase())
      )
    : citiesData.filter(city => 
        city.name.toLowerCase().includes(search.toLowerCase())
      );

  // Calculate total slides
  const totalSlides = Math.ceil(filteredCities.length / citiesPerPage);

  // Handle slide navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Get current slide cities
  const getCurrentSlideCities = () => {
    const start = currentSlide * citiesPerPage;
    return filteredCities.slice(start, start + citiesPerPage);
  };

  // Reset current slide when search changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [search, viewMode]);

  // Sort Nepal cities by AQI
  const sortedNepalCities = [...citiesData].sort((a, b) => {
    const aAqi = calculateOverallAqi(a.sampleData?.[0]?.components || {}).aqi;
    const bAqi = calculateOverallAqi(b.sampleData?.[0]?.components || {}).aqi;
    return bAqi - aAqi;
  });

  // Sort world cities by AQI
  const sortedWorldCities = [...worldCitiesData].sort((a, b) => b.aqi - a.aqi);
  const mostPollutedWorldCities = sortedWorldCities.slice(0, 2);
  const cleanestWorldCities = sortedWorldCities.slice(-2).reverse();

  const mostPollutedCities = sortedNepalCities.slice(0, 2);
  const cleanestCities = sortedNepalCities.slice(-2).reverse();

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">{t('loadingData')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-xl shadow-sm">
        <p className="font-medium mb-1">{t('errorLoadingData')}</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!citiesData || citiesData.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-5 rounded-xl shadow-sm">
        <p className="font-medium">{t('noDataAvailable')}</p>
        <p className="text-sm mt-1">{t('checkConnection')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex items-center">
            <ChartBarIcon className="h-5 w-5 text-blue-500 mr-2" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">{dashboardT('title')}</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* View Mode Toggle */}
            <div className="flex p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setViewMode('world')}
                className={`flex items-center px-2 sm:px-3 py-1.5 text-xs rounded ${
                  viewMode === 'world' 
                    ? 'bg-white shadow text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MapPinIcon className="h-3.5 w-3.5 mr-1" />
                {dashboardT('worldView')}
              </button>
              <button
                onClick={() => setViewMode('city-details')}
                className={`flex items-center px-2 sm:px-3 py-1.5 text-xs rounded ${
                  viewMode === 'city-details' 
                    ? 'bg-white shadow text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <AdjustmentsHorizontalIcon className="h-3.5 w-3.5 mr-1" />
                {dashboardT('cityDetails')}
              </button>
            </div>
            
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={dashboardT('searchPlaceholder', { view: viewMode === 'world' ? dashboardT('world') : dashboardT('nepal') })}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className={`p-4 sm:p-6 ${filteredCities.length === 0 ? '' : viewMode === 'world' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6' : 'relative'}`}>
        {filteredCities.length === 0 ? (
          <div className="text-center py-8 sm:py-10 text-gray-500">
            <p>{dashboardT('noResults')}</p>
          </div>
        ) : viewMode === 'world' ? (
          <>
            {/* Left Column - Cities Ranking Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold">{dashboardT('liveRanking')}</h3>
                  <p className="text-gray-500 text-sm mt-1">{dashboardT('rankingDescription')}</p>
                </div>
                <div className="flex p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setWorldToggle(false)}
                    className={`flex items-center px-2 sm:px-3 py-1.5 text-xs rounded ${
                      !worldToggle 
                        ? 'bg-white shadow text-blue-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {dashboardT('nepal')}
                  </button>
                  <button
                    onClick={() => setWorldToggle(true)}
                    className={`flex items-center px-2 sm:px-3 py-1.5 text-xs rounded ${
                      worldToggle 
                        ? 'bg-white shadow text-blue-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {dashboardT('world')}
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <div className="w-full">
                  <div className="grid grid-cols-12 text-sm text-gray-500 pb-2">
                    <div className="col-span-1">#</div>
                    <div className="col-span-7">{t('location')}</div>
                    <div className="col-span-4 text-right pr-2">{t('aqi')}</div>
                  </div>
                  {(worldToggle ? sortedWorldCities : sortedNepalCities).slice(0, 10).map((city, index) => {
                    const cityAqi = isWorldCity(city)
                      ? city.aqi
                      : calculateOverallAqi(city.sampleData[0]?.components || {}).aqi;
                    const category = getAqiCategory(cityAqi);
                    return (
                      <div key={index} className="grid grid-cols-12 items-center py-2 border-b border-gray-100 last:border-0">
                        <div className="col-span-1 text-gray-600">{index + 1}</div>
                        <div className="col-span-7">
                          {isWorldCity(city) ? (
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: getStatusColor(cityAqi) }} />
                              <span className="font-medium text-sm sm:text-base truncate">
                                {city.name}, {city.country}
                              </span>
                            </div>
                          ) : (
                            <Link 
                              href={`/${locale}/city/${encodeURIComponent(city.name.toLowerCase())}`}
                              className="flex items-center rounded-lg p-1 -m-1 transition-colors group relative"
                            >
                              <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: getStatusColor(cityAqi) }} />
                              <span className="font-medium text-sm sm:text-base truncate text-blue-600 group-hover:text-blue-700">
                                {city.name}
                              </span>
                              <ArrowRightIcon className="h-4 w-4 ml-1 text-blue-500 opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200" />
                            </Link>
                          )}
                        </div>
                        <div className="col-span-4 text-right pr-2">
                          <span
                            className="font-medium text-sm sm:text-base"
                            style={{ color: getStatusColor(cityAqi) }}
                          >
                            {cityAqi.toFixed(0)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <ArrowRightIcon className="h-3 w-3 mr-1" />
                {dashboardT('clickCityForInfo')}
              </p>
            </div>

            {/* Right Column - Most Polluted and Cleanest Cities */}
            <div className="space-y-6">
              {/* Most Polluted Cities */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-semibold mb-2">{dashboardT('mostPolluted')}</h3>
                <p className="text-gray-500 text-sm mb-4">{dashboardT('mostPollutedDescription')}</p>
                <div className="space-y-3">
                  {mostPollutedWorldCities.slice(0, 3).map((city, index) => {
                    const category = getAqiCategory(city.aqi);
                    return (
                      <div key={index} className="bg-red-50 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-lg">{city.name}, {city.country}</span>
                            </div>
                          </div>
                          <div className={`px-4 py-2 rounded-lg text-white font-medium ${category.color}`}>
                            {Math.round(city.aqi)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cleanest Cities */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-semibold mb-2">{dashboardT('cleanest')}</h3>
                <p className="text-gray-500 text-sm mb-4">{dashboardT('cleanestDescription')}</p>
                <div className="space-y-3">
                  {cleanestWorldCities.slice(0, 3).map((city, index) => {
                    const category = getAqiCategory(city.aqi);
                    return (
                      <div key={index} className="bg-green-50 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-lg">{city.name}, {city.country}</span>
                            </div>
                          </div>
                          <div className={`px-4 py-2 rounded-lg text-white font-medium ${category.color}`}>
                            {Math.round(city.aqi)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCurrentSlideCities().map((city, index) => {
                if (isWorldCity(city)) {
                  return (
                    <div 
                      key={index} 
                      className="rounded-xl overflow-hidden hover:shadow-md transition-shadow border border-gray-100 bg-gradient-to-br from-gray-50 to-gray-50/40"
                    >
                      <div className="bg-white/80 backdrop-blur-sm border-b px-4 py-3 flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{city.name}</h3>
                          <div className="text-xs text-gray-500">
                            {city.country}
                          </div>
                        </div>
                        <div className={`px-4 py-2 rounded-lg text-white font-medium ${getAqiCategory(city.aqi).color}`}>
                          {Math.round(city.aqi)}
                        </div>
                      </div>
                    </div>
                  );
                }

                const sample = city.sampleData?.[0];
                const components = sample?.components || {};
                const { aqi, dominantPollutant } = calculateOverallAqi(components);
                const category = getAqiCategory(aqi);
                const weather = sample?.weather || {};
                
                // Get background gradient based on AQI category
                const getBgGradient = () => {
                  if (aqi <= 50) return 'from-green-50 to-green-50/40';
                  if (aqi <= 100) return 'from-yellow-50 to-yellow-50/40';
                  if (aqi <= 150) return 'from-orange-50 to-orange-50/40';
                  if (aqi <= 200) return 'from-red-50 to-red-50/40';
                  if (aqi <= 300) return 'from-purple-50 to-purple-50/40';
                  return 'from-red-100 to-red-50/40';
                };
                
                // Get border color based on AQI category
                const getBorderColor = () => {
                  if (aqi <= 50) return 'border-green-100';
                  if (aqi <= 100) return 'border-yellow-100';
                  if (aqi <= 150) return 'border-orange-100';
                  if (aqi <= 200) return 'border-red-100';
                  if (aqi <= 300) return 'border-purple-100';
                  return 'border-red-200';
                };

                return (
                  <div 
                    key={index} 
                    className={`rounded-xl overflow-hidden hover:shadow-md transition-shadow border ${getBorderColor()} bg-gradient-to-br ${getBgGradient()}`}
                  >
                    <div className="bg-white/80 backdrop-blur-sm border-b px-4 py-3 flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{city.name}</h3>
                        <div className="text-xs text-gray-500 flex items-center">
                          <MapPinIcon className="h-3 w-3 mr-1" />
                          <span>{city.coordinates.lat.toFixed(2)}°, {city.coordinates.lon.toFixed(2)}°</span>
                        </div>
                      </div>
                      <Link 
                        href={`/${locale}/city/${encodeURIComponent(city.name.toLowerCase())}`}
                        className="flex items-center rounded-lg p-1 -m-1 transition-colors group relative"
                      >
                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: getStatusColor(aqi) }} />
                        <span className="font-medium text-sm sm:text-base truncate text-gray-800 hover:text-blue-600 group-hover:text-blue-700">
                          {city.name}
                        </span>
                        <ArrowRightIcon className="h-4 w-4 ml-1 text-blue-500 opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200" />
                      </Link>
                    </div>
                    
                    {sample && (
                      <div className="p-4">
                        <div>
                          <div className="p-3 bg-white/90 rounded-lg shadow-sm mb-4">
                            <h4 className="font-medium text-gray-700 mb-1">{dashboardT('usEpaAqi')}</h4>
                            <div className="flex items-center">
                              <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${category.color} text-xl font-bold shadow-sm mr-3`}>
                                {aqi}
                              </div>
                              <p className="font-medium text-gray-800">{category.label}</p>
                            </div>
                          </div>
                          
                          {/* Weather Information */}
                          {sample?.weather && (
                            <div className="p-3 bg-white/90 rounded-lg shadow-sm mb-4">
                              <h4 className="font-medium text-gray-700 mb-2">{t('currentWeather')}</h4>
                              <div className="flex items-center space-x-4">
                                <img 
                                  src={`https://openweathermap.org/img/wn/${sample.weather.icon}@2x.png`} 
                                  alt="Weather icon"
                                  className="w-12 h-12"
                                />
                                <div>
                                  <div className="text-xl font-semibold">
                                    {Math.round(sample.weather.temp)}{dashboardT('units.temperature')}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {t('feelsLike')}: {Math.round(sample.weather.feels_like)}{dashboardT('units.temperature')}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {t('humidity')}: {sample.weather.humidity}{dashboardT('units.humidity')}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {t('windSpeed')}: {sample.weather.wind_speed} {dashboardT('units.windSpeed')}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-3 space-y-2">
                            {Object.entries(components).slice(0, 4).map(([key, value]) => {
                              const { label } = getPollutantLevel(key, value as number);
                              
                              // Get text color based on pollutant level
                              let textColor = 'text-green-600';
                              if (label === 'Moderate' || label === 'Fair') textColor = 'text-yellow-600';
                              else if (label === 'Poor') textColor = 'text-orange-600';
                              else if (label === 'Very Poor') textColor = 'text-red-600';
                              
                              return (
                                <div key={key} className="flex justify-between px-3 py-2 bg-white/90 rounded-lg text-sm">
                                  <span className="text-gray-700">
                                    {dashboardT(`pollutants.${key}`)}
                                  </span>
                                  <span className={`font-medium ${textColor}`}>
                                    {(value as number).toFixed(1)} {dashboardT('units.concentration')}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Navigation Arrows */}
            {totalSlides > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Slide Indicators */}
            {totalSlides > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide ? 'bg-blue-500 w-4' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AirQualityDashboard;