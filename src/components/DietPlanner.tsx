
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import { initializeUserPlans, updateMealCompletion, calculateDailyNutrition, getTodaysMeals } from '@/services/aiPlanner';
import { NutritionistChat } from './NutritionistChat';
import { Progress } from "@/components/ui/progress";

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
  const [showChat, setShowChat] = useState(false);
  const [dailyNutrition, setDailyNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  useEffect(() => {
    // Initialize diet plan from localStorage
    const plans = initializeUserPlans();
    setDietPlan(plans.dietPlan);
    setLoading(false);
    
    // Get the current day of the week
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    setCurrentDay(today);

    // Calculate daily nutrition from completed meals
    updateNutritionStats();
  }, []);

  const updateNutritionStats = () => {
    const completedMeals = getTodaysMeals();
    const nutrition = calculateDailyNutrition(completedMeals);
    setDailyNutrition(nutrition);
  };

  const handleMealCompletion = (dayName: string, mealIndex: number, completed: boolean) => {
    // Only allow completing meals for the current day
    if (dayName !== currentDay && completed) {
      toast.error("You can only complete meals for today");
      return;
    }

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
      
      // Update nutrition stats whenever a meal is completed
      setTimeout(() => {
        updateNutritionStats();
      }, 300);
    } else {
      // Also update when a meal is uncompleted
      setTimeout(() => {
        updateNutritionStats();
      }, 300);
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

  // Function to check if a day is in the past compared to the current day
  const isPastDay = (dayName: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayIndex = days.indexOf(dayName);
    
    // Special case for Sunday (index 0) when comparing with days later in the week
    if (todayIndex === 0 && dayIndex > 0) {
      return true;
    }
    
    // If day of the week index is less than today's index, it's a past day
    return dayIndex < todayIndex;
  };

  return (
    <div className="container py-10">
      <div className="mb-8 space-y-2 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Your Nutrition Plan</h1>
          <p className="text-muted-foreground">
            Follow this personalized meal plan to fuel your body and reach your goals
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={() => setShowChat(!showChat)}
          className="mt-2"
        >
          {showChat ? "Hide Nutritionist Chat" : "Ask Nutritionist"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className={`md:col-span-${showChat ? '2' : '3'}`}>
          {loading ? (
            <div className="flex items-center justify-center h-60">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Today's Nutrition Tracking</CardTitle>
                  <CardDescription>
                    Real-time nutrition data based on your completed meals for today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Calories</span>
                        <span className="text-sm text-muted-foreground">{dailyNutrition.calories} kcal</span>
                      </div>
                      <Progress value={Math.min(100, (dailyNutrition.calories / 2000) * 100)} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Protein</span>
                        <span className="text-sm text-muted-foreground">{dailyNutrition.protein}g</span>
                      </div>
                      <Progress value={Math.min(100, (dailyNutrition.protein / 120) * 100)} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Carbs</span>
                        <span className="text-sm text-muted-foreground">{dailyNutrition.carbs}g</span>
                      </div>
                      <Progress value={Math.min(100, (dailyNutrition.carbs / 250) * 100)} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Fat</span>
                        <span className="text-sm text-muted-foreground">{dailyNutrition.fat}g</span>
                      </div>
                      <Progress value={Math.min(100, (dailyNutrition.fat / 70) * 100)} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
                
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
                                      disabled={day.day !== currentDay}
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
                              
                              {!meal.completed && day.day === currentDay && (
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
            </>
          )}
        </div>
        
        {showChat && (
          <div className="md:col-span-1">
            <NutritionistChat />
          </div>
        )}
      </div>
    </div>
  );
};
