import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import AppLayout from './components/layout/AppLayout';

import Login from './pages/Login';
import Signup from './pages/Signup';
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
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import FeatureDetails from './pages/FeatureDetails';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          {/* Public Routes - Login and Signup */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes - With Layout */}
          <Route path="/docs" element={
            <AppLayout>
              <Documentation />
            </AppLayout>
          } />
          <Route path="/documentation" element={
            <AppLayout>
              <Documentation />
            </AppLayout>
          } />
          <Route path="/aboutus" element={
            <AppLayout>
              <AboutUs />
            </AppLayout>
          } />
          <Route path="/about" element={
            <AppLayout>
              <AboutUs />
            </AppLayout>
          } />
          <Route path="/contactus" element={
            <AppLayout>
              <ContactUs />
            </AppLayout>
          } />
          <Route path="/contact" element={
            <AppLayout>
              <ContactUs />
            </AppLayout>
          } />
          <Route path="/dashboard" element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          } />
          <Route path="/projects" element={
            <AppLayout>
              <Projects />
            </AppLayout>
          } />
          <Route path="/projects/:projectId" element={
            <AppLayout>
              <ProjectDetailsPage />
            </AppLayout>
          } />
          <Route path="/board" element={
            <AppLayout>
              <Board />
            </AppLayout>
          } />
          <Route path="/calendar" element={
            <AppLayout>
              <Calendar />
            </AppLayout>
          } />
          <Route path="/chat" element={
            <AppLayout>
              <Chat />
            </AppLayout>
          } />
          <Route path="/settings" element={
            <AppLayout>
              <Settings />
            </AppLayout>
          } />
          <Route path="/features/:featureId" element={
            <AppLayout>
              <FeatureDetails />
            </AppLayout>
          } />
          <Route path="/stories/:storyId" element={
            <AppLayout>
              <StoryDetailsPage />
            </AppLayout>
          } />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
