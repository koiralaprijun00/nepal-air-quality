
'use client'

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const PrivacyPolicyPage = () => {
  const t = useTranslations('common');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            {t('backToHome')}
          </Link>
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-gray-800 border border-gray-700 p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Introduction</h2>
            <p className="text-gray-300 leading-relaxed">
              Welcome to Nepal Air Quality ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience when using our air quality monitoring application. This Privacy Policy explains how we collect, use, and protect your information when you use our Progressive Web App (PWA).
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Automatically Collected Information</h3>
                <ul className="text-gray-300 space-y-2 ml-4">
                  <li>• Browser type and version</li>
                  <li>• Operating system</li>
                  <li>• IP address (anonymized)</li>
                  <li>• General location data (city/country level only)</li>
                  <li>• Usage patterns and preferences</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Information You Provide</h3>
                <ul className="text-gray-300 space-y-2 ml-4">
                  <li>• Search queries for cities or locations</li>
                  <li>• Language preferences</li>
                  <li>• Any feedback or contact information you voluntarily provide</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h2>
            <ul className="text-gray-300 space-y-2">
              <li>• To provide accurate air quality information for your requested locations</li>
              <li>• To improve our service and user experience</li>
              <li>• To analyze usage patterns and optimize performance</li>
              <li>• To provide localized content and language support</li>
              <li>• To ensure the security and proper functioning of our application</li>
            </ul>
          </section>

          {/* Data Sources */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Data Sources</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Our air quality data comes from reliable third-party sources:
            </p>
            <ul className="text-gray-300 space-y-2">
              <li>• OpenWeather Air Pollution API for air quality measurements</li>
              <li>• Weather data from OpenWeather API</li>
              <li>• Geographic data from Mapbox services</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Data Sharing and Third Parties</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties. We may share aggregated, anonymized data for research or public health purposes. We work with the following service providers:
            </p>
            <ul className="text-gray-300 space-y-2">
              <li>• Mapbox (for map services and geographic data)</li>
              <li>• OpenWeather (for air quality and weather data)</li>
              <li>• Replit (for hosting and deployment services)</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Data Security</h2>
            <p className="text-gray-300 leading-relaxed">
              We implement appropriate security measures to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Your Rights</h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Access: You can request information about the data we collect</li>
              <li>• Correction: You can request correction of inaccurate data</li>
              <li>• Deletion: You can request deletion of your data</li>
              <li>• Portability: You can request a copy of your data</li>
            </ul>
          </section>

          {/* Cookies and Local Storage */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Cookies and Local Storage</h2>
            <p className="text-gray-300 leading-relaxed">
              We use minimal cookies and local storage to enhance your experience, such as remembering your language preference and recently searched locations. You can disable cookies in your browser settings, though this may affect some functionality.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify users of significant changes by updating the "Last updated" date at the top of this policy.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us through our application or visit our main page for more information.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
