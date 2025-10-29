import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronRight, User, Film, HelpCircle, X } from 'lucide-react';
import { plans } from '../data/plans';
import VerseOfTheDay from '../components/VerseOfTheDay';


const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="text-2xl font-bold text-gray-100 mb-4">{title}</h2>
);

const ClipsCarousel: React.FC = () => {
    const clips = [
        { id: 1, title: "He Restores My Soul", image: "https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { id: 2, title: "Walk By Faith", image: "https://images.pexels.com/photos/355863/pexels-photo-355863.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { id: 3, title: "Love Never Fails", image: "https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg?auto=compress&cs=tinysrgb&w=800" }
    ];

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold text-gray-100">Clips</h2>
                 <Link to="/clips" className="text-yellow-400 font-semibold text-sm flex items-center">
                     See All <ChevronRight size={16} />
                 </Link>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4">
                {clips.map(clip => (
                    <Link to="/clips" key={clip.id} className="flex-shrink-0 w-32 h-56 block rounded-xl overflow-hidden relative group shadow-lg transition-transform duration-200 hover:scale-105">
                        <img src={clip.image} alt={clip.title} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-2 text-white">
                            <h4 className="font-bold text-sm leading-tight" style={{textShadow: '1px 1px 2px #000'}}>{clip.title}</h4>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

const YoutubeShortsCarousel: React.FC = () => {
    const shortsData = [
        "https://www.youtube.com/shorts/sD1a_B7fG_K",
        "https://www.youtube.com/shorts/qP8m_L9xY2Z",
        "https://www.youtube.com/shorts/jN6k_H3eW5R"
    ];

    const [playingShortId, setPlayingShortId] = useState<string | null>(null);

    const getShortId = (url: string): string | undefined => {
        try {
            const urlObj = new URL(url);
            return urlObj.pathname.split('/').pop();
        } catch (e) {
            return url.split('/').pop();
        }
    };

    const handlePlay = (id: string) => {
        setPlayingShortId(id);
    };

    const ShortsPlayerModal: React.FC<{ videoId: string; onClose: () => void }> = ({ videoId, onClose }) => (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="relative w-full max-w-[320px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-lg shadow-yellow-500/20" onClick={(e) => e.stopPropagation()}>
                <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&controls=0&modestbranding=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>
                <button onClick={onClose} className="absolute top-2 right-2 bg-black/50 rounded-full p-1.5 text-white z-10 hover:bg-black/80 transition-colors">
                    <X size={20} />
                </button>
            </div>
        </div>
    );

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold text-gray-100">Shorts</h2>
                 <a href="https://www.youtube.com/@bibleproject/shorts" target="_blank" rel="noopener noreferrer" className="text-yellow-400 font-semibold text-sm flex items-center">
                     See More <ChevronRight size={16} />
                 </a>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4">
                {shortsData.map(url => {
                    const shortId = getShortId(url);
                    if (!shortId) return null;
                    const thumbnailUrl = `https://i.ytimg.com/vi/${shortId}/hqdefault.jpg`;
                    
                    return (
                        <div
                            key={shortId}
                            onClick={() => handlePlay(shortId)}
                            onDoubleClick={() => handlePlay(shortId)}
                            className="flex-shrink-0 w-32 aspect-[9/16] block rounded-xl overflow-hidden relative group shadow-lg transition-transform duration-200 hover:scale-105 cursor-pointer"
                        >
                            <img src={thumbnailUrl} alt="YouTube Short thumbnail" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {playingShortId && <ShortsPlayerModal videoId={playingShortId} onClose={() => setPlayingShortId(null)} />}
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
    const navigate = useNavigate();

    const handlePassageClick = (ref: string) => {
        // Regex to capture book name (including multi-word ones) and the first chapter number
        const match = ref.match(/(.+)\s+(\d+)/);
        if (match) {
            const book = match[1].trim();
            const chapter = match[2];
            navigate(`/read/${encodeURIComponent(book)}/${chapter}`);
        }
    };

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
                    <button 
                        key={passage.title} 
                        onClick={() => handlePassageClick(passage.ref)}
                        className="w-full flex justify-between items-center bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors text-left"
                    >
                        <div>
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
      <div className="mb-8">
          <VerseOfTheDay />
      </div>
      <ClipsCarousel />
      <YoutubeShortsCarousel />
      <DailyQuizCard />
      <PopularPlans />
      <StudyByTopic />
      <FeaturedPassages />
    </div>
  );
};

export default ExplorePage;