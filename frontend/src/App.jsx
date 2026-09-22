import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppQueryProvider } from './app/providers/QueryProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/ui/Loader';
import { Toaster } from 'sonner';
import { ToastProvider } from './components/ui/Toast';

// Lazy loading pages
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const DashboardLayout = React.lazy(() => import('./layouts/DashboardLayout'));
const DashboardOverview = React.lazy(() => import('./pages/DashboardOverview'));
const DashboardProfile = React.lazy(() => import('./pages/DashboardProfile'));
const Dashboard = React.lazy(() => import('./pages/Dashboard')); // Old dashboard as Links module for now
const DashboardQR = React.lazy(() => import('./pages/DashboardQR'));
const DashboardThemes = React.lazy(() => import('./pages/DashboardThemes'));
const DashboardSettings = React.lazy(() => import('./pages/DashboardSettings'));
const PublicProfile = React.lazy(() => import('./pages/PublicProfile'));
const PublicResume = React.lazy(() => import('./pages/PublicResume'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const QRPage = React.lazy(() => import('./pages/QRPage'));

function App() {
  return (
    <AppQueryProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <UserProvider>
              <ToastProvider>
                <Toaster position="top-right" richColors />
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900"><Loader size={48} /></div>}>
                <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/u/:username" element={<PublicProfile />} />
                <Route path="/u/:username/resume" element={<PublicResume />} />
                <Route path="/qr/:type/:id" element={<QRPage />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<DashboardOverview />} />
                    <Route path="dashboard/profile" element={<DashboardProfile />} />
                    <Route path="dashboard/links" element={<Dashboard />} />
                    <Route path="dashboard/qr" element={<DashboardQR />} />
                    <Route path="dashboard/themes" element={<DashboardThemes />} />
                    <Route path="dashboard/settings" element={<DashboardSettings />} />
                    <Route path="/analytics" element={<Analytics />} />
                  </Route>
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
                </Suspense>
              </ToastProvider>
            </UserProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </AppQueryProvider>
  );
}

export default App;
