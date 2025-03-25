
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/utils/fitness';

// Fetch user profile from Supabase
export const fetchUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  return data;
};

// Save user profile to Supabase
export const saveUserProfile = async (userId: string, profile: UserProfile) => {
  const { error } = await supabase
    .from('user_profiles')
    .upsert({
      id: userId,
      name: profile.name,
      age: profile.age,
      sex: profile.sex,
      weight: profile.weight,
      height: profile.height,
      goal: profile.goal,
      experience_level: profile.experienceLevel,
      menstrual_tracking: profile.menstrualTracking,
      last_period_date: profile.lastPeriodDate || null,
      cycle_duration: profile.cycleDuration || 28,
      updated_at: new Date().toISOString()
    });
    
  if (error) throw error;
  return true;
};

// Save workout plan to Supabase
export const saveWorkoutPlan = async (userId: string, planData: any) => {
  const { error } = await supabase
    .from('workout_plans')
    .upsert({
      user_id: userId,
      plan_data: planData,
      created_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    });
    
  if (error) throw error;
  return true;
};

// Save diet plan to Supabase
export const saveDietPlan = async (userId: string, planData: any) => {
  const { error } = await supabase
    .from('diet_plans')
    .upsert({
      user_id: userId,
      plan_data: planData,
      created_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    });
    
  if (error) throw error;
  return true;
};

// Save workout progress to Supabase
export const saveWorkoutProgress = async (userId: string, workoutId: string, completed: boolean) => {
  const { error } = await supabase
    .from('workout_progress')
    .upsert({
      user_id: userId,
      workout_id: workoutId,
      completed: completed,
      completion_date: completed ? new Date().toISOString() : null,
      created_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,workout_id'
    });
    
  if (error) throw error;
  return true;
};

// Fetch workout progress for a user
export const fetchWorkoutProgress = async (userId: string) => {
  const { data, error } = await supabase
    .from('workout_progress')
    .select('*')
    .eq('user_id', userId);
    
  if (error) throw error;
  return data || [];
};
