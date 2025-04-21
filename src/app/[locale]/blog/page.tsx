// src/app/[locale]/blog/page.tsx
'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, InformationCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

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
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition mb-6">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Understanding Air Quality</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl">
            How air pollution is measured and what AQI values mean for your health
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Introduction */}
          <div className="p-8 border-b border-gray-100">
            <p className="text-lg text-gray-600 mb-6">
              Air quality is a critical factor affecting our daily lives and long-term health. This guide explains how air pollution is measured, what different pollutants are, and how Air Quality Index (AQI) values are calculated and interpreted.
            </p>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-start">
                <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  The information provided here is intended for educational purposes. For specific health concerns related to air quality, please consult with a healthcare professional.
                </p>
              </div>
            </div>
          </div>

          {/* Common Air Pollutants */}
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Common Air Pollutants</h2>
            <p className="text-gray-600 mb-6">
              Air pollution consists of various harmful substances. Here are the primary pollutants monitored in air quality assessments:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div className="bg-gradient-to-br from-green-50 to-green-50/40 border border-green-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Particulate Matter (PM2.5 & PM10)</h3>
                <p className="text-gray-700 mb-2">
                  Tiny particles suspended in the air. PM2.5 (diameter less than 2.5 micrometers) can penetrate deep into the lungs and even enter the bloodstream. PM10 (diameter less than 10 micrometers) can irritate the respiratory system.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  <span className="font-medium">Sources:</span> Vehicle emissions, construction, industrial processes, wildfires, dust
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-50/40 border border-blue-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Ground-level Ozone (O₃)</h3>
                <p className="text-gray-700 mb-2">
                  A secondary pollutant formed by chemical reactions between oxides of nitrogen and volatile organic compounds in the presence of sunlight.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  <span className="font-medium">Sources:</span> Vehicle exhaust, industrial emissions, chemical solvents
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-50/40 border border-purple-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Carbon Monoxide (CO)</h3>
                <p className="text-gray-700 mb-2">
                  A colorless, odorless gas that can be harmful when inhaled in large amounts. CO reduces oxygen delivery to the body's organs.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  <span className="font-medium">Sources:</span> Vehicle exhaust, fuel combustion, industrial processes
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-50/40 border border-yellow-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Nitrogen Dioxide (NO₂)</h3>
                <p className="text-gray-700 mb-2">
                  A highly reactive gas that forms from emissions from vehicles, power plants, and off-road equipment. NO₂ can contribute to respiratory problems.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  <span className="font-medium">Sources:</span> Vehicle emissions, power plants, industrial processes
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-50/40 border border-orange-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">Sulfur Dioxide (SO₂)</h3>
                <p className="text-gray-700 mb-2">
                  A gas primarily produced from the burning of fossil fuels containing sulfur. SO₂ can harm the respiratory system and contribute to acid rain.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  <span className="font-medium">Sources:</span> Coal and oil burning power plants, industrial facilities
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-teal-50 to-teal-50/40 border border-teal-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <h3 className="text-lg font-semibold text-teal-800 mb-2">Ammonia (NH₃)</h3>
                <p className="text-gray-700 mb-2">
                  A colorless gas with a pungent odor that contributes to particulate matter formation and can irritate the respiratory system.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  <span className="font-medium">Sources:</span> Agricultural activities, livestock waste, fertilizers
                </p>
              </div>
            </div>
          </div>
          
          {/* AQI Calculation */}
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">How Air Quality Index (AQI) Is Calculated</h2>
            <p className="text-gray-600 mb-6">
              The Air Quality Index (AQI) is a standardized indicator developed by environmental agencies to communicate how polluted the air currently is or how polluted it is forecast to become. Different countries use slightly different methods to calculate their AQI values.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-5 my-6">
              <h3 className="font-bold text-lg mb-2 text-gray-800">US EPA AQI Calculation</h3>
              <p className="mb-4 text-gray-700">
                The United States Environmental Protection Agency (EPA) calculates the AQI using the following formula:
              </p>
              <div className="bg-white p-4 rounded shadow-sm overflow-x-auto">
                <code className="text-sm text-gray-800">
                  AQI = ((I<sub>high</sub> - I<sub>low</sub>) / (C<sub>high</sub> - C<sub>low</sub>)) × (C - C<sub>low</sub>) + I<sub>low</sub>
                </code>
              </div>
              <p className="mt-4 text-gray-700">
                Where:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                <li><strong>C</strong> = the pollutant concentration</li>
                <li><strong>C<sub>low</sub></strong> = the concentration breakpoint that is ≤ C</li>
                <li><strong>C<sub>high</sub></strong> = the concentration breakpoint that is ≥ C</li>
                <li><strong>I<sub>low</sub></strong> = the index breakpoint corresponding to C<sub>low</sub></li>
                <li><strong>I<sub>high</sub></strong> = the index breakpoint corresponding to C<sub>high</sub></li>
              </ul>
              <p className="mt-4 text-gray-700">
                The overall AQI reported is the highest AQI value among all pollutants measured.
              </p>
            </div>

            {/* EPA Breakpoints (Collapsible Section) */}
            <div className="my-8">
              <button 
                className="w-full flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition p-4 rounded-lg text-left"
                onClick={() => toggleSection('epaBp')}
                aria-expanded={activeSection === 'epaBp'}
              >
                <h3 className="font-bold text-gray-800">US EPA AQI Breakpoints</h3>
                <span>
                  {activeSection === 'epaBp' ? 
                    <ChevronUpIcon className="h-5 w-5 text-gray-600" /> : 
                    <ChevronDownIcon className="h-5 w-5 text-gray-600" />
                  }
                </span>
              </button>
              
              {activeSection === 'epaBp' && (
                <div className="p-4 border border-gray-200 border-t-0 rounded-b-lg bg-white">
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-2 px-4 border text-left">AQI Category</th>
                          <th className="py-2 px-4 border text-left">AQI Value</th>
                          <th className="py-2 px-4 border text-left">PM2.5 (μg/m³)</th>
                          <th className="py-2 px-4 border text-left">PM10 (μg/m³)</th>
                          <th className="py-2 px-4 border text-left">O3 (ppb) 8-hr</th>
                          <th className="py-2 px-4 border text-left">CO (ppm) 8-hr</th>
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
            
            {/* OpenWeather AQI System */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-5 my-6">
              <h3 className="font-bold text-lg mb-2 text-gray-800">OpenWeather AQI System</h3>
              <p className="text-gray-700 mb-4">
                OpenWeather uses a simplified 1-5 scale for their Air Quality Index:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                <li><strong>1: Good</strong> - Air quality is satisfactory, and air pollution poses little or no risk</li>
                <li><strong>2: Fair</strong> - Air quality is acceptable; however, some pollutants may be moderate</li>
                <li><strong>3: Moderate</strong> - Members of sensitive groups may experience health effects</li>
                <li><strong>4: Poor</strong> - Everyone may begin to experience health effects</li>
                <li><strong>5: Very Poor</strong> - Health warnings of emergency conditions; everyone is more likely to be affected</li>
              </ul>
            </div>
            
            {/* OpenWeather Breakpoints (Collapsible Section) */}
            <div className="my-8">
              <button 
                className="w-full flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition p-4 rounded-lg text-left"
                onClick={() => toggleSection('owBp')}
                aria-expanded={activeSection === 'owBp'}
              >
                <h3 className="font-bold text-gray-800">OpenWeather AQI Breakpoints</h3>
                <span>
                  {activeSection === 'owBp' ? 
                    <ChevronUpIcon className="h-5 w-5 text-gray-600" /> : 
                    <ChevronDownIcon className="h-5 w-5 text-gray-600" />
                  }
                </span>
              </button>
              
              {activeSection === 'owBp' && (
                <div className="p-4 border border-gray-200 border-t-0 rounded-b-lg bg-white">
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-2 px-4 border text-left">Index</th>
                          <th className="py-2 px-4 border text-left">Qualitative name</th>
                          <th className="py-2 px-4 border text-left">SO2 (μg/m³)</th>
                          <th className="py-2 px-4 border text-left">NO2 (μg/m³)</th>
                          <th className="py-2 px-4 border text-left">PM10 (μg/m³)</th>
                          <th className="py-2 px-4 border text-left">PM2.5 (μg/m³)</th>
                          <th className="py-2 px-4 border text-left">O3 (μg/m³)</th>
                          <th className="py-2 px-4 border text-left">CO (μg/m³)</th>
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
          </div>
          
          {/* Health Implications */}
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Health Implications of Air Quality</h2>
            
            <div className="grid grid-cols-1 gap-4 my-6">
              <div className="bg-gradient-to-br from-green-50 to-green-50/40 border border-green-100 rounded-lg p-5">
                <h3 className="font-bold text-green-800 text-lg mb-2">Good (0-50 AQI)</h3>
                <p className="text-gray-700 mb-3">
                  Air quality is considered satisfactory, and air pollution poses little or no risk.
                </p>
                <div className="bg-white/80 p-3 rounded-lg">
                  <p className="font-medium text-gray-700 mb-2">Recommended actions:</p>
                  <ul className="list-disc pl-6">
                    <li>Enjoy outdoor activities</li>
                    <li>Great time for outdoor exercise</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-50/40 border border-yellow-100 rounded-lg p-5">
                <h3 className="font-bold text-yellow-800 text-lg mb-2">Moderate (51-100 AQI)</h3>
                <p className="text-gray-700 mb-3">
                  Air quality is acceptable; however, there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.
                </p>
                <div className="bg-white/80 p-3 rounded-lg">
                  <p className="font-medium text-gray-700 mb-2">Recommended actions:</p>
                  <ul className="list-disc pl-6">
                    <li>Consider reducing prolonged or heavy exertion outdoors if you have respiratory issues</li>
                    <li>Watch for symptoms like coughing or shortness of breath</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-50/40 border border-orange-100 rounded-lg p-5">
                <h3 className="font-bold text-orange-800 text-lg mb-2">Unhealthy for Sensitive Groups (101-150 AQI)</h3>
                <p className="text-gray-700 mb-3">
                  Members of sensitive groups may experience health effects. The general public is not likely to be affected.
                </p>
                <div className="bg-white/80 p-3 rounded-lg">
                  <p className="font-medium text-gray-700 mb-2">Recommended actions:</p>
                  <ul className="list-disc pl-6">
                    <li>People with respiratory or heart disease, the elderly and children should limit prolonged outdoor exertion</li>
                    <li>Consider moving long or intense outdoor workouts indoors</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-50 to-red-50/40 border border-red-100 rounded-lg p-5">
                <h3 className="font-bold text-red-800 text-lg mb-2">Unhealthy (151-200 AQI)</h3>
                <p className="text-gray-700 mb-3">
                  Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.
                </p>
                <div className="bg-white/80 p-3 rounded-lg">
                  <p className="font-medium text-gray-700 mb-2">Recommended actions:</p>
                  <ul className="list-disc pl-6">
                    <li>Everyone should reduce prolonged or heavy exertion outdoors</li>
                    <li>Sensitive groups should avoid outdoor activities</li>
                    <li>Consider using air purifiers indoors</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-50/40 border border-purple-100 rounded-lg p-5">
                <h3 className="font-bold text-purple-800 text-lg mb-2">Very Unhealthy (201-300 AQI)</h3>
                <p className="text-gray-700 mb-3">
                  Health warnings of emergency conditions. The entire population is more likely to be affected.
                </p>
                <div className="bg-white/80 p-3 rounded-lg">
                  <p className="font-medium text-gray-700 mb-2">Recommended actions:</p>
                  <ul className="list-disc pl-6">
                    <li>Everyone should avoid outdoor exertion</li>
                    <li>Stay indoors with windows and doors closed</li>
                    <li>Run air purifiers if available</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-100 to-red-50/40 border border-red-200 rounded-lg p-5">
                <h3 className="font-bold text-red-900 text-lg mb-2">Hazardous (301+ AQI)</h3>
                <p className="text-gray-700 mb-3">
                  Health alert: everyone may experience more serious health effects.
                </p>
                <div className="bg-white/80 p-3 rounded-lg">
                  <p className="font-medium text-gray-700 mb-2">Recommended actions:</p>
                  <ul className="list-disc pl-6">
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
      </div>
    </div>
  );
};

export default AirQualityBlog;