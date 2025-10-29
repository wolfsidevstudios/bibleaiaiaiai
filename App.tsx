import React, { useContext } from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import ReadPage from './pages/ReadPage';
import SearchPage from './pages/SearchPage';
import AssistantPage from './pages/AssistantPage';
import ProfilePage from './pages/ProfilePage';
import PlanPage from './pages/PlanPage';
import ClipsPage from './pages/ClipsPage';
import QuizPage from './pages/QuizPage';
import WelcomePage from './pages/WelcomePage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import LiveAiPage from './pages/LiveAiPage';
import CreatePage from './pages/CreatePage';
import EditPage from './pages/EditPage';
import PublishPage from './pages/PublishPage';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { OnboardingProvider, OnboardingContext } from './contexts/OnboardingContext';
import LoadingSpinner from './components/LoadingSpinner';
import DonatePage from './pages/DonatePage';
import PrayerPage from './pages/PrayerPage';

const AppRoutes: React.FC = () => {
  const auth = useContext(AuthContext);
  const onboarding = useContext(OnboardingContext);

  if (auth?.isLoading) {
    return (
      <div className="bg-black h-screen w-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  // User is logged in but hasn't completed onboarding
  if (auth?.user && !onboarding?.onboardingData?.isComplete) {
    return (
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  // User is not logged in, show public pages
  if (!auth?.user) {
    return (
      <Routes>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    );
  }

  // User is logged in and has completed onboarding, show the main app
  return (
    <div className="bg-black text-gray-100 min-h-screen font-sans flex flex-col">
      <main className="flex-grow pb-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/read/:book?/:chapter?" element={<ReadPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/plan/:planId" element={<PlanPage />} />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          <Route path="/live-ai" element={<LiveAiPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/edit" element={<EditPage />} />
          <Route path="/publish" element={<PublishPage />} />
          <Route path="/clips" element={<ClipsPage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/prayer" element={<PrayerPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </OnboardingProvider>
    </AuthProvider>
  );
};

export default App;