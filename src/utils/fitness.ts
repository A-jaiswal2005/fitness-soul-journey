
export interface UserProfile {
  name: string;
  age: number;
  sex: string;
  weight: number;
  height: number;
  goal: string;
  experienceLevel: string;
  menstrualTracking?: boolean;
  lastPeriodDate?: string;
  cycleDuration?: number;
}

// Calculate BMI
export const calculateBMI = (weight: number, height: number): number => {
  // BMI = weight(kg) / (height(m))²
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

// Get BMI category
export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

// Calculate daily calorie needs (Harris-Benedict Equation)
export const calculateCalorieNeeds = (
  weight: number,
  height: number,
  age: number,
  sex: string,
  activityLevel: string = 'moderate'
): number => {
  let bmr;
  
  // Calculate Basal Metabolic Rate (BMR)
  if (sex === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
  
  // Apply activity multiplier
  let activityMultiplier;
  switch (activityLevel) {
    case 'sedentary':
      activityMultiplier = 1.2;
      break;
    case 'light':
      activityMultiplier = 1.375;
      break;
    case 'moderate':
      activityMultiplier = 1.55;
      break;
    case 'active':
      activityMultiplier = 1.725;
      break;
    case 'very_active':
      activityMultiplier = 1.9;
      break;
    default:
      activityMultiplier = 1.55; // Default to moderate
  }
  
  return Math.round(bmr * activityMultiplier);
};

// Get activity level based on user's goal and experience
export const getActivityLevel = (goal: string, experienceLevel: string): string => {
  if (goal === 'lose_weight') {
    return experienceLevel === 'beginner' ? 'light' : 'moderate';
  }
  
  if (goal === 'build_muscle') {
    return experienceLevel === 'advanced' ? 'very_active' : 'active';
  }
  
  // For general fitness, endurance, etc.
  switch (experienceLevel) {
    case 'beginner':
      return 'light';
    case 'intermediate':
      return 'moderate';
    case 'advanced':
      return 'active';
    default:
      return 'moderate';
  }
};
