
import React from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Auth = () => {
  const navigate = useNavigate();
  
  const handleContinue = () => {
    // Initialize user profile data if it doesn't exist
    if (!localStorage.getItem('fitnessUserProfile')) {
      // Set default empty profile
      localStorage.setItem('fitnessUserProfile', JSON.stringify({
        name: '',
        age: 30,
        sex: 'male',
        weight: 70,
        height: 170,
        goal: 'improve_fitness',
        experienceLevel: 'beginner'
      }));
      
      // Navigate to profile page to complete setup
      toast.info('Please complete your profile to get personalized recommendations');
      navigate('/profile');
    } else {
      // If profile exists, go straight to dashboard
      navigate('/dashboard');
    }
  };

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
          
          <Card className="border border-border shadow-sm">
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>
                Continue to create your personalized AI fitness plan
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Button 
                onClick={handleContinue}
                className="w-full bg-primary hover:bg-primary/90 button-shine"
              >
                Continue to Profile
              </Button>
              <p className="mt-4 text-sm text-muted-foreground">
                You'll need to create a profile to get personalized recommendations
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
