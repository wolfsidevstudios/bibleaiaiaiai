import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { User, Flame } from 'lucide-react';
import { PexelsPhoto, StreakData, Clip } from '../types';
import { fetchPhotos } from '../services/pexelsService';
import { getBookmarks, addBookmark, removeBookmark, getLastRead, getDailyPrayer, saveDailyPrayer, updateStreak } from '../services/storageService';
import LoadingSpinner from '../components/LoadingSpinner';
import { AuthContext } from '../contexts/AuthContext';
import { OnboardingContext } from '../contexts/OnboardingContext';
import ClipCard from '../components/ClipCard';
import DailyBrief from '../components/DailyBrief';
import { getVersesForTopics } from '../data/topicVerses';

const DailyStreak: React.FC = () => {
    const [streakData, setStreakData] = useState<StreakData | null>(null);

    useEffect(() => {
        setStreakData(updateStreak());
    }, []);

    if (!streakData || streakData.count < 1) return null;

    return (
        <div className="mb-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center">
                <Flame size={28} className="text-white" />
            </div>
            <div>
                <p className="text-xl font-bold">{streakData.count} Day Streak</p>
                <p className="text-sm text-gray-400">You're on a roll! Keep it up.</p>
            </div>
        </div>
    );
};

const HomePage: React.FC = () => {
  const auth = useContext(AuthContext);
  const onboarding = useContext(OnboardingContext);
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBrief, setShowBrief] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const lastBriefDate = localStorage.getItem('lastBriefDate');
    const now = new Date();
    const isMorning = now.getHours() >= 5 && now.getHours() < 12;

    if (isMorning && lastBriefDate !== today) {
      setShowBrief(true);
    }
  }, []);

  const personalizedVerses = useMemo(() => {
    if (onboarding?.onboardingData?.topics) {
      return getVersesForTopics(onboarding.onboardingData.topics);
    }
    return [];
  }, [onboarding?.onboardingData?.topics]);

  const generateClips = useCallback(async () => {
    setLoading(true);
    const photosResponse = await fetchPhotos(1, personalizedVerses.length || 5);
    if (photosResponse && photosResponse.photos.length > 0) {
      const newClips = personalizedVerses.map((verse, index) => {
        const photo = photosResponse.photos[index % photosResponse.photos.length];
        return {
          id: `${photo.id}-${index}`,
          photo: photo as PexelsPhoto,
          verse: verse,
        };
      });
      setClips(newClips);
    }
    setLoading(false);
  }, [personalizedVerses]);

  useEffect(() => {
    if (personalizedVerses.length > 0) {
      generateClips();
    }
  }, [generateClips, personalizedVerses]);

  const handleBriefClose = () => {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem('lastBriefDate', today);
    setShowBrief(false);
  };

  if (showBrief) {
    return <DailyBrief userName={onboarding?.onboardingData?.userName || 'User'} onClose={handleBriefClose} />;
  }
  
  const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Good Morning";
      if (hour < 18) return "Good Afternoon";
      return "Good Evening";
  };

  return (
    <div className="h-screen w-full bg-black">
        <header className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
            <div>
                <h1 className="text-2xl font-bold text-gray-100">{getGreeting()},</h1>
                <p className="text-gray-400">{onboarding?.onboardingData?.userName || 'Friend'}</p>
            </div>
            <Link to="/profile" className="w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-400">
                {auth?.user?.picture ? (
                    <img src={auth.user.picture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-400" />
                    </div>
                )}
            </Link>
        </header>

        {loading ? (
             <div className="h-full w-full flex items-center justify-center">
                <LoadingSpinner />
            </div>
        ) : (
             <div className="h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth">
                {clips.map(clip => <ClipCard key={clip.id} clip={clip} />)}
            </div>
        )}
    </div>
  );
};

export default HomePage;
