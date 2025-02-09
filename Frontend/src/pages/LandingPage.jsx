import React from 'react';
import { 
  ChevronDown, 
  Dumbbell, 
  Users, 
  Calendar, 
  Trophy,
  Target,
  Heart,
  BarChart,
  Clock
} from 'lucide-react';
import { Card, CardContent } from '../Components/card';
import { Link } from 'react-router-dom';

const features = [
  {
    Icon: Dumbbell,
    title: "Smart Workouts",
    description: "AI-powered workout plans that adapt to your progress and preferences"
  },
  {
    Icon: Users,
    title: "Community Support",
    description: "Join a thriving community of fitness enthusiasts and share your journey"
  },
  {
    Icon: Target,
    title: "Goal Setting",
    description: "Set and track personalized fitness goals with milestone celebrations"
  },
  {
    Icon: Heart,
    title: "Health Metrics",
    description: "Monitor vital health statistics and wellness indicators"
  },
  {
    Icon: Calendar,
    title: "Smart Scheduling",
    description: "AI-powered session planning that fits your busy lifestyle"
  },
  {
    Icon: BarChart,
    title: "Progress Analytics",
    description: "Advanced analytics and progress visualization tools"
  },
  {
    Icon: Clock,
    title: "Time Management",
    description: "Efficient workout planning to maximize your time"
  },
  {
    Icon: Trophy,
    title: "Achievements",
    description: "Earn badges and rewards as you reach your fitness goals"
  }
];

const FeatureCard = ({ Icon, title, description }) => (
  <Card className="transform hover:scale-105 transition-all duration-300">
    <CardContent className="p-6">
      <Icon className="w-8 h-8 text-primary mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const Button = ({ variant = 'primary', children, ...props }) => (
  <button
    className={`px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
      variant === 'primary'
        ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
        : 'border border-primary text-primary hover:bg-primary hover:text-primary-foreground'
    }`}
    {...props}
  >
    {children}
  </button>
);

const TestimonialCard = ({ name, role, content }) => (
  <Card className="h-full">
    <CardContent className="p-6">
      <p className="text-muted-foreground mb-4">{content}</p>
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </CardContent>
  </Card>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center p-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              StrengthStation
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Transform your fitness journey with AI-powered personalization
          </p>
          <div className="space-x-4">
            <Link to='/signup'><Button>Get Started Free</Button></Link>
            <Button variant="secondary">View Demo</Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Revolutionary Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah Johnson"
              role="Marathon Runner"
              content="StrengthStation's AI coaching helped me achieve my personal best in just 3 months. The personalized training plans are incredible!"
            />
            <TestimonialCard
              name="Mike Chen"
              role="Fitness Enthusiast"
              content="The community support and progress tracking features keep me motivated. I've never stuck to a fitness program this long before."
            />
            <TestimonialCard
              name="Emily Rodriguez"
              role="CrossFit Athlete"
              content="The smart scheduling and workout customization are game-changers. Perfect for busy professionals who want results."
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-8">Start Your Journey Today</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of members who have transformed their lives with
            StrengthStation's intelligent fitness platform.
          </p>
          <div className="space-x-4">
            <Link to='/signup' ><Button>Sign Up Now</Button></Link>
            <Button variant="secondary">Schedule Demo</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;