import React, { useState, useEffect } from 'react';

interface DailyBriefProps {
  userName: string;
  onClose: () => void;
}

const DailyBrief: React.FC<DailyBriefProps> = ({ userName, onClose }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const timeString = formatTime(time);
  const timeParts = timeString.split(' ');
  
  return (
    <div className="fixed inset-0 bg-black text-white z-50 flex flex-col p-8">
      <div className="flex-grow flex flex-col justify-center text-center">
        <p className="text-xl text-gray-300">Hello {userName}</p>
        <h1 className="font-bold my-2" style={{ fontSize: 'clamp(4rem, 25vw, 8rem)', lineHeight: 1 }}>
          {timeParts[0]}
          <span className="text-4xl align-top ml-2">{timeParts[1]}</span>
        </h1>
        <div className="flex items-center justify-center gap-2 text-lg text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            <span>Good Morning</span>
        </div>
        <p className="text-gray-300">{formatDate(time)}</p>

        <div className="mt-16 max-w-xl mx-auto">
            <p className="font-serif text-2xl leading-relaxed text-gray-200">
                “Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.”
            </p>
            <p className="mt-4 text-yellow-400 font-semibold">Proverbs 3:5-6</p>
        </div>
      </div>

      <footer className="w-full">
        <button
          onClick={onClose}
          className="w-full max-w-sm mx-auto bg-white text-black font-bold py-4 px-6 rounded-xl"
        >
          Take me to app
        </button>
      </footer>
    </div>
  );
};

export default DailyBrief;
