import React from 'react';
import { HeartIcon, MessageSquare, ShareIcon, BookmarkIcon } from 'lucide-react';

export default function FeedPost({ id, user, location, image, likes, comments, description }) {
  return (
    <div key={id} className="bg-white rounded-lg shadow">
      <div className="p-4">
        <div className="flex items-center mb-2">
          <img src="/placeholder.svg?height=40&width=40" alt={user} className="w-10 h-10 rounded-full mr-3" />
          <div>
            <p className="font-semibold">{user}</p>
            <p className="text-sm text-gray-500">{location}</p>
          </div>
        </div>
      </div>
      <img src={image} alt={`Post by ${user}`} className="w-full h-64 object-cover" />
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-2">
          <button className="text-gray-600 hover:text-red-500">
            <HeartIcon className="w-6 h-6" />
          </button>
          <button className="text-gray-600 hover:text-blue-500">
            <MessageSquare className="w-6 h-6" />
          </button>
          <button className="text-gray-600 hover:text-green-500">
            <ShareIcon className="w-6 h-6" />
          </button>
          <button className="text-gray-600 hover:text-yellow-500 ml-auto">
            <BookmarkIcon className="w-6 h-6" />
          </button>
        </div>
        <p className="font-semibold">{likes} likes</p>
        <p className="mt-1">{description}</p>
        <p className="text-sm text-gray-600 mt-1">View all {comments} comments</p>
        <form className="mt-3 flex">
          <input type="text" placeholder="Add a comment..." className="flex-1 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500" />
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700">Post</button>
        </form>
      </div>
    </div>
  );
}
