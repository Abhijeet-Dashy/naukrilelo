import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { useAuth } from './context/AuthContext';

const Home = React.lazy(() => import('./pages/Home.tsx'));
const Login = React.lazy(() => import('./pages/Login.tsx'));
const Register = React.lazy(() => import('./pages/Register.tsx'));
const Companies = React.lazy(() => import('./pages/Companies.tsx'));
const CompanyDetail = React.lazy(() => import('./pages/CompanyDetail.tsx'));
const Dashboard = React.lazy(() => import('./pages/Dashboard.tsx'));
const Revision = React.lazy(() => import('./pages/Revision.tsx'));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-secondaryText">Loading...</div>}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/company/:slug" element={<CompanyDetail />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/revision" element={
              <ProtectedRoute>
                <Revision />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
