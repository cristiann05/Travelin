import React from 'react';

export default function TripCard({ id, destination, startDate, endDate }) {
  return (
    <div key={id} className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold text-lg">{destination}</h3>
      <p className="text-sm text-gray-600 mt-1">
        {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
      </p>
      <div className="mt-3 flex space-x-2">
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex-1">
          View Details
        </button>
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 flex-1">
          Edit Trip
        </button>
      </div>
    </div>
  );
}
