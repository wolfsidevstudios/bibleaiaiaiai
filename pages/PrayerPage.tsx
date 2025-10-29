import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Heart, Sun, Droplets, Shield } from 'lucide-react';
import { generateGuidedPrayer } from '../services/geminiService';
import { GuidedPrayer } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const PRAYER_TOPICS = [
    { name: 'Gratitude', icon: <Sun size={24} /> },
    { name: 'Guidance', icon: <Heart size={24} /> },
    { name: 'Forgiveness', icon: <Droplets size={24} /> },
    { name: 'Strength', icon: <Shield size={24} /> },
];

const PrayerPage: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<'topic' | 'loading' | 'praying'>('topic');
    const [customTopic, setCustomTopic] = useState('');
    const [prayer, setPrayer] = useState<GuidedPrayer | null>(null);
    const [currentSection, setCurrentSection] = useState(0);

    const handleTopicSelect = async (topic: string) => {
        if (!topic.trim()) return;
        setStep('loading');
        const generatedPrayer = await generateGuidedPrayer(topic);
        if (generatedPrayer) {
            setPrayer(generatedPrayer);
            setCurrentSection(0);
            setStep('praying');
        } else {
            alert("Sorry, I couldn't prepare a prayer right now. Please try again.");
            setStep('topic');
        }
    };

    const handleNextSection = () => {
        if (prayer && currentSection < prayer.sections.length - 1) {
            setCurrentSection(s => s + 1);
        } else {
            navigate('/assistant');
        }
    };
    
    const renderContent = () => {
        switch (step) {
            case 'topic':
                return (
                    <div className="text-center w-full max-w-md animate-fade-in">
                        <h2 className="text-4xl font-bold mb-4">What's on your heart?</h2>
                        <p className="text-gray-400 mb-10">Let's bring it to God together. Select a theme or type your own.</p>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {PRAYER_TOPICS.map(topic => (
                                <button key={topic.name} onClick={() => handleTopicSelect(topic.name)} className="bg-gray-800/50 backdrop-blur-sm border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-gray-700/70 transition-colors">
                                    {topic.icon}
                                    <span className="font-semibold">{topic.name}</span>
                                </button>
                            ))}
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleTopicSelect(customTopic); }} className="flex items-center space-x-2">
                             <input
                                type="text"
                                value={customTopic}
                                onChange={(e) => setCustomTopic(e.target.value)}
                                placeholder="Or type your own topic..."
                                className="w-full bg-gray-800/50 text-white p-4 rounded-full border-2 border-gray-700 focus:border-yellow-500 focus:outline-none"
                            />
                            <button type="submit" disabled={!customTopic.trim()} className="bg-yellow-500 text-black p-4 rounded-full hover:bg-yellow-400 disabled:bg-gray-600 flex-shrink-0">
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                );
            case 'loading':
                return (
                    <div className="text-center">
                        <LoadingSpinner className="h-12 w-12 mb-4" />
                        <p className="text-lg text-gray-400">Preparing a moment of prayer for you...</p>
                    </div>
                );
            case 'praying':
                if (!prayer) return null;
                const section = prayer.sections[currentSection];
                const isLastSection = currentSection === prayer.sections.length - 1;
                return (
                    <div className="text-center w-full max-w-xl animate-fade-in flex flex-col items-center flex-grow justify-center">
                        <h3 className="text-yellow-400 font-semibold mb-4">{section.title}</h3>
                        <p className="font-serif text-2xl md:text-3xl leading-relaxed text-gray-200 mb-8 whitespace-pre-wrap">{section.text}</p>
                        {section.reflection && <p className="text-gray-400 italic mb-12">"{section.reflection}"</p>}
                        
                        <button onClick={handleNextSection} className="w-full max-w-sm bg-white text-black font-bold py-4 px-6 rounded-full mt-auto">
                            {isLastSection ? 'Amen' : 'Continue'}
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="h-screen w-screen bg-black text-white flex flex-col p-6 font-sans overflow-hidden">
            <header className="w-full flex justify-start z-10">
                 <button onClick={() => step === 'praying' ? setStep('topic') : navigate(-1)} className="bg-white/10 backdrop-blur-md rounded-full p-3 hover:bg-white/20 transition-colors">
                    <ArrowLeft size={24} />
                </button>
            </header>
            <main className="flex-grow flex items-center justify-center -mt-16">
                 {renderContent()}
            </main>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-yellow-500/10 rounded-full filter blur-3xl animate-pulse"></div>
                <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-amber-500/10 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
            </div>
        </div>
    );
};

export default PrayerPage;