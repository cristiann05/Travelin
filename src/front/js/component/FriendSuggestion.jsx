import React from 'react';

export default function FriendSuggestion({ id, name, mutualFriends, location }) {
  return (
    <div key={id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
      <div className="flex items-center">
        <img src="/placeholder.svg?height=48&width=48" alt={name} className="w-12 h-12 rounded-full mr-4" />
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-500">{mutualFriends} mutual friends</p>
          <p className="text-sm text-gray-500">{location}</p>
        </div>
      </div>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
        Add Friend
      </button>
    </div>
  );
}
