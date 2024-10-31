import React, { useState } from 'react'
import { SearchIcon, PlusIcon } from 'lucide-react'
import Sidebar from '../component/Sidebar.jsx'
import FeedPost from '../component/FeedPost.jsx'
import FriendSuggestion from '../component/FriendSuggestion.jsx'
import RouteCard from '../component/RouteCard.jsx'
import TripCard from '../component/TripCard.jsx'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('feed')

  const feedPosts = [
    { id: 1, user: 'Maria López', location: 'Barcelona, Spain', image: '/placeholder.svg?height=300&width=300', likes: 120, comments: 15, description: 'Exploring the beautiful streets of Barcelona! 🇪🇸' },
    { id: 2, user: 'John Smith', location: 'Bali, Indonesia', image: '/placeholder.svg?height=300&width=300', likes: 89, comments: 7, description: 'Found paradise in Bali 🌴🏖️' },
    { id: 3, user: 'Emma Wilson', location: 'Tokyo, Japan', image: '/placeholder.svg?height=300&width=300', likes: 230, comments: 32, description: 'Neon lights and sushi nights in Tokyo! 🍣🗼' },
  ]

  const friendSuggestions = [
    { id: 1, name: 'Carlos Rodríguez', mutualFriends: 5, location: 'Madrid, Spain' },
    { id: 2, name: 'Sophie Chen', mutualFriends: 3, location: 'Shanghai, China' },
    { id: 3, name: 'Ahmed Hassan', mutualFriends: 7, location: 'Cairo, Egypt' },
  ]

  const popularRoutes = [
    { id: 1, name: 'Camino de Santiago', country: 'Spain', distance: '780 km', duration: '30-35 days' },
    { id: 2, name: 'Inca Trail to Machu Picchu', country: 'Peru', distance: '43 km', duration: '4 days' },
    { id: 3, name: 'Tour du Mont Blanc', country: 'France/Italy/Switzerland', distance: '170 km', duration: '11 days' },
  ]

  const upcomingTrips = [
    { id: 1, destination: 'Paris, France', startDate: '2023-08-15', endDate: '2023-08-22' },
    { id: 2, destination: 'Queenstown, New Zealand', startDate: '2023-11-01', endDate: '2023-11-10' },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
          {activeTab === 'feed' && (
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">Travel Feed</h1>
              <div className="space-y-6">
                {feedPosts.map((post) => (
                  <FeedPost key={post.id} {...post} />
                ))}
              </div>
            </div>
          )}
          {activeTab === 'friends' && (
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">Friend Suggestions</h1>
              <div className="space-y-4">
                {friendSuggestions.map((friend) => (
                  <FriendSuggestion key={friend.id} {...friend} />
                ))}
              </div>
            
            </div>
          )}
          {activeTab === 'explore' && (
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">Explore Routes</h1>
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search routes..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <SearchIcon className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                </div>
              </div>
              <div className="space-y-4">
                {popularRoutes.map((route) => (
                  <RouteCard key={route.id} {...route} />
                ))}
              </div>
            </div>
          )}
          {activeTab === 'trips' && (
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">My Trips</h1>
              <div className="space-y-4">
                {upcomingTrips.map((trip) => (
                  <TripCard key={trip.id} {...trip} />
                ))}
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full">
                  Plan New Trip
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Placeholder for Map Removed */}
        <div className="flex-1 relative">
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4">
            <h2 className="font-semibold mb-2">Current Route</h2>
            <p>Distance: 5.2 km</p>
            <p>Estimated time: 1h 15min</p>
            <button className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 w-full">
              Save Route
            </button>
          </div>
          <button className="absolute bottom-6 right-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors">
            <PlusIcon className="w-6 h-6" />
          </button>
        </div>
      </main>
    </div>
  )
}
