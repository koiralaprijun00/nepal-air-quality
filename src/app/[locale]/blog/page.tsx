// src/app/[locale]/blog/page.tsx
'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, InformationCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

const AirQualityBlog = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const t = useTranslations('blog');
  
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
            {t('navigation.backToDashboard')}
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">{t('header.title')}</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl">
            {t('header.subtitle')}
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Introduction */}
          <div className="p-8 border-b border-gray-100">
            <p className="text-lg text-gray-600 mb-6">
              {t('introduction.mainText')}
            </p>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-start">
                <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  {t('introduction.disclaimer.text')}
                </p>
              </div>
            </div>
          </div>

          {/* Common Air Pollutants */}
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{t('pollutants.title')}</h2>
            <p className="text-gray-600 mb-6">
              {t('pollutants.description')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              {[
                {
                  key: 'particulateMatter',
                  colorClass: 'from-green-50 to-green-50/40 border-green-100',
                  textColorClass: 'text-green-800'
                },
                {
                  key: 'ozone',
                  colorClass: 'from-blue-50 to-blue-50/40 border-blue-100',
                  textColorClass: 'text-blue-800'
                },
                {
                  key: 'carbonMonoxide',
                  colorClass: 'from-purple-50 to-purple-50/40 border-purple-100',
                  textColorClass: 'text-purple-800'
                },
                {
                  key: 'nitrogenDioxide',
                  colorClass: 'from-yellow-50 to-yellow-50/40 border-yellow-100',
                  textColorClass: 'text-yellow-800'
                },
                {
                  key: 'sulfurDioxide',
                  colorClass: 'from-orange-50 to-orange-50/40 border-orange-100',
                  textColorClass: 'text-orange-800'
                },
                {
                  key: 'ammonia',
                  colorClass: 'from-teal-50 to-teal-50/40 border-teal-100',
                  textColorClass: 'text-teal-800'
                }
              ].map(({ key, colorClass, textColorClass }) => (
                <div key={key} className={`bg-gradient-to-br ${colorClass} border rounded-lg p-4 hover:shadow-sm transition-shadow`}>
                  <h3 className={`text-lg font-semibold ${textColorClass} mb-2`}>
                    {t(`pollutants.items.${key}.title`)}
                  </h3>
                  <p className="text-gray-700 mb-2">
                    {t(`pollutants.items.${key}.description`)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="font-medium">{t('pollutants.sourcesLabel')}:</span>{' '}
                    {t(`pollutants.items.${key}.sources`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* AQI Calculation Section */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-4">{t('aqiCalculation.title')}</h2>
            <p className="mb-6">{t('aqiCalculation.description')}</p>

            {/* US EPA AQI */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">{t('aqiCalculation.usEpa.title')}</h3>
              <p className="mb-4">{t('aqiCalculation.usEpa.description')}</p>
              
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p className="font-mono text-center">{t('aqiCalculation.usEpa.formula')}</p>
              </div>

              <div className="mb-6">
                <p className="font-semibold mb-2">{t('aqiCalculation.usEpa.variables.title')}</p>
                <ul className="list-none space-y-2">
                  <li>{t('aqiCalculation.usEpa.variables.c')}</li>
                  <li>{t('aqiCalculation.usEpa.variables.cLow')}</li>
                  <li>{t('aqiCalculation.usEpa.variables.cHigh')}</li>
                  <li>{t('aqiCalculation.usEpa.variables.iLow')}</li>
                  <li>{t('aqiCalculation.usEpa.variables.iHigh')}</li>
                </ul>
              </div>

              <p className="text-sm text-gray-600 italic">{t('aqiCalculation.usEpa.note')}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AirQualityBlog;