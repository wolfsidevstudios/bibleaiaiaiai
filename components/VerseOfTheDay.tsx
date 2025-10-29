import React, { useState, useEffect, useCallback } from 'react';
import { BibleApiResponse } from '../types';
import { fetchVerse } from '../services/bibleService';
import LoadingSpinner from './LoadingSpinner';

const VerseOfTheDay: React.FC = () => {
    const [verse, setVerse] = useState<BibleApiResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const getVerse = useCallback(async () => {
        setLoading(true);
        const data = await fetchVerse("Philippians 4:6");
        setVerse(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        getVerse();
    }, [getVerse]);

    return (
        <div className="relative rounded-lg overflow-hidden h-56 shadow-lg">
            <img src="https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1280&auto=format&fit=crop" alt="Forest background" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-center p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Verse of the Day</h3>
                {loading ? <LoadingSpinner className="border-white" /> : verse ? (
                    <>
                        <p className="text-white font-serif text-lg">“{verse.text.trim()}”</p>
                        <p className="text-yellow-400 mt-2 text-sm">{verse.reference}</p>
                    </>
                ) : <p className="text-gray-400">Could not load verse.</p>}
            </div>
        </div>
    );
};

export default VerseOfTheDay;
