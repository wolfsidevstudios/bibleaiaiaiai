import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, CheckCircle, Lock, PlayCircle } from 'lucide-react';
import { plans as staticPlans } from '../data/plans';
import { getSavedPlans, getPlanProgress, startOrContinuePlan, updatePlanProgress } from '../services/storageService';
import { Plan } from '../types';

const PlanPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const [progress, setProgress] = useState(0); // 0: not started, >0: current day, -1: completed
  const [openDay, setOpenDay] = useState<number | null>(null);

  let plan: Plan | undefined;
  const savedPlans = getSavedPlans();
  plan = savedPlans.find(p => p.id === planId);

  if (!plan) {
    plan = staticPlans.find(p => p.id === planId);
  }

  useEffect(() => {
    if (planId) {
      const allProgress = getPlanProgress();
      const currentProgress = allProgress[planId]?.currentDay;
      if (currentProgress) {
        setProgress(currentProgress);
        setOpenDay(currentProgress > 0 ? currentProgress : null);
      }
    }
  }, [planId]);

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white">
        <h2 className="text-2xl mb-4">Plan not found</h2>
        <Link to="/search" className="text-yellow-400 hover:underline">Go back to Explore</Link>
      </div>
    );
  }

  const handleStartPlan = () => {
    if (planId) {
      startOrContinuePlan(planId);
      setProgress(1);
      setOpenDay(1);
    }
  };
  
  const handleCompleteDay = (day: number) => {
    if (planId && plan) {
      const nextDay = day + 1;
      if (nextDay <= plan.content.length) {
        updatePlanProgress(planId, nextDay);
        setProgress(nextDay);
        setOpenDay(nextDay);
      } else {
        updatePlanProgress(planId, -1); // -1 signifies completion
        setProgress(-1);
        setOpenDay(null);
      }
    }
  };
  
  const toggleDay = (day: number) => {
    if (day <= progress || progress === -1) {
        setOpenDay(openDay === day ? null : day);
    }
  };
  
  const getButton = () => {
    if (progress === -1) {
      return (
        <button disabled className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2">
            <CheckCircle size={20}/> Plan Completed!
        </button>
      );
    }
    if (progress > 0) {
      return (
        <button onClick={() => {document.getElementById(`day-${progress}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}} className="w-full bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors">
            Continue Plan: Day {progress}
        </button>
      );
    }
    return (
      <button onClick={handleStartPlan} className="w-full bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors">
          Start Plan
      </button>
    );
  };


  const headerHeight = plan.image ? 'h-64' : 'h-40';

  return (
    <div className="bg-black text-white min-h-screen">
      <div className={`relative ${headerHeight}`}>
        {plan.image && (
            <img src={plan.image} alt={plan.title} className="absolute inset-0 w-full h-full object-cover opacity-40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute top-0 left-0 p-4 z-10">
           <Link to="/profile" className="text-white bg-black bg-opacity-50 rounded-full p-2">
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
        <div className="mb-8">{getButton()}</div>

        <div className="space-y-3">
            {plan.content.map(day => {
                const isCompleted = progress === -1 || (progress > 0 && day.day < progress);
                const isCurrent = progress > 0 && day.day === progress;
                const isLocked = progress !== -1 && progress > 0 && day.day > progress;

                return (
                    <div key={day.day} id={`day-${day.day}`} className={`bg-gray-900 rounded-lg overflow-hidden transition-all duration-300 ${isCurrent ? 'border-2 border-yellow-400 shadow-lg shadow-yellow-500/10' : 'border border-transparent'}`}>
                        <div
                            onClick={() => !isLocked && toggleDay(day.day)}
                            className={`p-4 font-semibold flex justify-between items-center ${isLocked ? 'cursor-not-allowed text-gray-600' : 'cursor-pointer'}`}
                        >
                            <div className="flex items-center gap-3">
                                {isCompleted && <CheckCircle size={20} className="text-green-500"/>}
                                {isCurrent && <PlayCircle size={20} className="text-yellow-400 animate-pulse"/>}
                                {isLocked && <Lock size={20} className="text-gray-500"/>}
                                <span>Day {day.day}: {day.title}</span>
                            </div>
                            {!isLocked && <ChevronDown className={`w-5 h-5 transition-transform transform ${openDay === day.day ? 'rotate-180' : ''}`} />}
                        </div>
                        {openDay === day.day && (
                            <div className="p-4 border-t border-gray-800">
                                <p className="text-yellow-400 font-bold mb-2">{day.scripture}</p>
                                <p className="text-gray-300 font-serif leading-relaxed mb-4">{day.body}</p>
                                <p className="text-gray-400 italic text-sm mb-6">{day.prayer}</p>
                                {isCurrent && (
                                    <button onClick={() => handleCompleteDay(day.day)} className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-400 transition-colors">
                                        Mark as Complete & Continue
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )
            })}
             {plan.id !== 'courage-in-crisis' && plan.id !== 'finding-peace' && plan.id !== 'understanding-grace' && <p className="text-center text-gray-500 py-4">...and more</p>}
        </div>
      </div>
    </div>
  );
};

export default PlanPage;
