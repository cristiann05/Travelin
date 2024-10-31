import React from 'react';
import { MapIcon, CalendarIcon } from 'lucide-react';

export default function RouteCard({ id, name, country, distance, duration }) {
  return (
    <div key={id} className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold text-lg">{name}</h3>
      <p className="text-sm text-gray-600 mt-1">{country}</p>
      <div className="flex items-center mt-2 text-sm text-gray-500">
        <MapIcon className="w-4 h-4 mr-1" />
        <span>{distance}</span>
        <CalendarIcon className="w-4 h-4 ml-4 mr-1" />
        <span>{duration}</span>
      </div>
      <button className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 w-full">
        View Route
      </button>
    </div>
  );
}
