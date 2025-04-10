import React from 'react';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';
import PricingCard from '../components/PricingCard';
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
      <Footer />
    </div>
  );
}

export default Landing;