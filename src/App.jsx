import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import AppLayout from './components/layout/AppLayout';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import TaskDetailsPage from './pages/TaskDetailsPage';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          {/* Public Routes - Login and Signup */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes - With Sidebar and Layout */}
          <Route path="/dashboard" element={
            <>
              <Sidebar />
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </>
          } />
          <Route path="/projects" element={
            <>
              <Sidebar />
              <AppLayout>
                <Projects />
              </AppLayout>
            </>
          } />
          <Route path="/projects/:projectId" element={
            <>
              <Sidebar />
              <AppLayout>
                <ProjectDetailsPage />
              </AppLayout>
            </>
          } />
          <Route path="/tasks" element={
            <>
              <Sidebar />
              <AppLayout>
                <Tasks />
              </AppLayout>
            </>
          } />
          <Route path="/tasks/:taskId" element={
            <>
              <Sidebar />
              <AppLayout>
                <TaskDetailsPage />
              </AppLayout>
            </>
          } />
          <Route path="/chat" element={
            <>
              <Sidebar />
              <AppLayout>
                <Chat />
              </AppLayout>
            </>
          } />
          <Route path="/settings" element={
            <>
              <Sidebar />
              <AppLayout>
                <Settings />
              </AppLayout>
            </>
          } />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
