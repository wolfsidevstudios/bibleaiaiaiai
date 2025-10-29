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
import LiveAiPage from './pages/LiveAiPage';
import CreatePage from './pages/CreatePage';
import EditPage from './pages/EditPage';
import PublishPage from './pages/PublishPage';
import { AuthProvider, AuthContext } from './contexts/AuthContext';

const ProtectedRoutes: React.FC = () => {
  const auth = useContext(AuthContext);

  if (!auth?.user) {
    return <Navigate to="/welcome" replace />;
  }

  return (
    <div className="bg-black text-gray-100 min-h-screen font-sans flex flex-col">
      <main className="flex-grow pb-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/read/:book?/:chapter?" element={<ReadPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/plan/:planId" element={<PlanPage />} />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          {/* Redirect any other protected route to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
};

const AppRoutes: React.FC = () => {
  const auth = useContext(AuthContext);
  
  return (
    <Routes>
      <Route path="/welcome" element={auth?.user ? <Navigate to="/" /> : <WelcomePage />} />
      <Route path="/auth" element={auth?.user ? <Navigate to="/" /> : <AuthPage />} />
      {/* Fullscreen Routes */}
      <Route path="/live-ai" element={auth?.user ? <LiveAiPage /> : <Navigate to="/welcome" replace />} />
      <Route path="/create" element={auth?.user ? <CreatePage /> : <Navigate to="/welcome" replace />} />
      <Route path="/edit" element={auth?.user ? <EditPage /> : <Navigate to="/welcome" replace />} />
      <Route path="/publish" element={auth?.user ? <PublishPage /> : <Navigate to="/welcome" replace />} />
      <Route path="/clips" element={auth?.user ? <ClipsPage /> : <Navigate to="/welcome" replace />} />
      {/* Routes with Bottom Nav */}
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;