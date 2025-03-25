
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import { initializeUserPlans, updateMealCompletion } from '@/services/aiPlanner';

type Meal = {
  name: string;
  time: string;
  description: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  completed: boolean;
};

type MealPlan = {
  day: string;
  meals: Meal[];
};

export const DietPlanner = () => {
  const [dietPlan, setDietPlan] = useState<MealPlan[]>([]);
  const [currentDay, setCurrentDay] = useState<string>('Monday');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize diet plan from localStorage
    const plans = initializeUserPlans();
    setDietPlan(plans.dietPlan);
    setLoading(false);
    
    // Get the current day of the week
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    setCurrentDay(today);
  }, []);

  const handleMealCompletion = (dayName: string, mealIndex: number, completed: boolean) => {
    // Update localStorage
    updateMealCompletion(dayName, mealIndex, completed);
    
    // Update state
    setDietPlan(prevPlan => {
      return prevPlan.map(day => {
        if (day.day === dayName) {
          const updatedMeals = [...day.meals];
          updatedMeals[mealIndex] = {
            ...updatedMeals[mealIndex],
            completed
          };
          return { ...day, meals: updatedMeals };
        }
        return day;
      });
    });
    
    if (completed) {
      toast.success(`Completed: ${dietPlan.find(d => d.day === dayName)?.meals[mealIndex].name}`);
    }
  };

  // Calculate daily totals for the selected day
  const getDailyTotals = (day: MealPlan) => {
    return day.meals.reduce((totals, meal) => {
      return {
        calories: totals.calories + meal.calories,
        protein: totals.protein + meal.macros.protein,
        carbs: totals.carbs + meal.macros.carbs,
        fat: totals.fat + meal.macros.fat
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  return (
    <div className="container py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Your Nutrition Plan</h1>
        <p className="text-muted-foreground">
          Follow this personalized meal plan to fuel your body and reach your goals
        </p>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Tabs defaultValue={currentDay} className="w-full">
          <TabsList className="grid grid-cols-7 mb-8">
            {dietPlan.map((day) => (
              <TabsTrigger key={day.day} value={day.day} className="text-sm">
                {day.day.substring(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {dietPlan.map((day) => {
            const dailyTotals = getDailyTotals(day);
            
            return (
              <TabsContent key={day.day} value={day.day}>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{day.day}'s Nutrition</span>
                      <Badge variant="outline" className="ml-2">
                        {day.meals.filter(m => m.completed).length}/{day.meals.length} meals completed
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Daily Targets: {dailyTotals.calories} calories • {dailyTotals.protein}g protein • 
                      {dailyTotals.carbs}g carbs • {dailyTotals.fat}g fat
                    </CardDescription>
                  </CardHeader>
                </Card>
                
                <div className="grid gap-6 md:grid-cols-2">
                  {day.meals.map((meal, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center">
                              <Checkbox 
                                id={`${day.day}-meal-${index}`}
                                checked={meal.completed}
                                onCheckedChange={(checked) => {
                                  handleMealCompletion(day.day, index, checked === true);
                                }}
                                className="mr-2"
                              />
                              <label 
                                htmlFor={`${day.day}-meal-${index}`}
                                className={`font-medium ${meal.completed ? 'line-through text-muted-foreground' : ''}`}
                              >
                                {meal.name}
                              </label>
                            </CardTitle>
                            <CardDescription>{meal.time}</CardDescription>
                          </div>
                          <Badge>{meal.calories} cal</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4">{meal.description}</p>
                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                          <div className="rounded-lg bg-muted p-2">
                            <div className="font-medium">{meal.macros.protein}g</div>
                            <div className="text-xs text-muted-foreground">Protein</div>
                          </div>
                          <div className="rounded-lg bg-muted p-2">
                            <div className="font-medium">{meal.macros.carbs}g</div>
                            <div className="text-xs text-muted-foreground">Carbs</div>
                          </div>
                          <div className="rounded-lg bg-muted p-2">
                            <div className="font-medium">{meal.macros.fat}g</div>
                            <div className="text-xs text-muted-foreground">Fat</div>
                          </div>
                        </div>
                        
                        {!meal.completed && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-4 w-full"
                            onClick={() => handleMealCompletion(day.day, index, true)}
                          >
                            Mark as Complete
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
};
