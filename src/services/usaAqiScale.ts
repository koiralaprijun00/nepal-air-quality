// src/services/usaAqiScale.ts

export const getUsaPm25Category = (value: number): string => {
    if (value <= 12.0) return 'Good';
    if (value <= 35.4) return 'Moderate';
    if (value <= 55.4) return 'Unhealthy for Sensitive Groups';
    if (value <= 150.4) return 'Unhealthy';
    if (value <= 250.4) return 'Very Unhealthy';
    if (value <= 350.4) return 'Hazardous';
    return 'Very Hazardous';
  };
  
  export const getUsaPm10Category = (value: number): string => {
    if (value <= 54) return 'Good';
    if (value <= 154) return 'Moderate';
    if (value <= 254) return 'Unhealthy for Sensitive Groups';
    if (value <= 354) return 'Unhealthy';
    if (value <= 424) return 'Very Unhealthy';
    if (value <= 504) return 'Hazardous';
    return 'Very Hazardous';
  };
  
  export const getUsaNo2Category = (value: number): string => {
    if (value <= 53) return 'Good';
    if (value <= 100) return 'Moderate';
    if (value <= 360) return 'Unhealthy for Sensitive Groups';
    if (value <= 649) return 'Unhealthy';
    if (value <= 1249) return 'Very Unhealthy';
    if (value <= 1649) return 'Hazardous';
    return 'Very Hazardous';
  };
  
  export const getUsaO3Category = (value: number): string => {
    if (value <= 54) return 'Good';
    if (value <= 70) return 'Moderate';
    if (value <= 85) return 'Unhealthy for Sensitive Groups';
    if (value <= 105) return 'Unhealthy';
    if (value <= 200) return 'Very Unhealthy';
    return 'Hazardous';
  };
  