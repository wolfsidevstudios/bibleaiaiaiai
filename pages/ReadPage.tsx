import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronDown, User } from 'lucide-react';
import { BIBLE_BOOKS, BOOK_NAMES } from '../constants';
import { fetchVerse } from '../services/bibleService';
import { BibleApiResponse, Verse } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { saveLastRead } from '../services/storageService';

const ReadPage: React.FC = () => {
  const { book, chapter } = useParams<{ book: string; chapter: string }>();

  const [currentBook, setCurrentBook] = useState(book ? decodeURIComponent(book) : 'Genesis');
  const [currentChapter, setCurrentChapter] = useState(chapter ? parseInt(chapter, 10) : 1);
  const [chapterContent, setChapterContent] = useState<BibleApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBookSelector, setShowBookSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchChapterContent = useCallback(async (book: string, chapter: number) => {
    setLoading(true);
    setError(null);
    setChapterContent(null);
    saveLastRead(book, chapter);
    const data = await fetchVerse(`${book} ${chapter}`);
    if (data) {
      setChapterContent(data);
    } else {
      setError('Failed to load chapter. Please try again.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchChapterContent(currentBook, currentChapter);
  }, [currentBook, currentChapter, fetchChapterContent]);

  const handleNextChapter = () => {
    if (currentChapter < BIBLE_BOOKS[currentBook]) {
      setCurrentChapter(prev => prev + 1);
    } else {
      const currentBookIndex = BOOK_NAMES.indexOf(currentBook);
      if (currentBookIndex < BOOK_NAMES.length - 1) {
        const nextBook = BOOK_NAMES[currentBookIndex + 1];
        setCurrentBook(nextBook);
        setCurrentChapter(1);
      }
    }
  };
  
  const handlePrevChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(prev => prev - 1);
    } else {
      const currentBookIndex = BOOK_NAMES.indexOf(currentBook);
      if (currentBookIndex > 0) {
        const prevBook = BOOK_NAMES[currentBookIndex - 1];
        setCurrentBook(prevBook);
        setCurrentChapter(BIBLE_BOOKS[prevBook]);
      }
    }
  };

  const selectBook = (book: string) => {
    setCurrentBook(book);
    setCurrentChapter(1);
    setShowBookSelector(false);
    setSearchQuery('');
  };
  
  const filteredBooks = BOOK_NAMES.filter(book =>
    book.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 bg-black border-b border-gray-800 p-3 flex justify-between items-center z-20">
        <div className="relative">
          <button onClick={() => setShowBookSelector(!showBookSelector)} className="flex items-center space-x-1 text-lg font-bold">
            <span>{currentBook} {currentChapter}</span>
            <ChevronDown size={20} className={`transition-transform ${showBookSelector ? 'rotate-180' : ''}`} />
          </button>
          {showBookSelector && (
            <div className="absolute top-full left-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg flex flex-col h-80 w-64">
                <div className="p-2 border-b border-gray-700">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a book..."
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto">
                    {filteredBooks.map(book => (
                        <button key={book} onClick={() => selectBook(book)} className="block w-full text-left px-4 py-2 hover:bg-gray-800">
                        {book}
                        </button>
                    ))}
                </div>
            </div>
          )}
        </div>
        <Link to="/profile">
            <User className="w-6 h-6 text-gray-400 hover:text-yellow-400" />
        </Link>
      </header>

      <div className="flex-grow p-4 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="font-serif text-lg leading-loose text-gray-300">
            {chapterContent?.verses.map((verse: Verse) => (
              <span key={verse.verse}>
                <sup className="text-yellow-400 font-sans font-bold text-xs mr-1">{verse.verse}</sup>
                {verse.text}{' '}
              </span>
            ))}
          </div>
        )}
      </div>

      <footer className="sticky bottom-16 bg-black border-t border-gray-800 p-2 flex justify-between items-center">
        <button onClick={handlePrevChapter} className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-800">
          <ArrowLeft size={16} />
          <span>Previous</span>
        </button>
        <button onClick={handleNextChapter} className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-800">
          <span>Next</span>
          <ArrowRight size={16} />
        </button>
      </footer>
    </div>
  );
};

export default ReadPage;