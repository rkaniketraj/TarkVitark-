import React from 'react';
import {
  Globe2,
  MessageSquare,
  Languages,
  BarChart3,
  Shield,
  Users,
  Mic,
  ChevronRight,
  Heart,
  CheckCircle2,
} from 'lucide-react';

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="  h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-black">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function PricingCard({ tier, price, features, isPopular }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-8 ${isPopular ? 'border-2 border-blue-500 relative' : ''}`}>
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm ">
          Most Popular
        </span>
      )}
      <h3 className="text-2xl font-bold mb-2 text-black">{tier}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold text-black">{price}</span>
        {price !== 'Free' && <span className="text-gray-600">/month</span>}
      </div>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-black">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`w-full mt-8 py-3 px-6 rounded-lg font-semibold transition-colors  ${
        isPopular 
          ? 'bg-blue-600 text-white hover:bg-blue-700' 
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      }`}>
        Get Started
      </button>
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 min-w-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 to-violet-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Debate the World. Understand Everyone.
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Join global discussions in real time, no language barriers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2">
                Start Debating
                <ChevronRight className="h-5 w-5" />
              </button>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                Host a Session
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-black text-3xl md:text-4xl font-bold text-center mb-16">
          Everything you need for global debates
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={Languages}
            title="Real-time Translation"
            description="Break language barriers with instant translation in 100+ languages"
          />
          <FeatureCard
            icon={Mic}
            title="Voice & Text Debates"
            description="Choose your preferred way to communicate - speak or type"
          />
          <FeatureCard
            icon={Globe2}
            title="Global Reach"
            description="Connect with debaters from every corner of the world"
          />
          <FeatureCard
            icon={Heart}
            title="Sentiment Feedback"
            description="Real-time audience sentiment analysis and engagement metrics"
          />
          <FeatureCard
            icon={Shield}
            title="Smart Moderation"
            description="AI-powered tools to keep discussions civil and productive"
          />
          <FeatureCard
            icon={BarChart3}
            title="Live Analytics"
            description="Track engagement, participation, and debate outcomes"
          />
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-black">
            How it Works
          </h2>
          <div className="flex flex-col md:flex-row gap-8 justify-between items-center">
            <div className="flex-1 text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">Join</h3>
              <p className="text-gray-600">Create your account in seconds</p>
            </div>
            <div className="hidden md:block h-0.5 flex-1 bg-blue-100"></div>
            <div className="flex-1 text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">Choose Debate</h3>
              <p className="text-gray-600">Pick from live topics or create your own</p>
            </div>
            <div className="hidden md:block h-0.5 flex-1 bg-blue-100"></div>
            <div className="flex-1 text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">Start Speaking</h3>
              <p className="text-gray-600">Communicate in your language</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-black">
          Choose Your Plan
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <PricingCard
            tier="Free"
            price="$0"
            features={[
              'Public debates',
              'Basic translation',
              'Text-only discussions',
              'Community moderation'
            ]}
          />
          <PricingCard
            tier="Private"
            price="$29"
            features={[
              'Private debate rooms',
              'Advanced translation',
              'Voice + Text support',
              'Basic analytics',
              'Priority support'
            ]}
            isPopular
          />
          <PricingCard
            tier="Premium"
            price="$99"
            features={[
              'Enterprise features',
              'Premium translation',
              'Advanced analytics',
              'Custom branding',
              'API access',
              'Dedicated support'
            ]}
            
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p>© 2025 Tark-Vitark. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;