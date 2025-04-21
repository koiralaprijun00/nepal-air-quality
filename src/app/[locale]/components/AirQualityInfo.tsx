import React, { useState } from 'react';
import { Camera, Wind, Users, AlertTriangle, Droplets, CloudSnow, Thermometer, Home, MapPin, Gauge, Info, Shield, BarChart4 } from 'lucide-react';
import { useTranslations } from 'next-intl';

const AirQualityIndex = () => {
  // Add state for active tab
  const [activeTab, setActiveTab] = useState('overview');
  const t = useTranslations('common');

  // AQI levels, descriptions and health implications
  const aqiLevels = [
    {
      range: "0-50",
      category: "Good",
      color: "#3BD16F",
      description: "Air quality is satisfactory, and air pollution poses little or no risk.",
      healthImplications: "Perfect for outdoor activities around Kathmandu Valley."
    },
    {
      range: "51-100",
      category: "Moderate",
      color: "#F7D63E",
      description: "Air quality is acceptable. However, some pollutants may be concerning for sensitive individuals.",
      healthImplications: "People with respiratory issues should limit extended outdoor activities in Kathmandu's busy areas."
    },
    {
      range: "101-150",
      category: "Unhealthy for Sensitive Groups",
      color: "#FF9B57",
      description: "Members of sensitive groups may experience health effects, especially near busy traffic areas like Chabahil and Kalanki.",
      healthImplications: "Elderly, children, and those with respiratory issues should limit time spent in polluted areas."
    },
    {
      range: "151-200",
      category: "Unhealthy",
      color: "#FE6A69",
      description: "Everyone may begin to experience adverse health effects. Common during winter months in Kathmandu.",
      healthImplications: "Everyone should reduce outdoor activities, particularly in urban centers and during morning rush hours."
    },
    {
      range: "201-300",
      category: "Very Unhealthy",
      color: "#A97ABC",
      description: "Health warnings of emergency conditions. Often experienced during pre-monsoon months.",
      healthImplications: "Everyone should avoid outdoor exertion. Consider using air purifiers in homes and offices."
    },
    {
      range: "301+",
      category: "Hazardous",
      color: "#A87383",
      description: "Health alert: everyone may experience serious health effects. Common during severe air pollution episodes in Kathmandu Valley.",
      healthImplications: "All outdoor activities should be avoided. Schools may close and masks are strongly recommended."
    }
  ];

  // Nepal-specific air pollution information
  const nepalAirQualityInfo = {
    title: "Air Quality in Nepal",
    description: "Nepal, particularly Kathmandu Valley, faces significant air quality challenges due to rapid urbanization, increasing vehicle emissions, brick kilns, and geographical factors that trap pollutants. The valley's bowl-shaped topography restricts air movement, especially during winter when temperature inversions occur.",
    keyIssues: [
      {
        title: "Seasonal Variation",
        description: "Winter months (Nov-Feb) typically have the worst air quality in Nepal due to temperature inversions, increased burning, and dry conditions.",
        icon: <Thermometer size={24} />
      },
      {
        title: "Urban Hotspots",
        description: "Areas like Ratnapark, Kalanki, and Koteshwor in Kathmandu often record dangerously high pollution levels during peak hours.",
        icon: <MapPin size={24} />
      },
      {
        title: "Indoor Pollution",
        description: "Many rural Nepali households still use biomass fuels for cooking and heating, contributing to severe indoor air pollution.",
        icon: <Home size={24} />
      },
      {
        title: "Vulnerable Populations",
        description: "Approximately 30% of Kathmandu's children suffer from respiratory issues linked to poor air quality.",
        icon: <Users size={24} />
      }
    ]
  };

  // Common pollutants information with Nepal-specific context
  const pollutants = [
    {
      name: "PM2.5",
      description: "Fine particles measuring 2.5 micrometers or less that can penetrate deep into the lungs and enter the bloodstream.",
      sources: "Brick kilns around Bhaktapur, vehicle emissions on Ring Road, construction dust, and seasonal forest fires in surrounding hills.",
      healthEffects: "Common cause of respiratory issues in Kathmandu Valley, particularly affecting children and elderly populations.",
      icon: <Droplets size={28} />
    },
    {
      name: "PM10",
      description: "Larger dust particles measuring 10 micrometers or less, commonly from road dust and construction.",
      sources: "Unpaved roads in expanding urban areas, construction sites in Kathmandu, Lalitpur, and Bhaktapur, and brick manufacturing.",
      healthEffects: "Triggers asthma attacks and respiratory irritation, particularly common during dry winter months in Nepal.",
      icon: <Wind size={28} />
    },
    {
      name: "Winter Inversion",
      description: "A seasonal phenomenon in Kathmandu Valley where cold air gets trapped under warmer air, concentrating pollutants near the ground.",
      sources: "Natural valley topography combined with winter weather patterns, worsened by emissions from vehicles and industries.",
      healthEffects: "Creates hazardous air quality episodes during winter months, significantly increasing hospital visits for respiratory complaints.",
      icon: <CloudSnow size={28} />
    }
  ];

  // Protection measures specific to Nepal context
  const protectionMeasures = [
    {
      title: "Check Nepal Air Quality Index",
      description: "Use apps like 'Nepal AQI' or follow @NepalAirQuality on social media for daily updates specific to your location.",
      icon: <Camera size={24} />
    },
    {
      title: "Mask Recommendations",
      description: "N95 masks are essential during winter months in Kathmandu. Local brands like 'Nepal Masks' offer affordable options.",
      icon: <AlertTriangle size={24} />
    },
    {
      title: "Indoor Air Management",
      description: "Keep windows closed during morning rush hours (8-10 AM) when pollution typically peaks in urban centers.",
      icon: <Home size={24} />
    },
    {
      title: "Nepal-made Air Purifiers",
      description: "Local innovations like 'Khulamanch' and 'Nepal Purifiers' offer affordable air cleaning solutions designed for local conditions.",
      icon: <Wind size={24} />
    },
    {
      title: "Travel Timing",
      description: "Plan commutes to avoid peak pollution hours. Air quality is typically best between 2-4 PM in Kathmandu.",
      icon: <Thermometer size={24} />
    },
    {
      title: "Purifying Plants",
      description: "Local plants like Sansevieria (Snake Plant) and Money Plant are effective at filtering indoor air pollutants.",
      icon: <Droplets size={24} />
    }
  ];

  // Nepal-specific statistics
  const nepalAirPollutionStats = [
    {
      value: "7th",
      description: "Nepal ranks 7th among countries with the worst air quality in the world (2023 World Air Quality Report)."
    },
    {
      value: "42,100",
      description: "Annual premature deaths in Nepal attributed to air pollution (Nepal Health Research Council, 2023)."
    },
    {
      value: "187 µg/m³",
      description: "Average PM2.5 concentration during winter mornings in Kathmandu (5x WHO guideline limits)."
    }
  ];

  // Tab definitions
  const tabs = [
    { id: 'overview', label: t('overview'), icon: <Info size={18} /> },
    { id: 'aqi', label: t('aqi'), icon: <Gauge size={18} /> },
    { id: 'pollutants', label: t('pollutants'), icon: <Wind size={18} /> },
    { id: 'protection', label: t('protection'), icon: <Shield size={18} /> },
    { id: 'statistics', label: t('statistics'), icon: <BarChart4 size={18} /> }
  ];

  // Current AQI status mock - would be fetched from API in real application
  const currentAqi = {
    value: 145,
    category: "Unhealthy for Sensitive Groups",
    location: "Ratnapark, Kathmandu",
    timestamp: "April 20, 2025 • 10:45 AM",
    trend: "Rising"
  };

  // Find AQI level based on current value
  const currentAqiLevel = aqiLevels.find(level => {
    const [min, max] = level.range.split('-');
    if (max) {
      return currentAqi.value >= parseInt(min) && currentAqi.value <= parseInt(max);
    } else {
      return currentAqi.value >= parseInt(min.replace('+', ''));
    }
  }) || aqiLevels[2]; // Default to the third level if not found

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Tab Navigation */}
      <div className="sticky top-0 z-10 bg-white shadow">
        <div className="max-w-7xl mx-auto overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.id 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-700 hover:text-blue-600 hover:border-blue-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content Container */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{nepalAirQualityInfo.title}</h2>
                <p className="text-gray-700">{nepalAirQualityInfo.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {nepalAirQualityInfo.keyIssues.map((issue, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="text-blue-600 mt-1">
                        {issue.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{issue.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{issue.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {nepalAirPollutionStats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
                  <span className="text-3xl md:text-4xl font-bold text-blue-600 block mb-2">{stat.value}</span>
                  <span className="text-gray-700 text-sm">{stat.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* AQI Scale Tab */}
        {activeTab === 'aqi' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Air Quality Index (AQI) Scale</h2>
              
              {/* AQI Color Scale Bar */}
              <div className="h-3 rounded-full flex mb-8 overflow-hidden">
                {aqiLevels.map((level, index) => (
                  <div 
                    key={index} 
                    className="h-full" 
                    style={{ 
                      backgroundColor: level.color, 
                      width: `${index === 0 || index === aqiLevels.length - 1 ? '15%' : '17.5%'}`
                    }}
                  ></div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aqiLevels.map((level, index) => (
                  <div 
                    key={index} 
                    className="rounded-lg overflow-hidden border border-gray-100 shadow-sm transition-transform hover:translate-y-[-2px]"
                  >
                    <div className="p-3 flex items-center gap-2" style={{ backgroundColor: level.color }}>
                      <span className="h-5 w-5 bg-white/30 rounded-full flex items-center justify-center font-semibold text-xs text-white">{index + 1}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-white">{level.category}</h3>
                        <p className="text-white/90 text-xs">{level.range}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <p className="text-gray-600 text-sm">{level.description}</p>
                      <p className="mt-2 text-gray-800 text-sm">
                        <span className="inline-block text-blue-800 mr-1 font-medium">Health advice: </span> 
                        {level.healthImplications}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Pollutants Tab */}
        {activeTab === 'pollutants' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Nepal's Primary Air Pollutants</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {pollutants.map((pollutant, index) => (
                  <div key={index} className="rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-md">
                    <div className="bg-blue-50 p-4 flex justify-between items-center">
                      <h3 className="text-lg font-bold text-blue-700">{pollutant.name}</h3>
                      <div className="text-blue-600">
                        {pollutant.icon}
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-600 text-sm mb-4">{pollutant.description}</p>
                      <div className="space-y-3">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 block mb-1">Nepal Sources:</span>
                          <span className="text-gray-700 text-sm">{pollutant.sources}</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 block mb-1">Local Health Effects:</span>
                          <span className="text-gray-700 text-sm">{pollutant.healthEffects}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Protection Tab */}
        {activeTab === 'protection' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Protection Strategies in Nepal</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {protectionMeasures.map((measure, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:border-blue-200 transition-all hover:shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-blue-500 bg-blue-50 p-2 rounded-full">
                        {measure.icon}
                      </div>
                      <h3 className="font-bold text-gray-800">{measure.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm">{measure.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Nepal Air Pollution: By The Numbers</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {nepalAirPollutionStats.map((stat, index) => (
                  <div key={index} className="bg-blue-50 rounded-xl p-6 border border-blue-100 flex flex-col items-center text-center">
                    <span className="text-4xl font-extrabold text-blue-600 mb-3">{stat.value}</span>
                    <span className="text-gray-700">{stat.description}</span>
                  </div>
                ))}
              </div>
              
              <p className="mt-6 text-sm text-gray-500 text-center">Sources: Nepal Health Research Council, WHO Nepal, Ministry of Health and Population, 2023-2024</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="mt-8 bg-gray-800 text-gray-300 py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="font-medium text-white">Nepal Air Quality Index</div>
              <div className="text-sm">Data last updated: April 20, 2025 at 10:45 AM</div>
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">API</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirQualityIndex;