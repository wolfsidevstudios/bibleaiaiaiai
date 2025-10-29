import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Settings, ArrowLeft, Clapperboard } from 'lucide-react';
import { getBookmarks, getClipBookmarks } from '../services/storageService';
import { fetchVerse } from '../services/bibleService';
import { BibleApiResponse, Clip } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'verses' | 'clips'>('verses');
  const [bookmarkedVerses, setBookmarkedVerses] = useState<BibleApiResponse[]>([]);
  const [bookmarkedClips, setBookmarkedClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (activeTab === 'verses') {
        const bookmarkRefs = getBookmarks();
        const versePromises = bookmarkRefs.map(ref => fetchVerse(ref));
        const verses = await Promise.all(versePromises);
        setBookmarkedVerses(verses.filter((v): v is BibleApiResponse => v !== null));
      } else {
        const clips = getClipBookmarks();
        setBookmarkedClips(clips);
      }
      setLoading(false);
    };
    loadData();
  }, [activeTab]);

  const verseCount = getBookmarks().length;
  const clipCount = getClipBookmarks().length;

  return (
    <div className="bg-black min-h-screen text-white">
      <header className="p-4 flex justify-between items-center border-b border-gray-800">
        <Link to="/" className="text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">Profile</h1>
        <button className="text-gray-400 hover:text-white">
          <Settings size={24} />
        </button>
      </header>

      <div className="p-4">
        {/* Profile Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center">
            <span className="text-4xl font-bold text-black">B</span>
          </div>
          <div className="flex items-center justify-around flex-grow">
            <div className="text-center">
              <p className="text-2xl font-bold">{verseCount}</p>
              <p className="text-sm text-gray-400">Verses</p>
            </div>
             <div className="text-center">
              <p className="text-2xl font-bold">{clipCount}</p>
              <p className="text-sm text-gray-400">Clips</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-gray-400">Plans</p>
            </div>
          </div>
        </div>
        <p className="font-bold">Bible Scholar</p>
        <p className="text-sm text-gray-400">Exploring the depths of scripture, one verse at a time.</p>
      </div>
      
      {/* Tabs */}
      <div className="border-t border-b border-gray-800 flex justify-around">
        <button 
            onClick={() => setActiveTab('verses')}
            className={`flex-1 flex items-center justify-center space-x-2 p-4 font-semibold transition-colors ${activeTab === 'verses' ? 'text-yellow-400 border-t-2 border-yellow-400' : 'text-gray-400'}`}>
          <Bookmark size={18} />
          <span>SAVED</span>
        </button>
        <button 
            onClick={() => setActiveTab('clips')}
            className={`flex-1 flex items-center justify-center space-x-2 p-4 font-semibold transition-colors ${activeTab === 'clips' ? 'text-yellow-400 border-t-2 border-yellow-400' : 'text-gray-400'}`}>
          <Clapperboard size={18} />
          <span>CLIPS</span>
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
                {activeTab === 'verses' && (
                    bookmarkedVerses.length > 0 ? (
                      <div className="grid grid-cols-3 gap-1">
                        {bookmarkedVerses.map(verse => (
                          <div key={verse.reference} className="relative aspect-square bg-gray-800 p-2 flex flex-col justify-center items-center text-center overflow-hidden">
                            <p className="text-xs font-serif leading-tight">"{verse.text.trim()}"</p>
                            <p className="absolute bottom-1 right-1 text-xs font-bold text-yellow-500 bg-black bg-opacity-50 px-1 rounded">{verse.reference.split(' ')[0].substring(0,3)} {verse.reference.split(' ')[1]}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                        <div className="text-center py-16">
                            <Bookmark size={48} className="mx-auto text-gray-600 mb-4" />
                            <h3 className="text-xl font-bold">No Saved Verses</h3>
                            <p className="text-gray-400">Tap the bookmark icon on a verse to save it here.</p>
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
            </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;