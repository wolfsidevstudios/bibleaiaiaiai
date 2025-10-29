import React, { useState } from 'react';
import { X, Dices, Check } from 'lucide-react';

const CHALLENGES = [
  "Share your favorite Bible verse with a friend.",
  "Read one chapter from the book of Psalms.",
  "Spend 5 minutes in prayer for someone in need.",
  "Memorize John 3:16 today.",
  "Write down 5 things you are grateful for.",
  "Listen to a worship song and reflect on the lyrics.",
  "Do a small act of kindness for a stranger.",
  "Find a verse about hope and meditate on it."
];

interface DailyChallengeModalProps {
  onClose: () => void;
}

const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({ onClose }) => {
  const [challenge, setChallenge] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => {
    const randomIndex = Math.floor(Math.random() * CHALLENGES.length);
    setChallenge(CHALLENGES[randomIndex]);
    setIsRevealed(true);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm border border-gray-700 relative text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        
        <Dices size={48} className="mx-auto text-yellow-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Daily Challenge</h2>

        {!isRevealed ? (
          <>
            <p className="text-gray-400 text-sm mb-6">Tap below to reveal your challenge for today and put your faith into action.</p>
            <button
              onClick={handleReveal}
              className="w-full bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Reveal Challenge
            </button>
          </>
        ) : (
          <>
            <div className="text-gray-300 font-serif text-lg leading-relaxed my-6 h-24 flex items-center justify-center">
              <p>"{challenge}"</p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-green-500 transition-colors"
            >
              <Check size={20} />
              Done!
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DailyChallengeModal;
