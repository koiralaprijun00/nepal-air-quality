// src/app/blog/page.tsx
'use client'

import React, { useState } from 'react';
import Link from 'next/link';

const AirQualityBlog = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-block mb-8 text-white hover:text-blue-200 transition">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Understanding Air Quality</h1>
          <p className="text-xl md:text-2xl max-w-3xl">
            How air pollution is measured and what AQI values mean for your health
          </p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="prose lg:prose-xl max-w-none">
              <p className="lead text-xl text-gray-600 mb-8">
                Air quality is a critical factor affecting our daily lives and long-term health. This guide explains how air pollution is measured, what different pollutants are, and how Air Quality Index (AQI) values are calculated and interpreted.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Common Air Pollutants</h2>
              <p>
                Air pollution consists of various harmful substances. Here are the primary pollutants monitored in air quality assessments:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-blue-700">Particulate Matter (PM2.5 & PM10)</h3>
                  <p className="text-gray-700 mt-2">
                    Tiny particles suspended in the air. PM2.5 (diameter less than 2.5 micrometers) can penetrate deep into the lungs and even enter the bloodstream. PM10 (diameter less than 10 micrometers) can irritate the respiratory system.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Sources: Vehicle emissions, construction, industrial processes, wildfires, dust
                  </p>
                </div>
                
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-blue-700">Ground-level Ozone (O₃)</h3>
                  <p className="text-gray-700 mt-2">
                    A secondary pollutant formed by chemical reactions between oxides of nitrogen and volatile organic compounds in the presence of sunlight.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Sources: Vehicle exhaust, industrial emissions, chemical solvents
                  </p>
                </div>
                
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-blue-700">Carbon Monoxide (CO)</h3>
                  <p className="text-gray-700 mt-2">
                    A colorless, odorless gas that can be harmful when inhaled in large amounts. CO reduces oxygen delivery to the body's organs.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Sources: Vehicle exhaust, fuel combustion, industrial processes
                  </p>
                </div>
                
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-blue-700">Nitrogen Dioxide (NO₂)</h3>
                  <p className="text-gray-700 mt-2">
                    A highly reactive gas that forms from emissions from vehicles, power plants, and off-road equipment. NO₂ can contribute to respiratory problems.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Sources: Vehicle emissions, power plants, industrial processes
                  </p>
                </div>
                
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-blue-700">Sulfur Dioxide (SO₂)</h3>
                  <p className="text-gray-700 mt-2">
                    A gas primarily produced from the burning of fossil fuels containing sulfur. SO₂ can harm the respiratory system and contribute to acid rain.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Sources: Coal and oil burning power plants, industrial facilities
                  </p>
                </div>
                
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-blue-700">Ammonia (NH₃)</h3>
                  <p className="text-gray-700 mt-2">
                    A colorless gas with a pungent odor that contributes to particulate matter formation and can irritate the respiratory system.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Sources: Agricultural activities, livestock waste, fertilizers
                  </p>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mt-10 mb-4">How Air Quality Index (AQI) Is Calculated</h2>
              <p>
                The Air Quality Index (AQI) is a standardized indicator developed by environmental agencies to communicate how polluted the air currently is or how polluted it is forecast to become. Different countries use slightly different methods to calculate their AQI values.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-5 my-6">
                <h3 className="font-bold text-lg mb-2">US EPA AQI Calculation</h3>
                <p className="mb-4">
                  The United States Environmental Protection Agency (EPA) calculates the AQI using the following formula:
                </p>
                <div className="bg-white p-4 rounded overflow-x-auto">
                  <code className="text-sm">
                    AQI = ((I<sub>high</sub> - I<sub>low</sub>) / (C<sub>high</sub> - C<sub>low</sub>)) × (C - C<sub>low</sub>) + I<sub>low</sub>
                  </code>
                </div>
                <p className="mt-4">
                  Where:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>C</strong> = the pollutant concentration</li>
                  <li><strong>C<sub>low</sub></strong> = the concentration breakpoint that is ≤ C</li>
                  <li><strong>C<sub>high</sub></strong> = the concentration breakpoint that is ≥ C</li>
                  <li><strong>I<sub>low</sub></strong> = the index breakpoint corresponding to C<sub>low</sub></li>
                  <li><strong>I<sub>high</sub></strong> = the index breakpoint corresponding to C<sub>high</sub></li>
                </ul>
                <p className="mt-4">
                  The overall AQI reported is the highest AQI value among all pollutants measured.
                </p>
              </div>

              <div className="my-8" role="button" onClick={() => toggleSection('epaBp')} tabIndex={0}>
                <div className="flex justify-between items-center bg-gray-100 p-4 rounded cursor-pointer">
                  <h3 className="font-bold">US EPA AQI Breakpoints</h3>
                  <span>{activeSection === 'epaBp' ? '▼' : '►'}</span>
                </div>
                
                {activeSection === 'epaBp' && (
                  <div className="p-4 border border-gray-200 rounded-b">
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="py-2 px-4 border">AQI Category</th>
                            <th className="py-2 px-4 border">AQI Value</th>
                            <th className="py-2 px-4 border">PM2.5 (μg/m³)</th>
                            <th className="py-2 px-4 border">PM10 (μg/m³)</th>
                            <th className="py-2 px-4 border">O3 (ppb) 8-hr</th>
                            <th className="py-2 px-4 border">CO (ppm) 8-hr</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="py-2 px-4 border bg-green-100">Good</td>
                            <td className="py-2 px-4 border">0-50</td>
                            <td className="py-2 px-4 border">0-12.0</td>
                            <td className="py-2 px-4 border">0-54</td>
                            <td className="py-2 px-4 border">0-54</td>
                            <td className="py-2 px-4 border">0-4.4</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 border bg-yellow-100">Moderate</td>
                            <td className="py-2 px-4 border">51-100</td>
                            <td className="py-2 px-4 border">12.1-35.4</td>
                            <td className="py-2 px-4 border">55-154</td>
                            <td className="py-2 px-4 border">55-70</td>
                            <td className="py-2 px-4 border">4.5-9.4</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 border bg-orange-100">Unhealthy for Sensitive Groups</td>
                            <td className="py-2 px-4 border">101-150</td>
                            <td className="py-2 px-4 border">35.5-55.4</td>
                            <td className="py-2 px-4 border">155-254</td>
                            <td className="py-2 px-4 border">71-85</td>
                            <td className="py-2 px-4 border">9.5-12.4</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 border bg-red-100">Unhealthy</td>
                            <td className="py-2 px-4 border">151-200</td>
                            <td className="py-2 px-4 border">55.5-150.4</td>
                            <td className="py-2 px-4 border">255-354</td>
                            <td className="py-2 px-4 border">86-105</td>
                            <td className="py-2 px-4 border">12.5-15.4</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 border bg-purple-100">Very Unhealthy</td>
                            <td className="py-2 px-4 border">201-300</td>
                            <td className="py-2 px-4 border">150.5-250.4</td>
                            <td className="py-2 px-4 border">355-424</td>
                            <td className="py-2 px-4 border">106-200</td>
                            <td className="py-2 px-4 border">15.5-30.4</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 border bg-red-900 text-white">Hazardous</td>
                            <td className="py-2 px-4 border">301-500</td>
                            <td className="py-2 px-4 border">250.5-500.4</td>
                            <td className="py-2 px-4 border">425-604</td>
                            <td className="py-2 px-4 border">-</td>
                            <td className="py-2 px-4 border">30.5-50.4</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-5 my-6">
                <h3 className="font-bold text-lg mb-2">OpenWeather AQI System</h3>
                <p>
                  OpenWeather uses a simplified 1-5 scale for their Air Quality Index:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>1: Good</strong> - Air quality is satisfactory, and air pollution poses little or no risk</li>
                  <li><strong>2: Fair</strong> - Air quality is acceptable; however, some pollutants may be moderate</li>
                  <li><strong>3: Moderate</strong> - Members of sensitive groups may experience health effects</li>
                  <li><strong>4: Poor</strong> - Everyone may begin to experience health effects</li>
                  <li><strong>5: Very Poor</strong> - Health warnings of emergency conditions; everyone is more likely to be affected</li>
                </ul>
              </div>
              
              <div className="my-8" role="button" onClick={() => toggleSection('owBp')} tabIndex={0}>
                <div className="flex justify-between items-center bg-gray-100 p-4 rounded cursor-pointer">
                  <h3 className="font-bold">OpenWeather AQI Breakpoints</h3>
                  <span>{activeSection === 'owBp' ? '▼' : '►'}</span>
                </div>
                
                {activeSection === 'owBp' && (
                  <div className="p-4 border border-gray-200 rounded-b">
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="py-2 px-4 border">Index</th>
                            <th className="py-2 px-4 border">Qualitative name</th>
                            <th className="py-2 px-4 border">SO2 (μg/m³)</th>
                            <th className="py-2 px-4 border">NO2 (μg/m³)</th>
                            <th className="py-2 px-4 border">PM10 (μg/m³)</th>
                            <th className="py-2 px-4 border">PM2.5 (μg/m³)</th>
                            <th className="py-2 px-4 border">O3 (μg/m³)</th>
                            <th className="py-2 px-4 border">CO (μg/m³)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="py-2 px-4 border">1</td>
                            <td className="py-2 px-4 border bg-green-100">Good</td>
                            <td className="py-2 px-4 border">[0; 20)</td>
                            <td className="py-2 px-4 border">[0; 40)</td>
                            <td className="py-2 px-4 border">[0; 20)</td>
                            <td className="py-2 px-4 border">[0; 10)</td>
                            <td className="py-2 px-4 border">[0; 60)</td>
                            <td className="py-2 px-4 border">[0; 4400)</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 border">2</td>
                            <td className="py-2 px-4 border bg-green-200">Fair</td>
                            <td className="py-2 px-4 border">[20; 80)</td>
                            <td className="py-2 px-4 border">[40; 70)</td>
                            <td className="py-2 px-4 border">[20; 50)</td>
                            <td className="py-2 px-4 border">[10; 25)</td>
                            <td className="py-2 px-4 border">[60; 100)</td>
                            <td className="py-2 px-4 border">[4400; 9400)</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 border">3</td>
                            <td className="py-2 px-4 border bg-yellow-100">Moderate</td>
                            <td className="py-2 px-4 border">[80; 250)</td>
                            <td className="py-2 px-4 border">[70; 150)</td>
                            <td className="py-2 px-4 border">[50; 100)</td>
                            <td className="py-2 px-4 border">[25; 50)</td>
                            <td className="py-2 px-4 border">[100; 140)</td>
                            <td className="py-2 px-4 border">[9400-12400)</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 border">4</td>
                            <td className="py-2 px-4 border bg-orange-100">Poor</td>
                            <td className="py-2 px-4 border">[250; 350)</td>
                            <td className="py-2 px-4 border">[150; 200)</td>
                            <td className="py-2 px-4 border">[100; 200)</td>
                            <td className="py-2 px-4 border">[50; 75)</td>
                            <td className="py-2 px-4 border">[140; 180)</td>
                            <td className="py-2 px-4 border">[12400; 15400)</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 border">5</td>
                            <td className="py-2 px-4 border bg-red-100">Very Poor</td>
                            <td className="py-2 px-4 border">⩾350</td>
                            <td className="py-2 px-4 border">⩾200</td>
                            <td className="py-2 px-4 border">⩾200</td>
                            <td className="py-2 px-4 border">⩾75</td>
                            <td className="py-2 px-4 border">⩾180</td>
                            <td className="py-2 px-4 border">⩾15400</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
              
              <h2 className="text-2xl font-bold mt-10 mb-4">Health Implications of Air Quality</h2>
              
              <div className="grid grid-cols-1 gap-4 my-6">
                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                  <h3 className="font-bold text-green-800">Good (0-50 AQI)</h3>
                  <p className="text-gray-700 mt-2">
                    Air quality is considered satisfactory, and air pollution poses little or no risk.
                  </p>
                  <p className="font-medium mt-2">Recommended actions:</p>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Enjoy outdoor activities</li>
                    <li>Great time for outdoor exercise</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <h3 className="font-bold text-yellow-800">Moderate (51-100 AQI)</h3>
                  <p className="text-gray-700 mt-2">
                    Air quality is acceptable; however, there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.
                  </p>
                  <p className="font-medium mt-2">Recommended actions:</p>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Consider reducing prolonged or heavy exertion outdoors if you have respiratory issues</li>
                    <li>Watch for symptoms like coughing or shortness of breath</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
                  <h3 className="font-bold text-orange-800">Unhealthy for Sensitive Groups (101-150 AQI)</h3>
                  <p className="text-gray-700 mt-2">
                    Members of sensitive groups may experience health effects. The general public is not likely to be affected.
                  </p>
                  <p className="font-medium mt-2">Recommended actions:</p>
                  <ul className="list-disc pl-6 mt-1">
                    <li>People with respiratory or heart disease, the elderly and children should limit prolonged outdoor exertion</li>
                    <li>Consider moving long or intense outdoor workouts indoors</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <h3 className="font-bold text-red-800">Unhealthy (151-200 AQI)</h3>
                  <p className="text-gray-700 mt-2">
                    Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.
                  </p>
                  <p className="font-medium mt-2">Recommended actions:</p>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Everyone should reduce prolonged or heavy exertion outdoors</li>
                    <li>Sensitive groups should avoid outdoor activities</li>
                    <li>Consider using air purifiers indoors</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 border-l-4 border-purple-600 p-4">
                  <h3 className="font-bold text-purple-800">Very Unhealthy (201-300 AQI)</h3>
                  <p className="text-gray-700 mt-2">
                    Health warnings of emergency conditions. The entire population is more likely to be affected.
                  </p>
                  <p className="font-medium mt-2">Recommended actions:</p>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Everyone should avoid outdoor exertion</li>
                    <li>Stay indoors with windows and doors closed</li>
                    <li>Run air purifiers if available</li>
                  </ul>
                </div>
                
                <div className="bg-red-100 border-l-4 border-red-900 p-4">
                  <h3 className="font-bold text-red-900">Hazardous (301+ AQI)</h3>
                  <p className="text-gray-700 mt-2">
                    Health alert: everyone may experience more serious health effects.
                  </p>
                  <p className="font-medium mt-2">Recommended actions:</p>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Avoid all physical activity outdoors</li>
                    <li>Remain indoors with windows and doors closed</li>
                    <li>Consider temporarily relocating if air quality persists at this level</li>
                    <li>Follow public health advisories and alerts</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AirQualityBlog;