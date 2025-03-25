
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

const Auth = () => {
  const navigate = useNavigate();
  
  const handleContinue = () => {
    navigate('/dashboard');
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
                No authentication required - just click below to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Button 
                onClick={handleContinue}
                className="w-full bg-primary hover:bg-primary/90 button-shine"
              >
                Continue to Dashboard
              </Button>
              <p className="mt-4 text-sm text-muted-foreground">
                Authentication has been disabled for easy access
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
