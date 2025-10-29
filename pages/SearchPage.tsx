import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, User, Film, HelpCircle } from 'lucide-react';
import { BibleApiResponse } from '../types';
import { fetchVerse } from '../services/bibleService';
import LoadingSpinner from '../components/LoadingSpinner';
import { plans } from '../data/plans';


const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="text-2xl font-bold text-gray-100 mb-4">{title}</h2>
);

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
        <div className="relative rounded-lg overflow-hidden h-56 mb-8 shadow-lg">
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

const ClipsCard: React.FC = () => {
    return (
        <div className="mb-8">
            <Link to="/clips" className="relative block rounded-lg overflow-hidden h-32 group shadow-lg">
                 <img src="https://images.pexels.com/photos/1631677/pexels-photo-1631677.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Abstract colorful background" className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                 <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center text-white">
                        <Film size={32} className="mx-auto mb-2"/>
                        <h3 className="text-xl font-bold">Clips</h3>
                        <p className="text-sm">Inspirational verse clips</p>
                    </div>
                 </div>
            </Link>
        </div>
    );
};

const DailyQuizCard: React.FC = () => {
    return (
        <div className="mb-8">
            <Link to="/quiz/genesis-beginnings" className="relative block rounded-lg overflow-hidden h-32 group shadow-lg">
                 <img src="https://images.pexels.com/photos/372327/pexels-photo-372327.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Ancient scroll and quill" className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                 <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center text-white">
                        <HelpCircle size={32} className="mx-auto mb-2"/>
                        <h3 className="text-xl font-bold">Daily Quiz</h3>
                        <p className="text-sm">Test your knowledge</p>
                    </div>
                 </div>
            </Link>
        </div>
    );
};


const PopularPlans: React.FC = () => {
    return (
        <div className="mb-8">
            <SectionHeader title="Popular Plans" />
            <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
                {plans.map(plan => (
                    <Link to={`/plan/${plan.id}`} key={plan.id} className="flex-shrink-0 w-40 block hover:opacity-90 transition-opacity">
                        <img src={plan.image} alt={plan.title} className="w-full h-52 object-cover rounded-lg mb-2 shadow-md" />
                        <h4 className="font-semibold text-white truncate">{plan.title}</h4>
                        <p className="text-sm text-gray-400">{plan.duration}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

const StudyByTopic: React.FC = () => {
    const topics = ['Faith', 'Love', 'Forgiveness', 'Hope'];
    return (
        <div className="mb-8">
            <SectionHeader title="Study by Topic" />
            <div className="grid grid-cols-2 gap-3">
                {topics.map(topic => (
                    <button key={topic} className="bg-gray-800 p-4 rounded-lg text-center font-semibold hover:bg-gray-700 transition-colors">
                        {topic}
                    </button>
                ))}
            </div>
        </div>
    );
};

const FeaturedPassages: React.FC = () => {
    const passages = [
        { title: 'The Sermon on the Mount', ref: 'Matthew 5-7' },
        { title: 'The Good Shepherd', ref: 'Psalm 23' },
        { title: 'The Love Chapter', ref: '1 Corinthians 13' },
    ];
    return (
        <div>
            <SectionHeader title="Featured Passages" />
            <div className="space-y-3">
                {passages.map(passage => (
                    <button key={passage.title} className="w-full flex justify-between items-center bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                        <div className="text-left">
                            <h4 className="font-semibold">{passage.title}</h4>
                            <p className="text-sm text-gray-400">{passage.ref}</p>
                        </div>
                        <ChevronRight size={20} className="text-gray-500" />
                    </button>
                ))}
            </div>
        </div>
    );
};


const ExplorePage: React.FC = () => {
  return (
    <div className="p-4 pb-16">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Explore</h1>
        <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white">
                <Search size={24} />
            </button>
            <Link to="/profile">
                <User className="w-6 h-6 text-gray-400 hover:text-yellow-400" />
            </Link>
        </div>
      </header>
      <VerseOfTheDay />
      <ClipsCard />
      <DailyQuizCard />
      <PopularPlans />
      <StudyByTopic />
      <FeaturedPassages />
    </div>
  );
};

export default ExplorePage;
