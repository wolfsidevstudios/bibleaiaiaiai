import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { User, Heart } from 'lucide-react';
import { PexelsPhoto, Clip } from '../types';
import { fetchPhotos } from '../services/pexelsService';
import LoadingSpinner from '../components/LoadingSpinner';
import { AuthContext } from '../contexts/AuthContext';
import { OnboardingContext } from '../contexts/OnboardingContext';
import ClipCard from '../components/ClipCard';
import DailyBrief from '../components/DailyBrief';
import { getVersesForTopics } from '../data/topicVerses';
import DonateModal from '../components/DonateModal';
import TodayView from '../components/TodayView';

const HomePage: React.FC = () => {
  const auth = useContext(AuthContext);
  const onboarding = useContext(OnboardingContext);
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBrief, setShowBrief] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'clips' | 'today'>('clips');

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
    <div className="bg-black flex flex-col h-full">
        {showDonateModal && <DonateModal onClose={() => setShowDonateModal(false)} />}
        
        <header className="p-4 flex justify-between items-center flex-shrink-0">
            <div>
                <h1 className="text-2xl font-bold text-gray-100">{getGreeting()},</h1>
                <p className="text-gray-400">{onboarding?.onboardingData?.userName || 'Friend'}</p>
            </div>
            <div className="flex items-center space-x-4">
                <button onClick={() => setShowDonateModal(true)} className="text-white hover:text-red-400 transition-colors">
                    <Heart size={24} />
                </button>
                <Link to="/profile" className="w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-400">
                    {auth?.user?.picture ? (
                        <img src={auth.user.picture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-400" />
                        </div>
                    )}
                </Link>
            </div>
        </header>

        <div className="px-4 pb-2 flex-shrink-0">
            <div className="bg-gray-800 p-1 rounded-full flex items-center text-sm font-semibold max-w-xs mx-auto">
                <button onClick={() => setActiveTab('today')} className={`w-1/2 py-1.5 rounded-full transition-colors ${activeTab === 'today' ? 'bg-white text-black' : 'text-gray-300'}`}>Today</button>
                <button onClick={() => setActiveTab('clips')} className={`w-1/2 py-1.5 rounded-full transition-colors ${activeTab === 'clips' ? 'bg-white text-black' : 'text-gray-300'}`}>Clips</button>
            </div>
        </div>

        <main className="flex-grow overflow-hidden">
             {activeTab === 'clips' ? (
                 loading ? (
                     <div className="h-full w-full flex items-center justify-center">
                        <LoadingSpinner />
                    </div>
                 ) : (
                     <div className="h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth">
                        {clips.map(clip => <ClipCard key={clip.id} clip={clip} />)}
                    </div>
                 )
             ) : (
                 <div className="h-full overflow-y-auto">
                    <TodayView />
                </div>
             )}
        </main>
    </div>
  );
};

export default HomePage;