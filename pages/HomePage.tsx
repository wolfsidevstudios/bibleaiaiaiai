import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Share2, ArrowRight, BookOpen, User } from 'lucide-react';
import { BibleApiResponse } from '../types';
import { fetchVerse } from '../services/bibleService';
import { getBookmarks, addBookmark, removeBookmark } from '../services/storageService';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage: React.FC = () => {
  const [verseOfTheDay, setVerseOfTheDay] = useState<BibleApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();
  
  const popularVerses = [
      "John 3:16", "Romans 8:28", "Philippians 4:13", "Proverbs 3:5-6",
      "Jeremiah 29:11", "1 Corinthians 10:13", "Galatians 5:22-23"
  ];

  const getVerse = useCallback(async () => {
    setLoading(true);
    const randomVerseRef = popularVerses[Math.floor(Math.random() * popularVerses.length)];
    const data = await fetchVerse(randomVerseRef);
    if (data) {
        setVerseOfTheDay(data);
        const bookmarks = getBookmarks();
        setIsBookmarked(bookmarks.includes(data.reference));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    getVerse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleToggleBookmark = () => {
      if (!verseOfTheDay) return;
      const ref = verseOfTheDay.reference;
      if(isBookmarked) {
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

  return (
    <div className="p-6 h-full flex flex-col justify-between">
      <header className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-yellow-400" />
            <h1 className="text-xl font-bold text-gray-100">MyBible</h1>
        </div>
         <Link to="/profile">
            <User className="w-6 h-6 text-gray-400 hover:text-yellow-400" />
        </Link>
      </header>
      
      <div className="flex-grow flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-6">Verse of the Day</h2>
        {loading ? (
          <LoadingSpinner />
        ) : verseOfTheDay ? (
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
            <p className="text-lg leading-relaxed text-gray-200 font-serif">
              {verseOfTheDay.text.trim()}
            </p>
            <p className="text-right text-yellow-400 mt-4 font-semibold">
              {verseOfTheDay.reference}
            </p>
            <div className="flex justify-end space-x-4 mt-4 pt-4 border-t border-gray-700">
              <button onClick={handleToggleBookmark} className="text-gray-400 hover:text-yellow-400">
                <Bookmark size={20} className={isBookmarked ? 'fill-current text-yellow-400' : ''} />
              </button>
              <button onClick={handleShare} className="text-gray-400 hover:text-yellow-400">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        ) : (
          <p>Could not load verse of the day.</p>
        )}
      </div>

      <button
        onClick={() => navigate('/read')}
        className="w-full max-w-md mx-auto bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 hover:bg-yellow-400 transition-colors"
      >
        <span>Continue Reading: Genesis 1</span>
        <ArrowRight size={20} />
      </button>
    </div>
  );
};

export default HomePage;