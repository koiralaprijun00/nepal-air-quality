
'use client'

import React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              <p className="text-gray-300 leading-relaxed">
                We collect air quality data from public APIs and sources to provide real-time monitoring services. 
                We do not collect personal information from users unless explicitly provided.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How We Use Information</h2>
              <p className="text-gray-300 leading-relaxed">
                The air quality data is used solely for displaying current environmental conditions 
                and helping users make informed decisions about air quality in their area.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Sources</h2>
              <p className="text-gray-300 leading-relaxed">
                Our air quality data comes from reputable environmental monitoring services and public APIs. 
                We do not guarantee the accuracy of third-party data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have any questions about this privacy policy, please contact us through our website.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
