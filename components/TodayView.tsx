import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight } from 'lucide-react';
import VerseOfTheDay from './VerseOfTheDay';
import LoadingSpinner from './LoadingSpinner';
import { getLastRead, getDailyPrayer, saveDailyPrayer } from '../services/storageService';
import { generateDailyPrayer } from '../services/geminiService';
import { plans } from '../data/plans';

const DailyPrayer: React.FC = () => {
    const [prayer, setPrayer] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrayer = async () => {
            setLoading(true);
            const todayStr = new Date().toISOString().slice(0, 10);
            const storedPrayer = getDailyPrayer();

            if (storedPrayer && storedPrayer.date === todayStr) {
                setPrayer(storedPrayer.prayer);
            } else {
                const newPrayer = await generateDailyPrayer();
                saveDailyPrayer(newPrayer, todayStr);
                setPrayer(newPrayer);
            }
            setLoading(false);
        };
        fetchPrayer();
    }, []);

    return (
        <div className="bg-gray-900 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2 text-yellow-400">Daily Prayer</h3>
            {loading ? (
                <div className="flex justify-center items-center h-16">
                    <LoadingSpinner />
                </div>
            ) : (
                <p className="text-gray-300 italic">"{prayer}"</p>
            )}
        </div>
    );
};

const ContinueReading: React.FC = () => {
    const lastRead = getLastRead();

    if (!lastRead) return null;

    return (
        <Link 
            to={`/read/${encodeURIComponent(lastRead.book)}/${lastRead.chapter}`}
            className="bg-gray-900 p-4 rounded-lg flex justify-between items-center hover:bg-gray-800 transition-colors"
        >
            <div>
                <p className="text-sm text-gray-400">Continue Reading</p>
                <p className="font-bold text-lg">{lastRead.book} {lastRead.chapter}</p>
            </div>
            <ChevronRight size={24} className="text-gray-500" />
        </Link>
    );
};


const TodayView: React.FC = () => {
    const featuredPlans = plans.slice(0, 2);

    return (
        <div className="p-4 space-y-6">
            <VerseOfTheDay />
            <DailyPrayer />
            <ContinueReading />
            <div>
                 <h2 className="text-2xl font-bold text-gray-100 mb-4">Featured Plans</h2>
                 <div className="space-y-3">
                    {featuredPlans.map(plan => (
                        <Link to={`/plan/${plan.id}`} key={plan.id} className="w-full flex items-center space-x-4 bg-gray-900 p-3 rounded-lg hover:bg-gray-800 transition-colors">
                            <img src={plan.image} alt={plan.title} className="w-20 h-20 object-cover rounded-md" />
                            <div className="text-left">
                                <h4 className="font-bold text-lg">{plan.title}</h4>
                                <p className="text-sm text-gray-400">{plan.duration}</p>
                            </div>
                        </Link>
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default TodayView;
