
import React, { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/AuthForm';

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  // If user is already authenticated, redirect to profile or dashboard
  useEffect(() => {
    if (user && !loading) {
      // Check if user has completed profile
      const storedProfile = localStorage.getItem('fitnessUserProfile');
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        // If profile has name set, assume it's completed
        if (profile.name) {
          navigate('/dashboard');
        } else {
          navigate('/profile');
        }
      } else {
        navigate('/profile');
      }
    }
  }, [user, loading, navigate]);

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-fitness-100 rounded-full filter blur-3xl opacity-30 -z-10"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-fitness-100 rounded-full filter blur-3xl opacity-30 -z-10"></div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gradient">Welcome to Fitness Soul</h1>
            <p className="mt-2 text-foreground/70">
              Your personalized AI fitness journey begins here
            </p>
          </div>
          
          <AuthForm />
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
