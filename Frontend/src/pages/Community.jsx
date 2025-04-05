import React, { useState } from 'react';
import { MessageCircle, ThumbsUp, Star } from 'lucide-react';

const CommunityPage = () => {
  // State to manage user messages and feedback
  const [messages, setMessages] = useState([
    {
      id: 1,
      username: 'Sarah Johnson',
      message: 'This platform has been incredibly helpful for my project!',
      timestamp: '2 hours ago',
      likes: 24,
      rating: 5
    },
    {
      id: 2,
      username: 'Mike Rodriguez',
      message: 'Great community and resources. Loving the support!',
      timestamp: '1 day ago',
      likes: 15,
      rating: 4
    },
    {
      id: 3,
      username: 'Emily Chen',
      message: 'Excited to be part of this amazing community!',
      timestamp: '3 days ago',
      likes: 10,
      rating: 5
    }
  ]);

  // State for new message input
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');

  // Handle adding a new message
  const handleAddMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !username.trim()) return;

    const newMessageObj = {
      id: messages.length + 1,
      username,
      message: newMessage,
      timestamp: 'Just now',
      likes: 0,
      rating: 0
    };

    setMessages([newMessageObj, ...messages]);
    setNewMessage('');
    setUsername('');
  };

  // Handle liking a message
  const handleLike = (id) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, likes: msg.likes + 1 } : msg
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Community Hub
      </h1>

      {/* Message Input Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <form onSubmit={handleAddMessage} className="space-y-4">
          <input 
            type="text"
            placeholder="Your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea 
            placeholder="Share your thoughts with the community..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full p-2 border rounded h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Post Message
          </button>
        </form>
      </div>

      {/* Community Messages Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Community Messages
        </h2>
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4"
          >
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-800">{msg.username}</h3>
                <span className="text-sm text-gray-500">{msg.timestamp}</span>
              </div>
              <p className="text-gray-600 mb-4">{msg.message}</p>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => handleLike(msg.id)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
                >
                  <ThumbsUp size={16} />
                  <span>{msg.likes} Likes</span>
                </button>
                
                <div className="flex items-center space-x-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < msg.rating ? '#FFD700' : 'none'}
                      strokeWidth={1}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;