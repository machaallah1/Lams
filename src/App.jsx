import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import CreatePost from './pages/CreatePost';
import Messages from './pages/Messages';
import AiChat from './pages/AiChat';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import { useAuthStore } from './store/authStore';
import { useSocialStore } from './store/socialStore';
import { Toaster } from 'sonner';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const fetchCurrentUser = useAuthStore(state => state.fetchCurrentUser);
  const initUserData = useSocialStore(state => state.initUserData);
  const fetchPosts = useSocialStore(state => state.fetchPosts);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  useEffect(() => {
    fetchPosts();
    if (isAuthenticated) {
      fetchCurrentUser().then((user) => {
        if (user) {
          initUserData();
        }
      });
    }
  }, [isAuthenticated, fetchCurrentUser, initUserData, fetchPosts]);

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="explore" element={<Explore />} />
          <Route path="create" element={<CreatePost />} />
          <Route path="messages" element={<Messages />} />
          <Route path="aichat" element={<AiChat />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<div className="flex w-full h-full justify-center items-center text-xl text-primary/50 font-bold glass rounded-3xl m-10">Interface en construction</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
