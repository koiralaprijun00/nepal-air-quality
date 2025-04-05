// src/app/about/page.tsx
'use client'

import React from 'react';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-block mb-8 text-white hover:text-blue-200 transition">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About This Project</h1>
          <p className="text-xl md:text-2xl max-w-3xl">
            Monitoring and understanding air quality for healthier communities
          </p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="prose lg:prose-xl max-w-none">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p>
                Our mission is to provide accessible, accurate, and actionable air quality information to help people make informed decisions about their health and environment. We believe that everyone has the right to know what's in the air they breathe.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">What We Do</h2>
              <p>
                This project combines data from OpenWeather's Air Pollution API with user-friendly visualizations and educational content. Our features include:
              </p>
              
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Real-time air quality monitoring for cities across Nepal</li>
                <li>Conversion between different AQI standards (OpenWeather and US EPA)</li>
                <li>Detailed city views with historical air quality trends</li>
                <li>Educational resources about air pollution and its health impacts</li>
                <li>Recommendations for reducing exposure to air pollution</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Data Sources</h2>
              <p>
                We source our air quality data from OpenWeather's Air Pollution API, which provides current, forecast, and historical air pollution data for locations around the world. The API includes information on:
              </p>
              
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Particulate matter (PM2.5 and PM10)</li>
                <li>Carbon monoxide (CO)</li>
                <li>Nitrogen dioxide (NO2)</li>
                <li>Sulfur dioxide (SO2)</li>
                <li>Ozone (O3)</li>
                <li>Ammonia (NH3)</li>
              </ul>
              
              <p className="mt-4">
                For more information about the OpenWeather API, visit <a href="https://openweathermap.org/api/air-pollution" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">their official documentation</a>.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">AQI Calculations</h2>
              <p>
                While OpenWeather provides its own Air Quality Index on a scale of 1-5, we also calculate the US EPA Air Quality Index for better cross-reference with international standards. The US EPA AQI is calculated using breakpoints for different pollutant concentrations and a piecewise linear function to convert concentrations to a 0-500 scale.
              </p>
              
              <p className="mt-4">
                You can learn more about the US EPA AQI calculation in our <Link href="/blog" className="text-blue-600 hover:underline">educational blog</Link>.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Technology Stack</h2>
              <p>
                This project is built using:
              </p>
              
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Next.js - React framework for web development</li>
                <li>TypeScript - For type-safe code</li>
                <li>Tailwind CSS - For responsive design and styling</li>
                <li>Recharts - For data visualization</li>
                <li>OpenWeather API - For air quality data</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Future Plans</h2>
              <p>
                We're continuously working to improve this platform. Some features we're planning to add include:
              </p>
              
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Interactive maps showing air quality across wider geographic areas</li>
                <li>Personalized alerts for poor air quality events</li>
                <li>Integration with health data to show correlations between air quality and health outcomes</li>
                <li>Support for user-contributed sensor data</li>
                <li>Air quality forecasts and trend analysis</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Get Involved</h2>
              <p>
                We welcome contributions and feedback from the community. If you're interested in contributing to this project or have suggestions for improvements, please reach out to us.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Disclaimer</h2>
              <p>
                This platform is provided for educational and informational purposes only. While we strive for accuracy, the air quality data and health recommendations should not be used as the sole basis for medical decisions. Always consult with healthcare professionals for medical advice.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-center">
              &copy; {new Date().getFullYear()} Air Quality Monitoring Project
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;