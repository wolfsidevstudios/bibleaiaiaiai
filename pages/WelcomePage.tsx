import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Target, Sparkles, Flame } from 'lucide-react';

const VerseCard: React.FC<{ icon: React.ReactNode; text: string; className?: string }> = ({ icon, text, className }) => (
    <div className={`absolute w-56 h-36 rounded-2xl p-4 flex flex-col justify-between text-black transition-transform duration-500 ease-in-out ${className}`} style={{ backdropFilter: 'blur(20px)' }}>
        <div>{icon}</div>
        <p className="font-semibold text-sm leading-tight">{text}</p>
    </div>
);


const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-between p-6 overflow-hidden">
      <header className="flex items-center space-x-2 w-full">
        <BookOpen className="w-7 h-7 text-yellow-400" />
        <h1 className="text-xl font-bold text-gray-100">Lexi Bible AI</h1>
      </header>
      
      <div className="relative w-full h-80 flex items-center justify-center my-8">
        <VerseCard 
            icon={<Target size={24}/>} 
            text="Your word is a lamp for my feet, a light on my path." 
            className="bg-orange-400/80 transform -rotate-12 translate-x-12"
        />
        <VerseCard 
            icon={<Sparkles size={24}/>} 
            text="For with God nothing shall be impossible." 
            className="bg-white/80 transform rotate-6 -translate-y-10"
        />
        <VerseCard 
            icon={<Flame size={24}/>} 
            text="The joy of the Lord is your strength." 
            className="bg-gray-900/50 border border-white/20 text-white transform -rotate-3 translate-y-16 -translate-x-16"
        />
      </div>

      <div className="w-full max-w-sm text-center">
        <h2 className="text-4xl font-bold mb-4">Study with purpose</h2>
        <p className="text-gray-400 mb-8">
          Explore the scriptures, get answers, and grow in your faith with your personal AI assistant.
        </p>
      </div>

      <div className="w-full max-w-sm flex flex-col space-y-4">
        <button 
          onClick={() => navigate('/auth')}
          className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold py-4 px-6 rounded-xl hover:opacity-90 transition-opacity"
        >
          Get Started
        </button>
        <button 
          onClick={() => navigate('/auth')}
          className="w-full bg-gray-800 text-white font-bold py-4 px-6 rounded-xl hover:bg-gray-700 transition-colors"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
