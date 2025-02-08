import React, { useState, useEffect } from "react";
import { ChevronDown, Dumbbell, Users, Calendar, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Dumbbell className="w-8 h-8" />,
      title: "Custom Workouts",
      description: "Personalized training programs tailored to your goals",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Trainers",
      description: "Learn from certified fitness professionals",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Flexible Scheduling",
      description: "Book sessions that fit your lifestyle",
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Track Progress",
      description: "Monitor your gains with detailed analytics",
    },
  ];

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        <div
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-6xl font-bold mb-6">
            <span className="text-black">Welcome to</span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              StrengthStation
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Your journey to peak performance starts here
          </p>
          <Link
            to="/signup"
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105">
              Start Your Journey
            </button>
          </Link>
        </div>

        <div className="absolute bottom-10 w-full text-center animate-bounce">
          <ChevronDown className="w-8 h-8 mx-auto" />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 border border-solid border-zinc-950 bg-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-50 rounded-lg"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why Choose StrengthStation?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-700 p-6 rounded-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl relative"
              >
                <div className="text-blue-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 min-h-screen">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-8">Ready to Transform?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of others who have already started their fitness
            journey with us.
          </p>
          <div className="space-x-4">
            <Link
              to="/signup"
              className="text-blue-500 hover:text-blue-400 transition-colors"
            >
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Sign Up Now
              </button>
            </Link>
            <button className="border border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
