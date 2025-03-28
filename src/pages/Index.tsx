
import React from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Activity, Brain, Heart, Timer } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleGetStarted = () => {
    if (user) {
      // If user is authenticated, check if they have completed their profile
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
    } else {
      // If not authenticated, go to auth page
      navigate('/auth');
    }
  };
  
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-fitness-100 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-fitness-100 rounded-full filter blur-3xl opacity-20"></div>
      
      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Your <span className="text-gradient">AI-Powered</span> Fitness Journey Starts Here
            </h1>
            <p className="text-xl text-foreground/70 max-w-lg">
              Fitness Soul combines cutting-edge AI with proven workout techniques
              to create a personalized fitness experience for your unique body and goals.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={handleGetStarted} 
                size="lg" 
                className="bg-primary hover:bg-primary/90 button-shine"
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate(user ? '/dashboard' : '/auth')}
              >
                Explore App
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-fitness-300/30 to-fitness-700/30 rounded-2xl transform rotate-6"></div>
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1600&auto=format&fit=crop"
                alt="Fitness training" 
                className="rounded-2xl shadow-xl relative z-10 max-w-md w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <div className="bg-muted/50 py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose Fitness Soul?</h2>
          <p className="text-foreground/70">
            Our platform combines cutting-edge technology with proven fitness principles to 
            deliver a truly personalized experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="border-border/40 bg-gradient-to-b from-card/70 to-card shadow-sm hover:shadow-md transition-all">
            <CardContent className="pt-8">
              <div className="rounded-full w-12 h-12 bg-fitness-100/20 flex items-center justify-center mb-6">
                <Brain className="text-fitness-700 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Plans</h3>
              <p className="text-foreground/70">
                Customized workout and nutrition plans created by our advanced AI algorithm
                based on your unique body type and goals.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-border/40 bg-gradient-to-b from-card/70 to-card shadow-sm hover:shadow-md transition-all">
            <CardContent className="pt-8">
              <div className="rounded-full w-12 h-12 bg-fitness-100/20 flex items-center justify-center mb-6">
                <Heart className="text-fitness-700 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Holistic Approach</h3>
              <p className="text-foreground/70">
                We focus on your overall well-being, not just physical fitness, to ensure
                balanced progress and sustainable results.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-border/40 bg-gradient-to-b from-card/70 to-card shadow-sm hover:shadow-md transition-all">
            <CardContent className="pt-8">
              <div className="rounded-full w-12 h-12 bg-fitness-100/20 flex items-center justify-center mb-6">
                <Activity className="text-fitness-700 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Adaptive Training</h3>
              <p className="text-foreground/70">
                Programs that evolve with you, adjusting to your progress, feedback, 
                and changing fitness goals as you advance.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-border/40 bg-gradient-to-b from-card/70 to-card shadow-sm hover:shadow-md transition-all">
            <CardContent className="pt-8">
              <div className="rounded-full w-12 h-12 bg-fitness-100/20 flex items-center justify-center mb-6">
                <Timer className="text-fitness-700 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Time Efficiency</h3>
              <p className="text-foreground/70">
                Optimized workouts designed to deliver maximum results in the time you have,
                fitting seamlessly into your busy schedule.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <Layout>
      <Hero />
      <Features />
    </Layout>
  );
};

export default Index;
