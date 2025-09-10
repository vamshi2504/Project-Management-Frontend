import TasksPage from './pages/Tasks';
import TaskDetailsPage from './pages/TaskDetailsPage';
import VideoCallPage from './pages/VideoCallPage';

import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import InviteAccept from './pages/InviteAccept';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Board from './pages/Board';
import Calendar from './pages/Calendar';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import Documentation from './pages/Documentation';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import StoryDetailsPage from './pages/StoryDetailsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPageNew';
import FeatureDetails from './pages/FeatureDetails';
function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
          {/* Login page - no authentication yet */}
          <Route path="/" element={<Login />} />
          
          {/* Invite Accept page (not protected) */}
          <Route path="/invite/accept" element={<InviteAccept />} />
          {/* Main application pages (protected) */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/projects" element={
            <ProtectedRoute>
              <AppLayout>
                <Projects />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/board" element={
            <ProtectedRoute>
              <AppLayout>
                <Board />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/calendar" element={
            <ProtectedRoute>
              <AppLayout>
                <Calendar />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <AppLayout>
                <Chat />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <AppLayout>
                <Settings />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/docs" element={
            <ProtectedRoute>
              <AppLayout>
                <Documentation />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/about" element={
            <ProtectedRoute>
              <AppLayout>
                <AboutUs />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/contact" element={
            <ProtectedRoute>
              <AppLayout>
                <ContactUs />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/project/:id" element={
            <ProtectedRoute>
              <AppLayout>
                <ProjectDetailsPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/story/:id" element={
            <ProtectedRoute>
              <AppLayout>
                <StoryDetailsPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/feature/:id" element={
            <ProtectedRoute>
              <AppLayout>
                <FeatureDetails />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/task/:id" element={
            <ProtectedRoute>
              <AppLayout>
                <TaskDetailsPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          {/* Video Call Page */}
          <Route path="/videocall/:projectId" element={
            <ProtectedRoute>
              <AppLayout>
                <VideoCallPage />
              </AppLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  </ChakraProvider>
);
}
export default App;
