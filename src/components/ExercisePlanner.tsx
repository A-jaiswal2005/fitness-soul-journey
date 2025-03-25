
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import { initializeUserPlans, updateWorkoutCompletion } from '@/services/aiPlanner';

type Exercise = {
  name: string;
  sets: number;
  reps: number;
  description: string;
  completed: boolean;
};

type ExercisePlan = {
  day: string;
  exercises: Exercise[];
};

export const ExercisePlanner = () => {
  const [workoutPlan, setWorkoutPlan] = useState<ExercisePlan[]>([]);
  const [currentDay, setCurrentDay] = useState<string>('Monday');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize workout plan from localStorage
    const plans = initializeUserPlans();
    setWorkoutPlan(plans.workoutPlan);
    setLoading(false);
    
    // Get the current day of the week
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    setCurrentDay(today);
  }, []);

  const handleExerciseCompletion = (dayName: string, exerciseIndex: number, completed: boolean) => {
    // Update localStorage
    updateWorkoutCompletion(dayName, exerciseIndex, completed);
    
    // Update state
    setWorkoutPlan(prevPlan => {
      return prevPlan.map(day => {
        if (day.day === dayName) {
          const updatedExercises = [...day.exercises];
          updatedExercises[exerciseIndex] = {
            ...updatedExercises[exerciseIndex],
            completed
          };
          return { ...day, exercises: updatedExercises };
        }
        return day;
      });
    });
    
    if (completed) {
      toast.success(`Completed: ${workoutPlan.find(d => d.day === dayName)?.exercises[exerciseIndex].name}`);
    }
  };

  return (
    <div className="container py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Your Exercise Plan</h1>
        <p className="text-muted-foreground">
          Follow this personalized workout plan to reach your fitness goals
        </p>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Tabs defaultValue={currentDay} className="w-full">
          <TabsList className="grid grid-cols-7 mb-8">
            {workoutPlan.map((day) => (
              <TabsTrigger key={day.day} value={day.day} className="text-sm">
                {day.day.substring(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {workoutPlan.map((day) => (
            <TabsContent key={day.day} value={day.day}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{day.day}'s Workout</span>
                    <Badge variant="outline" className="ml-2">
                      {day.exercises.filter(e => e.completed).length}/{day.exercises.length} completed
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {day.exercises.some(e => e.name.includes('Rest')) 
                      ? 'Today is your rest day. Take it easy and recover.'
                      : 'Complete all exercises to stay on track with your fitness goals.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {day.exercises.map((exercise, index) => (
                      <div key={index} className="rounded-lg border p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <Checkbox 
                                id={`${day.day}-exercise-${index}`}
                                checked={exercise.completed}
                                onCheckedChange={(checked) => {
                                  handleExerciseCompletion(day.day, index, checked === true);
                                }}
                                className="mr-2"
                              />
                              <label 
                                htmlFor={`${day.day}-exercise-${index}`}
                                className={`font-medium text-lg ${exercise.completed ? 'line-through text-muted-foreground' : ''}`}
                              >
                                {exercise.name}
                              </label>
                            </div>
                            <p className="text-sm text-muted-foreground">{exercise.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {exercise.sets} sets × {exercise.reps} {exercise.reps > 1 ? 'reps' : 'min'}
                            </div>
                          </div>
                        </div>
                        
                        {!exercise.completed && !exercise.name.includes('Rest') && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-4"
                            onClick={() => handleExerciseCompletion(day.day, index, true)}
                          >
                            Mark as Complete
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};
