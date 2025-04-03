// components/HistoricalData.tsx

import React from 'react';

interface HistoricalDataProps {
  data: {
    date: string;
  air_quality: number;
  co_surface: number;
  pm10: number;
  pm25: number;
  so2_surface: number;
  aerosol_550?: number;
  no2_surface?: number;
  ozone_surface?: number;
  }[];
}

const HistoricalData: React.FC<HistoricalDataProps> = ({ data }) => {
  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Historical Air Quality Data</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Air Quality</th>
            <th className="px-4 py-2">CO</th>
            <th className="px-4 py-2">PM10</th>
            <th className="px-4 py-2">PM2.5</th>
            <th className="px-4 py-2">SO2</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{item.date}</td>
              <td className="px-4 py-2">{item.air_quality}</td>
              <td className="px-4 py-2">{item.co_surface}</td>
              <td className="px-4 py-2">{item.pm10}</td>
              <td className="px-4 py-2">{item.pm25}</td>
              <td className="px-4 py-2">{item.so2_surface}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoricalData;
