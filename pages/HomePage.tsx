import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Share2, ArrowRight, User, BookOpen, Sparkles, Droplets, BookMarked, HelpCircle, Flame } from 'lucide-react';
import { BibleApiResponse, StreakData } from '../types';
import { fetchVerse } from '../services/bibleService';
import { generateAiResponse } from '../services/geminiService';
import { getBookmarks, addBookmark, removeBookmark, getLastRead, getDailyPrayer, saveDailyPrayer, updateStreak } from '../services/storageService';
import LoadingSpinner from '../components/LoadingSpinner';
import { AuthContext } from '../contexts/AuthContext';


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
  const [verseOfTheDay, setVerseOfTheDay] = useState<BibleApiResponse | null>(null);
  const [dailyPrayer, setDailyPrayer] = useState<string | null>(null);
  const [loadingVerse, setLoadingVerse] = useState(true);
  const [loadingPrayer, setLoadingPrayer] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const lastRead = getLastRead();

  const popularVerses = [
    "John 3:16", "Romans 8:28", "Philippians 4:13", "Proverbs 3:5-6",
    "Jeremiah 29:11", "Psalm 23:1", "1 Corinthians 10:13", "Galatians 5:22-23"
  ];

  const getVerse = useCallback(async () => {
    setLoadingVerse(true);
    const randomVerseRef = popularVerses[Math.floor(Math.random() * popularVerses.length)];
    const data = await fetchVerse(randomVerseRef);
    if (data) {
      setVerseOfTheDay(data);
      const bookmarks = getBookmarks();
      setIsBookmarked(bookmarks.includes(data.reference));
    }
    setLoadingVerse(false);
  }, []);

  const getPrayer = useCallback(async () => {
    setLoadingPrayer(true);
    const today = new Date().toISOString().slice(0, 10);
    const cachedPrayer = getDailyPrayer();

    if (cachedPrayer && cachedPrayer.date === today) {
        setDailyPrayer(cachedPrayer.prayer);
    } else {
        const response = await generateAiResponse("Generate a short, inspirational daily prayer for today (around 30-40 words).");
        if (typeof response === 'string' && !response.includes("I'm sorry")) {
            setDailyPrayer(response);
            saveDailyPrayer(response, today);
        } else {
            setDailyPrayer("May the Lord bless you and keep you; may His face shine upon you and be gracious to you. Amen.");
        }
    }
    setLoadingPrayer(false);
  }, []);

  useEffect(() => {
    getVerse();
    getPrayer();
  }, [getVerse, getPrayer]);

  const handleToggleBookmark = () => {
    if (!verseOfTheDay) return;
    const ref = verseOfTheDay.reference;
    if (isBookmarked) {
      removeBookmark(ref);
    } else {
      addBookmark(ref);
    }
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (verseOfTheDay) {
      const shareText = `"${verseOfTheDay.text.trim()}" - ${verseOfTheDay.reference}`;
      if (navigator.share) {
        navigator.share({
          title: 'Verse of the Day',
          text: shareText,
        }).catch(console.error);
      } else {
        navigator.clipboard.writeText(shareText);
        alert('Verse copied to clipboard!');
      }
    }
  };
  
  const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Good Morning";
      if (hour < 18) return "Good Afternoon";
      return "Good Evening";
  };

  return (
    <div className="p-4 pb-20">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-100">{getGreeting()},</h1>
                <p className="text-gray-400">{auth?.user?.name?.split(' ')[0] || 'Friend'}</p>
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

        <DailyStreak />

        {/* Verse of the Day */}
        <div className="mb-6 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg w-full">
            <h2 className="text-sm font-semibold text-yellow-400 mb-3">VERSE OF THE DAY</h2>
            {loadingVerse ? (
                <div className="flex justify-center items-center h-24"><LoadingSpinner /></div>
            ) : verseOfTheDay ? (
                <div>
                    <p className="text-lg leading-relaxed text-gray-200 font-serif mb-4">
                    “{verseOfTheDay.text.trim()}”
                    </p>
                    <p className="text-right text-yellow-400 font-semibold">
                    {verseOfTheDay.reference}
                    </p>
                    <div className="flex justify-end space-x-4 mt-4 pt-4 border-t border-gray-700/50">
                        <button onClick={handleToggleBookmark} className="text-gray-400 hover:text-yellow-400 transition-colors">
                            <Bookmark size={22} className={isBookmarked ? 'fill-current text-yellow-400' : ''} />
                        </button>
                        <button onClick={handleShare} className="text-gray-400 hover:text-yellow-400 transition-colors">
                            <Share2 size={22} />
                        </button>
                    </div>
                </div>
            ) : (
            <p>Could not load verse of the day.</p>
            )}
        </div>
        
        {/* Daily Prayer */}
        <div className="mb-6 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg w-full">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500/20">
                    <Droplets size={18} className="text-blue-400"/>
                </div>
                <h2 className="text-lg font-bold">Daily Prayer</h2>
            </div>
            {loadingPrayer ? (
                 <div className="flex justify-center items-center h-20"><LoadingSpinner /></div>
            ) : (
                <p className="text-gray-300 leading-relaxed font-serif italic">
                    {dailyPrayer}
                </p>
            )}
        </div>
        
        {/* Continue Reading */}
        <div className="mb-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-lg w-full flex items-center justify-between">
            <div>
                <h2 className="text-lg font-bold">Continue Reading</h2>
                <p className="text-yellow-400">{lastRead ? `${lastRead.book} ${lastRead.chapter}` : 'Genesis 1'}</p>
            </div>
            <button
                onClick={() => navigate(lastRead ? `/read/${encodeURIComponent(lastRead.book)}/${lastRead.chapter}`: '/read')}
                className="bg-yellow-500 text-black font-bold p-3 rounded-full flex items-center justify-center space-x-2 hover:bg-yellow-400 transition-colors"
            >
                <ArrowRight size={24} />
            </button>
        </div>
        
        {/* Explore Section */}
        <div>
            <h2 className="text-xl font-bold mb-4">Explore More</h2>
            <div className="grid grid-cols-2 gap-4">
                <Link to="/assistant" className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex flex-col justify-between items-start hover:bg-gray-700 transition-colors h-28">
                    <Sparkles className="text-purple-400"/>
                    <span className="font-semibold">Ask Lexi</span>
                </Link>
                 <Link to="/plan/finding-peace" className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex flex-col justify-between items-start hover:bg-gray-700 transition-colors h-28">
                    <BookMarked className="text-green-400"/>
                    <span className="font-semibold">Reading Plans</span>
                </Link>
                 <Link to="/quiz/genesis-beginnings" className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex flex-col justify-between items-start hover:bg-gray-700 transition-colors h-28">
                    <HelpCircle className="text-orange-400"/>
                    <span className="font-semibold">Daily Quiz</span>
                </Link>
                <Link to="/clips" className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex flex-col justify-between items-start hover:bg-gray-700 transition-colors h-28">
                    <BookOpen className="text-red-400"/>
                    <span className="font-semibold">Verse Clips</span>
                </Link>
            </div>
        </div>
    </div>
  );
};

export default HomePage;