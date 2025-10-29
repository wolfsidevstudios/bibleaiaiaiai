import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, User, Languages, MapPin, Target, Check } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { OnboardingContext } from '../contexts/OnboardingContext';
import { OnboardingData, Goal } from '../types';
import { BIBLE_TOPICS } from '../data/topics';

const ProgressDots: React.FC<{ total: number, current: number }> = ({ total, current }) => (
    <div className="flex justify-center gap-2">
        {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i < current ? 'bg-white w-6' : 'bg-gray-600 w-2'}`} />
        ))}
    </div>
);

const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
];

const GOALS: Omit<Goal, 'id'>[] = [
    { text: 'Read the Bible daily', isCustom: false },
    { text: 'Understand key themes', isCustom: false },
    { text: 'Develop a prayer habit', isCustom: false },
    { text: 'Share verses with friends', isCustom: false },
];

const OnboardingPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const auth = useContext(AuthContext);
    const onboarding = useContext(OnboardingContext);
    const navigate = useNavigate();

    // State for collecting data
    const [userName, setUserName] = useState(auth?.user?.name || '');
    const [language, setLanguage] = useState('en');
    const [locationAllowed, setLocationAllowed] = useState(false);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [topics, setTopics] = useState<string[]>([]);
    
    const totalSteps = 5;

    const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));
    
    const handleLocation = () => {
        navigator.geolocation.getCurrentPosition(
            () => { setLocationAllowed(true); nextStep(); },
            () => { setLocationAllowed(false); nextStep(); }
        );
    };

    const toggleGoal = (goal: Omit<Goal, 'id'>) => {
        setGoals(prev => {
            if(prev.some(g => g.text === goal.text)) {
                return prev.filter(g => g.text !== goal.text);
            }
            return [...prev, { ...goal, id: `goal-${Date.now()}` }];
        });
    };

    const toggleTopic = (topicName: string) => {
        setTopics(prev => prev.includes(topicName) ? prev.filter(t => t !== topicName) : [...prev, topicName]);
    };

    const finishOnboarding = () => {
        const data: Partial<OnboardingData> = { userName, language, locationAllowed, goals, topics };
        onboarding?.completeOnboarding(data);
        navigate('/', { replace: true });
    };

    const renderStep = () => {
        switch (step) {
            case 1: // Name
                return (
                    <div className="text-center w-full max-w-sm">
                        <User size={48} className="mx-auto text-yellow-400 mb-4" />
                        <h2 className="text-3xl font-bold mb-2">What should we call you?</h2>
                        <p className="text-gray-400 mb-8">This will be used to personalize your experience.</p>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full bg-gray-800 text-white text-center text-xl p-3 rounded-lg border-2 border-gray-700 focus:border-yellow-500 focus:outline-none"
                        />
                    </div>
                );
            case 2: // Language
                return (
                    <div className="text-center w-full max-w-sm">
                        <Languages size={48} className="mx-auto text-yellow-400 mb-4" />
                        <h2 className="text-3xl font-bold mb-2">Choose your language</h2>
                        <p className="text-gray-400 mb-8">Select your preferred language for the app.</p>
                        <div className="space-y-3">
                            {LANGUAGES.map(lang => (
                                <button key={lang.code} onClick={() => { setLanguage(lang.code); nextStep(); }} className={`w-full p-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-4 ${language === lang.code ? 'bg-yellow-500 text-black' : 'bg-gray-800 hover:bg-gray-700'}`}>
                                    <span>{lang.flag}</span> {lang.name}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 3: // Location
                return (
                    <div className="text-center w-full max-w-sm">
                        <MapPin size={48} className="mx-auto text-yellow-400 mb-4" />
                        <h2 className="text-3xl font-bold mb-2">Personalize your content</h2>
                        <p className="text-gray-400 mb-8">Allowing location access can help us suggest relevant content and community events. We respect your privacy.</p>
                        <button onClick={handleLocation} className="w-full bg-yellow-500 text-black font-bold py-4 px-6 rounded-xl mb-3">Enable Location Services</button>
                        <button onClick={() => nextStep()} className="text-gray-400 hover:text-white">Maybe Later</button>
                    </div>
                );
            case 4: // Goals
                return (
                    <div className="text-center w-full max-w-md">
                        <Target size={48} className="mx-auto text-yellow-400 mb-4" />
                        <h2 className="text-3xl font-bold mb-2">What are your goals?</h2>
                        <p className="text-gray-400 mb-8">Select what you'd like to achieve. You can change this later.</p>
                        <div className="space-y-3">
                             {GOALS.map(goal => (
                                <button key={goal.text} onClick={() => toggleGoal(goal)} className="w-full p-4 rounded-lg font-semibold text-lg transition-colors bg-gray-800 hover:bg-gray-700 flex items-center justify-between">
                                    <span>{goal.text}</span>
                                    {goals.some(g => g.text === goal.text) && <Check size={24} className="text-yellow-400"/>}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 5: // Topics
                return (
                    <div className="text-center w-full max-w-lg">
                        <h2 className="text-3xl font-bold mb-2">What interests you?</h2>
                        <p className="text-gray-400 mb-8">Choose at least one topic for personalized recommendations.</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {BIBLE_TOPICS.map(topic => (
                                <button key={topic.name} onClick={() => toggleTopic(topic.name)} className={`px-4 py-3 rounded-full font-semibold transition-all duration-200 text-lg flex items-center gap-2 ${topics.includes(topic.name) ? 'bg-yellow-500 text-black scale-105' : 'bg-gray-800 hover:bg-gray-700'}`}>
                                    {topic.emoji} {topic.name}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            default: return null;
        }
    };
    
    const canProceed = () => {
        if(step === 1) return userName.trim() !== '';
        if(step === 5) return topics.length > 0;
        return true;
    }

    return (
        <div className="bg-black text-white min-h-screen flex flex-col p-6">
            <header className="w-full flex justify-between items-center">
                {step > 1 ? (
                    <button onClick={prevStep} className="bg-gray-800 rounded-full p-2 hover:bg-gray-700">
                        <ArrowLeft size={24} />
                    </button>
                ) : <div className="w-10 h-10" />}
                 <button onClick={finishOnboarding} className="text-gray-400 font-semibold hover:text-white">Skip</button>
            </header>

            <main className="flex-grow flex items-center justify-center">
                {renderStep()}
            </main>

            <footer className="w-full max-w-sm mx-auto flex flex-col items-center gap-4">
                <ProgressDots total={totalSteps} current={step} />
                {step < totalSteps && (
                    <button onClick={nextStep} disabled={!canProceed()} className="w-full bg-white text-black font-bold py-4 px-6 rounded-xl mt-4 disabled:opacity-50">
                        Continue
                    </button>
                )}
                 {step === totalSteps && (
                    <button onClick={finishOnboarding} disabled={!canProceed()} className="w-full bg-yellow-500 text-black font-bold py-4 px-6 rounded-xl mt-4 disabled:opacity-50">
                        Finish Setup
                    </button>
                )}
            </footer>
        </div>
    );
};

export default OnboardingPage;
