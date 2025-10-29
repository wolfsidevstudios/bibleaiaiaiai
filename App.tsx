import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import ReadPage from './pages/ReadPage';
import SearchPage from './pages/SearchPage';
import AssistantPage from './pages/AssistantPage';
import ProfilePage from './pages/ProfilePage';
import PlanPage from './pages/PlanPage';
import ClipsPage from './pages/ClipsPage';
import QuizPage from './pages/QuizPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="bg-black text-gray-100 min-h-screen font-sans flex flex-col">
        <main className="flex-grow pb-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/read" element={<ReadPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/plan/:planId" element={<PlanPage />} />
            <Route path="/clips" element={<ClipsPage />} />
            <Route path="/quiz/:quizId" element={<QuizPage />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </HashRouter>
  );
};

export default App;
