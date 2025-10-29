import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, LogOut, ArrowLeft, Clapperboard, ClipboardList, Trophy } from 'lucide-react';
import { getBookmarks, getClipBookmarks, getSavedPlans } from '../services/storageService';
import { fetchVerse } from '../services/bibleService';
import { BibleApiResponse, Clip, Plan, Goal } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { plans as staticPlans } from '../data/plans';
import { AuthContext } from '../contexts/AuthContext';
import { OnboardingContext } from '../contexts/OnboardingContext';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'verses' | 'clips' | 'plans' | 'goals'>('verses');
  const [bookmarkedVerses, setBookmarkedVerses] = useState<BibleApiResponse[]>([]);
  const [bookmarkedClips, setBookmarkedClips] = useState<Clip[]>([]);
  const [savedPlans, setSavedPlans] = useState<Plan[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  
  const auth = useContext(AuthContext);
  const onboarding = useContext(OnboardingContext);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (activeTab === 'verses') {
        const bookmarkRefs = getBookmarks();
        const versePromises = bookmarkRefs.map(ref => fetchVerse(ref));
        const verses = await Promise.all(versePromises);
        setBookmarkedVerses(verses.filter((v): v is BibleApiResponse => v !== null));
      } else if (activeTab === 'clips') {
        setBookmarkedClips(getClipBookmarks());
      } else if (activeTab === 'plans') {
        const plans = getSavedPlans();
        const allPlans = [...staticPlans.filter(sp => plans.some(p => p.id === sp.id)), ...plans.filter(p => !staticPlans.some(sp => sp.id === p.id))];
        setSavedPlans(getSavedPlans());
      } else if (activeTab === 'goals') {
        setGoals(onboarding?.onboardingData?.goals || []);
      }
      setLoading(false);
    };
    loadData();
  }, [activeTab, onboarding?.onboardingData?.goals]);
  
  const handleLogout = () => {
    auth?.logout();
    navigate('/welcome');
  };

  const verseCount = getBookmarks().length;
  const clipCount = getClipBookmarks().length;
  const planCount = getSavedPlans().length;
  const goalCount = onboarding?.onboardingData?.goals?.length || 0;

  return (
    <div className="bg-black min-h-screen text-white pb-16">
      <header className="p-4 flex justify-between items-center border-b border-gray-800">
        <Link to="/" className="text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">Profile</h1>
        <button onClick={handleLogout} className="text-gray-400 hover:text-white">
          <LogOut size={24} />
        </button>
      </header>

      <div className="p-4">
        {/* Profile Header */}
        <div className="flex items-center space-x-4 mb-6">
          <img src={auth?.user?.picture} alt={auth?.user?.name} className="w-20 h-20 rounded-full" />

          <div className="flex items-center justify-around flex-grow">
            <div className="text-center">
              <p className="text-2xl font-bold">{goalCount}</p>
              <p className="text-sm text-gray-400">Goals</p>
            </div>
             <div className="text-center">
              <p className="text-2xl font-bold">{clipCount}</p>
              <p className="text-sm text-gray-400">Clips</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{planCount}</p>
              <p className="text-sm text-gray-400">Plans</p>
            </div>
          </div>
        </div>
        <p className="font-bold">{onboarding?.onboardingData?.userName || auth?.user?.name}</p>
        <p className="text-sm text-gray-400">Exploring scripture with the help of Lexi.</p>
      </div>
      
      {/* Tabs */}
      <div className="border-t border-b border-gray-800 flex justify-around">
        <button 
            onClick={() => setActiveTab('goals')}
            className={`flex-1 flex items-center justify-center space-x-2 p-4 font-semibold transition-colors ${activeTab === 'goals' ? 'text-yellow-400 border-t-2 border-yellow-400' : 'text-gray-400'}`}>
          <Trophy size={18} />
          <span>GOALS</span>
        </button>
        <button 
            onClick={() => setActiveTab('clips')}
            className={`flex-1 flex items-center justify-center space-x-2 p-4 font-semibold transition-colors ${activeTab === 'clips' ? 'text-yellow-400 border-t-2 border-yellow-400' : 'text-gray-400'}`}>
          <Clapperboard size={18} />
          <span>CLIPS</span>
        </button>
        <button 
            onClick={() => setActiveTab('plans')}
            className={`flex-1 flex items-center justify-center space-x-2 p-4 font-semibold transition-colors ${activeTab === 'plans' ? 'text-yellow-400 border-t-2 border-yellow-400' : 'text-gray-400'}`}>
          <ClipboardList size={18} />
          <span>PLANS</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-1">
        {loading ? (
            <div className="flex justify-center mt-8">
                <LoadingSpinner />
            </div>
        ) : (
            <>
                {activeTab === 'goals' && (
                    goals.length > 0 ? (
                        <div className="space-y-3 p-4">
                            {goals.map(goal => (
                                <div key={goal.id} className="w-full flex items-center gap-4 bg-gray-800 p-4 rounded-lg">
                                    <div className="w-8 h-8 flex-shrink-0 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                        <Trophy size={18} className="text-yellow-400" />
                                    </div>
                                    <p className="font-semibold">{goal.text}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <Trophy size={48} className="mx-auto text-gray-600 mb-4" />
                            <h3 className="text-xl font-bold">No Goals Set</h3>
                            <p className="text-gray-400">You can set your goals during onboarding.</p>
                        </div>
                    )
                )}
                {activeTab === 'clips' && (
                    bookmarkedClips.length > 0 ? (
                      <div className="grid grid-cols-3 gap-1">
                        {bookmarkedClips.map(clip => (
                          <div key={clip.id} className="relative aspect-square bg-gray-800 overflow-hidden group">
                            <img src={clip.photo.src.medium} alt={clip.photo.alt} className="w-full h-full object-cover"/>
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center p-2">
                                <p className="text-white text-xs font-serif text-center font-bold" style={{textShadow: '1px 1px 2px black'}}>
                                    {clip.verse.text}
                                </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                        <div className="text-center py-16">
                            <Clapperboard size={48} className="mx-auto text-gray-600 mb-4" />
                            <h3 className="text-xl font-bold">No Saved Clips</h3>
                            <p className="text-gray-400">Bookmark a clip from the feed to see it here.</p>
                        </div>
                    )
                )}
                 {activeTab === 'plans' && (
                    savedPlans.length > 0 ? (
                        <div className="space-y-3 p-3">
                            {savedPlans.map(plan => (
                                <Link to={`/plan/${plan.id}`} key={plan.id} className="w-full flex items-center space-x-4 bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                                    {plan.image ? (
                                        <img src={plan.image} alt={plan.title} className="w-20 h-20 object-cover rounded-md" />
                                    ) : (
                                        <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center rounded-md">
                                            <ClipboardList size={32} className="text-black"/>
                                        </div>
                                    )}
                                    <div className="text-left">
                                        <h4 className="font-bold text-lg">{plan.title}</h4>
                                        <p className="text-sm text-gray-400">{plan.duration}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-16">
                            <ClipboardList size={48} className="mx-auto text-gray-600 mb-4" />
                            <h3 className="text-xl font-bold">No Saved Plans</h3>
                            <p className="text-gray-400">Ask Lexi to create a plan and save it to see it here.</p>
                        </div>
                    )
                 )}
            </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
