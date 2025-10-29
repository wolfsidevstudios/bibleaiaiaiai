import React, { useState, useEffect } from 'react';
import { Plan } from '../types';
import { savePlan, isPlanSaved } from '../services/storageService';
import { Sparkles, ClipboardList, Check } from 'lucide-react';

interface PlanMessageProps {
  plan: Plan;
}

const PlanMessage: React.FC<PlanMessageProps> = ({ plan }) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsSaved(isPlanSaved(plan.id));
  }, [plan.id]);

  const handleSavePlan = () => {
    savePlan(plan);
    setIsSaved(true);
  };

  return (
    <div className="flex items-start gap-3 my-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
        <Sparkles size={18} className="text-black" />
      </div>
      <div className="max-w-xs md:max-w-md p-4 rounded-2xl rounded-tl-none bg-gray-800 border border-gray-700 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
            <ClipboardList className="w-5 h-5 text-yellow-400" />
            <h3 className="font-bold text-lg text-white">Here's a custom plan for you:</h3>
        </div>
        <div className="border-t border-gray-600 pt-3">
            <h4 className="font-bold text-yellow-400">{plan.title}</h4>
            <p className="text-sm text-gray-400 mb-2">{plan.duration}</p>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
            {plan.description}
            </p>
            <button
            onClick={handleSavePlan}
            disabled={isSaved}
            className={`w-full text-sm font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                isSaved
                ? 'bg-green-600 text-white cursor-not-allowed'
                : 'bg-yellow-500 text-black hover:bg-yellow-400'
            }`}
            >
            {isSaved ? (
                <>
                <Check size={16} />
                Saved to Profile
                </>
            ) : (
                'Save Plan'
            )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default PlanMessage;
