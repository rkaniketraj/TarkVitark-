import React from 'react'
import { CheckCircle2 } from 'lucide-react';


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
export default PricingCard