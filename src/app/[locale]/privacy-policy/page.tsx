'use client'

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const PrivacyPolicyPage = () => {
  const t = useTranslations('common');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            {t('backToHome')}
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Nepal Air Quality ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience when using our air quality monitoring application. This Privacy Policy explains how we collect, use, and protect your information when you use our Progressive Web App (PWA).
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">Location Data</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              To provide you with accurate air quality information, our app may request access to your location data (latitude and longitude coordinates). This information is used solely to:
            </p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
              <li>Fetch air quality data for your current location</li>
              <li>Display relevant air quality information on maps</li>
              <li>Provide location-specific air quality recommendations</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">Usage Data</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We may collect anonymous usage data to improve our app's performance and user experience:
            </p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
              <li>App performance metrics and error reports</li>
              <li>Feature usage patterns (which cities or features are accessed most)</li>
              <li>Device information (browser type, operating system)</li>
              <li>App installation and update data</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">Third-Party Data</h3>
            <p className="text-gray-700 leading-relaxed">
              Our app integrates with third-party services to provide air quality data:
            </p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li><strong>OpenWeather API:</strong> Provides air quality and weather data</li>
              <li><strong>Mapbox:</strong> Provides mapping and location services</li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li>Provide real-time air quality data for your location</li>
              <li>Display air quality information on interactive maps</li>
              <li>Show air quality trends and historical data</li>
              <li>Improve app performance and user experience</li>
              <li>Fix bugs and technical issues</li>
              <li>Analyze usage patterns to enhance features</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Sharing and Disclosure</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share information only in the following circumstances:
            </p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li><strong>Service Providers:</strong> We share location data with OpenWeather API and Mapbox to provide air quality and mapping services</li>
              <li><strong>Legal Requirements:</strong> If required by law or to protect our rights and safety</li>
              <li><strong>App Store Requirements:</strong> As required by Google Play Console or other app store policies</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate security measures to protect your information:
            </p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li>Secure HTTPS connections for all data transmission</li>
              <li>Encryption of sensitive data</li>
              <li>Regular security updates and monitoring</li>
              <li>Limited access to personal data on a need-to-know basis</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights and Choices</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li><strong>Location Access:</strong> You can deny location access in your device settings</li>
              <li><strong>Data Deletion:</strong> You can request deletion of any stored personal data</li>
              <li><strong>App Uninstallation:</strong> Uninstalling the app removes locally stored data</li>
              <li><strong>Contact Us:</strong> You can contact us with any privacy concerns</li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our app is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
          </section>

          {/* International Users */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">International Users</h2>
            <p className="text-gray-700 leading-relaxed">
              Our app is available worldwide. If you are accessing our app from outside Nepal, please note that your information may be transferred to, stored, and processed in Nepal where our servers are located. By using our app, you consent to such transfer.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@nepalairquality.com<br />
                <strong>Subject:</strong> Privacy Policy Inquiry
              </p>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t pt-6 mt-8">
            <p className="text-sm text-gray-500 text-center">
              This Privacy Policy is effective as of the date listed above and applies to all users of the Nepal Air Quality app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 