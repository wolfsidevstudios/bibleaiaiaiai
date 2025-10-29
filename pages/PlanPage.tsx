import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { plans } from '../data/plans';

const PlanPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const plan = plans.find(p => p.id === planId);

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white">
        <h2 className="text-2xl mb-4">Plan not found</h2>
        <Link to="/search" className="text-yellow-400 hover:underline">Go back to Explore</Link>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="relative h-64">
        <img src={plan.image} alt={plan.title} className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute top-0 left-0 p-4">
           <Link to="/search" className="text-white bg-black bg-opacity-50 rounded-full p-2">
              <ArrowLeft size={24} />
           </Link>
        </div>
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-4xl font-bold">{plan.title}</h1>
          <p className="text-lg text-gray-300">{plan.duration}</p>
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-gray-300 mb-6">{plan.description}</p>
        <button className="w-full bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors mb-8">
            Start Plan
        </button>

        <div className="space-y-3">
            {plan.content.map(day => (
                <details key={day.day} className="bg-gray-900 rounded-lg overflow-hidden">
                    <summary className="p-4 font-semibold cursor-pointer flex justify-between items-center">
                        Day {day.day}: {day.title}
                        <ChevronDown className="w-5 h-5 transition-transform transform details-open:rotate-180" />
                    </summary>
                    <div className="p-4 border-t border-gray-800">
                        <p className="text-yellow-400 font-bold mb-2">{day.scripture}</p>
                        <p className="text-gray-300 font-serif leading-relaxed mb-4">{day.body}</p>
                        <p className="text-gray-400 italic text-sm">{day.prayer}</p>
                    </div>
                </details>
            ))}
             {plan.id !== 'courage-in-crisis' && <p className="text-center text-gray-500 py-4">...and more</p>}
        </div>
      </div>
    </div>
  );
};

// Add this small CSS helper to your index.html head for the details summary icon rotation
// <style>
//   details[open] > summary .details-open\:rotate-180 {
//     transform: rotate(180deg);
//   }
// </style>

export default PlanPage;
