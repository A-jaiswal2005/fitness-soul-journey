
// AI Planner service for generating personalized workout and diet plans

type UserProfile = {
  age?: number;
  weight?: number;
  height?: number;
  sex?: string;
  goal?: string;
  experienceLevel?: string;
};

type ExercisePlan = {
  day: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    description: string;
    completed: boolean;
  }[];
};

type MealPlan = {
  day: string;
  meals: {
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
  }[];
};

// Calculate BMI from height (cm) and weight (kg)
export const calculateBMI = (height: number, weight: number): number => {
  const heightInMeters = height / 100;
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
};

// Generate appropriate workout plan based on user profile
export const generateWorkoutPlan = (profile: UserProfile): ExercisePlan[] => {
  const { age = 30, goal = 'improve_fitness', experienceLevel = 'beginner', sex = 'male' } = profile;
  const bmi = profile.height && profile.weight ? calculateBMI(profile.height, profile.weight) : 25;
  
  const workoutPlans: ExercisePlan[] = [];
  
  // Adjust workout intensity based on profile
  const intensity = experienceLevel === 'beginner' ? 'light' 
    : experienceLevel === 'intermediate' ? 'moderate' 
    : 'heavy';
  
  // Adjust exercises based on goal
  const focusAreas = goal === 'lose_weight' ? ['cardio', 'full body']
    : goal === 'build_muscle' ? ['strength', 'hypertrophy']
    : goal === 'tone_body' ? ['functional', 'resistance']
    : ['balanced', 'general fitness'];
  
  // Age considerations
  const ageAdjusted = age > 50 ? 'low impact' : 'standard';
  
  // Create weekly plan
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Define workout templates based on goals and experience
  const templates: Record<string, any> = {
    beginner: {
      lose_weight: [
        { day: 'Monday', focus: 'cardio' },
        { day: 'Tuesday', focus: 'rest' },
        { day: 'Wednesday', focus: 'full body' },
        { day: 'Thursday', focus: 'rest' },
        { day: 'Friday', focus: 'cardio' },
        { day: 'Saturday', focus: 'light resistance' },
        { day: 'Sunday', focus: 'rest' }
      ],
      build_muscle: [
        { day: 'Monday', focus: 'upper body' },
        { day: 'Tuesday', focus: 'rest' },
        { day: 'Wednesday', focus: 'lower body' },
        { day: 'Thursday', focus: 'rest' },
        { day: 'Friday', focus: 'full body' },
        { day: 'Saturday', focus: 'rest' },
        { day: 'Sunday', focus: 'rest' }
      ],
      improve_fitness: [
        { day: 'Monday', focus: 'cardio' },
        { day: 'Tuesday', focus: 'strength' },
        { day: 'Wednesday', focus: 'rest' },
        { day: 'Thursday', focus: 'cardio' },
        { day: 'Friday', focus: 'full body' },
        { day: 'Saturday', focus: 'flexibility' },
        { day: 'Sunday', focus: 'rest' }
      ],
      tone_body: [
        { day: 'Monday', focus: 'light resistance' },
        { day: 'Tuesday', focus: 'cardio' },
        { day: 'Wednesday', focus: 'rest' },
        { day: 'Thursday', focus: 'full body' },
        { day: 'Friday', focus: 'cardio' },
        { day: 'Saturday', focus: 'rest' },
        { day: 'Sunday', focus: 'flexibility' }
      ]
    },
    intermediate: {
      // Template structures for intermediate level
      lose_weight: [
        { day: 'Monday', focus: 'hiit' },
        { day: 'Tuesday', focus: 'upper body' },
        { day: 'Wednesday', focus: 'cardio' },
        { day: 'Thursday', focus: 'lower body' },
        { day: 'Friday', focus: 'hiit' },
        { day: 'Saturday', focus: 'full body' },
        { day: 'Sunday', focus: 'rest' }
      ],
      build_muscle: [
        { day: 'Monday', focus: 'chest/triceps' },
        { day: 'Tuesday', focus: 'back/biceps' },
        { day: 'Wednesday', focus: 'rest' },
        { day: 'Thursday', focus: 'legs' },
        { day: 'Friday', focus: 'shoulders' },
        { day: 'Saturday', focus: 'arms' },
        { day: 'Sunday', focus: 'rest' }
      ],
      // Add other goal templates...
      improve_fitness: [
        { day: 'Monday', focus: 'strength' },
        { day: 'Tuesday', focus: 'cardio' },
        { day: 'Wednesday', focus: 'functional' },
        { day: 'Thursday', focus: 'hiit' },
        { day: 'Friday', focus: 'strength' },
        { day: 'Saturday', focus: 'cardio' },
        { day: 'Sunday', focus: 'rest' }
      ],
      tone_body: [
        { day: 'Monday', focus: 'upper body' },
        { day: 'Tuesday', focus: 'cardio' },
        { day: 'Wednesday', focus: 'lower body' },
        { day: 'Thursday', focus: 'rest' },
        { day: 'Friday', focus: 'full body circuit' },
        { day: 'Saturday', focus: 'cardio/core' },
        { day: 'Sunday', focus: 'rest' }
      ]
    },
    advanced: {
      // Template structures for advanced level
      lose_weight: [
        { day: 'Monday', focus: 'hiit/strength' },
        { day: 'Tuesday', focus: 'cardio/core' },
        { day: 'Wednesday', focus: 'full body circuit' },
        { day: 'Thursday', focus: 'cardio/strength' },
        { day: 'Friday', focus: 'hiit' },
        { day: 'Saturday', focus: 'cardio/flexibility' },
        { day: 'Sunday', focus: 'active recovery' }
      ],
      build_muscle: [
        { day: 'Monday', focus: 'chest/triceps' },
        { day: 'Tuesday', focus: 'back/biceps' },
        { day: 'Wednesday', focus: 'rest' },
        { day: 'Thursday', focus: 'legs/core' },
        { day: 'Friday', focus: 'shoulders/traps' },
        { day: 'Saturday', focus: 'arms/abs' },
        { day: 'Sunday', focus: 'rest' }
      ],
      // Add other goal templates...
      improve_fitness: [
        { day: 'Monday', focus: 'strength/power' },
        { day: 'Tuesday', focus: 'hiit/cardio' },
        { day: 'Wednesday', focus: 'strength/hypertrophy' },
        { day: 'Thursday', focus: 'metabolic conditioning' },
        { day: 'Friday', focus: 'strength/power' },
        { day: 'Saturday', focus: 'cardio/endurance' },
        { day: 'Sunday', focus: 'active recovery' }
      ],
      tone_body: [
        { day: 'Monday', focus: 'upper body/core' },
        { day: 'Tuesday', focus: 'hiit/cardio' },
        { day: 'Wednesday', focus: 'lower body/core' },
        { day: 'Thursday', focus: 'cardio/functional' },
        { day: 'Friday', focus: 'full body circuit' },
        { day: 'Saturday', focus: 'target areas/cardio' },
        { day: 'Sunday', focus: 'flexibility/recovery' }
      ]
    }
  };
  
  // Get the appropriate template
  const selectedTemplate = templates[experienceLevel]?.[goal] || templates.beginner.improve_fitness;
  
  // Exercise database - simplified version
  const exercises = {
    cardio: [
      { name: 'Brisk Walking', sets: 1, reps: 30, description: '30 minutes of brisk walking' },
      { name: 'Jogging', sets: 1, reps: 20, description: '20 minutes of light jogging' },
      { name: 'Cycling', sets: 1, reps: 25, description: '25 minutes on stationary bike' },
      { name: 'Jump Rope', sets: 3, reps: 50, description: '50 skips per set with 1 min rest' }
    ],
    'upper body': [
      { name: 'Push-ups', sets: 3, reps: 10, description: 'Keep body straight, lower to ground' },
      { name: 'Dumbbell Rows', sets: 3, reps: 12, description: 'Pull weight to hip, keep back straight' },
      { name: 'Shoulder Press', sets: 3, reps: 10, description: 'Press weights overhead' },
      { name: 'Bicep Curls', sets: 3, reps: 12, description: 'Curl weights towards shoulders' }
    ],
    'lower body': [
      { name: 'Bodyweight Squats', sets: 3, reps: 15, description: 'Lower until thighs parallel to ground' },
      { name: 'Lunges', sets: 3, reps: 10, description: '10 reps each leg, step forward and lower' },
      { name: 'Glute Bridges', sets: 3, reps: 15, description: 'Lift hips toward ceiling' },
      { name: 'Calf Raises', sets: 3, reps: 20, description: 'Rise onto toes and lower' }
    ],
    'full body': [
      { name: 'Burpees', sets: 3, reps: 10, description: 'Complete movement with push-up' },
      { name: 'Mountain Climbers', sets: 3, reps: 20, description: '20 per leg, alternate knees to chest' },
      { name: 'Kettlebell Swings', sets: 3, reps: 15, description: 'Swing weight to shoulder height' },
      { name: 'Plank', sets: 3, reps: 1, description: 'Hold for 30 seconds per set' }
    ],
    hiit: [
      { name: 'Sprint Intervals', sets: 5, reps: 1, description: '30 sec sprint, 1 min walk' },
      { name: 'Burpee Intervals', sets: 5, reps: 10, description: '10 burpees, 30 sec rest' },
      { name: 'Jumping Jack Intervals', sets: 5, reps: 30, description: '30 jacks, 30 sec rest' },
      { name: 'High Knees', sets: 5, reps: 1, description: '30 sec high knees, 30 sec rest' }
    ],
    'chest/triceps': [
      { name: 'Bench Press', sets: 4, reps: 10, description: 'Lower bar to chest and press up' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: 12, description: 'Press weights on incline bench' },
      { name: 'Tricep Dips', sets: 3, reps: 15, description: 'Lower body using triceps' },
      { name: 'Tricep Extensions', sets: 3, reps: 12, description: 'Extend weights overhead' }
    ],
    flexibility: [
      { name: 'Hamstring Stretch', sets: 3, reps: 1, description: 'Hold for 30 seconds per leg' },
      { name: 'Hip Flexor Stretch', sets: 3, reps: 1, description: 'Hold for 30 seconds per side' },
      { name: 'Shoulder Stretch', sets: 3, reps: 1, description: 'Hold for 30 seconds per arm' },
      { name: 'Spinal Twist', sets: 3, reps: 1, description: 'Hold for 30 seconds per side' }
    ],
    rest: [
      { name: 'Active Recovery', sets: 1, reps: 1, description: 'Light walking or stretching' },
      { name: 'Rest Day', sets: 1, reps: 1, description: 'Take a complete rest day' }
    ],
    // Add more categories as needed
    'light resistance': [
      { name: 'Resistance Band Pulls', sets: 3, reps: 15, description: 'Pull band apart at shoulder height' },
      { name: 'Wall Push-ups', sets: 3, reps: 12, description: 'Push-ups against wall' },
      { name: 'Seated Leg Raises', sets: 3, reps: 15, description: 'Raise legs while seated' },
      { name: 'Light Dumbbell Curls', sets: 3, reps: 12, description: 'Use light weights for curls' }
    ],
    strength: [
      { name: 'Goblet Squats', sets: 4, reps: 10, description: 'Hold weight at chest, perform squat' },
      { name: 'Deadlifts', sets: 4, reps: 8, description: 'Lift weight from floor with straight back' },
      { name: 'Bench Press', sets: 4, reps: 8, description: 'Press barbell from chest' },
      { name: 'Pull-ups/Assisted Pull-ups', sets: 3, reps: 8, description: 'Pull body up to bar' }
    ],
    'back/biceps': [
      { name: 'Lat Pulldowns', sets: 4, reps: 10, description: 'Pull bar down to chest' },
      { name: 'Seated Rows', sets: 4, reps: 10, description: 'Pull weight to stomach' },
      { name: 'Bicep Curls', sets: 3, reps: 12, description: 'Curl weights towards shoulders' },
      { name: 'Hammer Curls', sets: 3, reps: 12, description: 'Curl with palms facing inward' }
    ],
    legs: [
      { name: 'Barbell Squats', sets: 4, reps: 10, description: 'Squat with barbell on shoulders' },
      { name: 'Leg Press', sets: 4, reps: 12, description: 'Press weight with legs' },
      { name: 'Romanian Deadlifts', sets: 3, reps: 10, description: 'Hinge at hips with weight' },
      { name: 'Leg Extensions', sets: 3, reps: 15, description: 'Extend legs at knee joint' }
    ],
    shoulders: [
      { name: 'Overhead Press', sets: 4, reps: 10, description: 'Press barbell overhead' },
      { name: 'Lateral Raises', sets: 3, reps: 12, description: 'Raise weights to sides' },
      { name: 'Front Raises', sets: 3, reps: 12, description: 'Raise weights to front' },
      { name: 'Face Pulls', sets: 3, reps: 15, description: 'Pull rope to face' }
    ],
    arms: [
      { name: 'Tricep Pushdowns', sets: 4, reps: 12, description: 'Push rope/bar down' },
      { name: 'Bicep Curls', sets: 4, reps: 12, description: 'Curl barbell/dumbbells' },
      { name: 'Skull Crushers', sets: 3, reps: 12, description: 'Lower weight to forehead' },
      { name: 'Hammer Curls', sets: 3, reps: 12, description: 'Curl with palms facing in' }
    ],
    'full body circuit': [
      { name: 'Circuit: Squats', sets: 3, reps: 15, description: 'Part of circuit, 15 squats' },
      { name: 'Circuit: Push-ups', sets: 3, reps: 10, description: 'Part of circuit, 10 push-ups' },
      { name: 'Circuit: Rows', sets: 3, reps: 12, description: 'Part of circuit, 12 rows' },
      { name: 'Circuit: Lunges', sets: 3, reps: 10, description: 'Part of circuit, 10 lunges per leg' }
    ],
    functional: [
      { name: 'Kettlebell Swings', sets: 3, reps: 15, description: 'Swing weight with hip hinge' },
      { name: 'Medicine Ball Slams', sets: 3, reps: 12, description: 'Slam ball to ground' },
      { name: 'TRX Rows', sets: 3, reps: 12, description: 'Row body using suspension trainer' },
      { name: 'Farmer Carries', sets: 3, reps: 1, description: 'Carry heavy weights 30 meters' }
    ]
  };
  
  // Generate workout plan from template
  selectedTemplate.forEach(dayPlan => {
    const dailyExercises = exercises[dayPlan.focus] || exercises.cardio;
    
    // Make copies of the exercises to avoid modifying the source objects
    const dailyExercisesCopy = dailyExercises.map(ex => ({
      ...ex,
      completed: false
    }));
    
    workoutPlans.push({
      day: dayPlan.day,
      exercises: dailyExercisesCopy
    });
  });
  
  return workoutPlans;
};

// Generate appropriate diet plan based on user profile
export const generateDietPlan = (profile: UserProfile): MealPlan[] => {
  const { age = 30, goal = 'improve_fitness', sex = 'male' } = profile;
  const bmi = profile.height && profile.weight ? calculateBMI(profile.height, profile.weight) : 25;
  
  // Calculate base calorie target
  let baseCalories = 0;
  
  if (sex === 'male') {
    baseCalories = 2000 + (age < 30 ? 200 : 0) + (age > 50 ? -200 : 0);
  } else {
    baseCalories = 1800 + (age < 30 ? 100 : 0) + (age > 50 ? -100 : 0);
  }
  
  // Adjust calories based on goal and BMI
  let calorieTarget = baseCalories;
  
  if (goal === 'lose_weight') {
    calorieTarget = baseCalories - 300;
  } else if (goal === 'build_muscle') {
    calorieTarget = baseCalories + 300;
  }
  
  // Adjust for BMI (simplified)
  if (bmi > 30) {
    calorieTarget -= 200;
  } else if (bmi < 18.5) {
    calorieTarget += 200;
  }
  
  // Calculate macro distribution
  let proteinPercentage = 0.25; // 25% protein
  let fatPercentage = 0.25; // 25% fat
  let carbPercentage = 0.5; // 50% carbs
  
  // Adjust macros based on goal
  if (goal === 'build_muscle') {
    proteinPercentage = 0.3; // 30% protein
    fatPercentage = 0.25; // 25% fat
    carbPercentage = 0.45; // 45% carbs
  } else if (goal === 'lose_weight') {
    proteinPercentage = 0.3; // 30% protein
    fatPercentage = 0.3; // 30% fat
    carbPercentage = 0.4; // 40% carbs
  }
  
  // Calculate grams of each macro
  const proteinGrams = Math.round((calorieTarget * proteinPercentage) / 4); // 4 calories per gram of protein
  const fatGrams = Math.round((calorieTarget * fatPercentage) / 9); // 9 calories per gram of fat
  const carbGrams = Math.round((calorieTarget * carbPercentage) / 4); // 4 calories per gram of carbs
  
  // Create meal templates
  const breakfastOptions = [
    {
      name: 'Protein Oatmeal',
      time: '7:00 AM',
      description: 'Oatmeal cooked with milk, protein powder, banana, and a tablespoon of honey',
      calories: Math.round(calorieTarget * 0.25),
      macros: {
        protein: Math.round(proteinGrams * 0.25),
        carbs: Math.round(carbGrams * 0.3),
        fat: Math.round(fatGrams * 0.15)
      }
    },
    {
      name: 'Greek Yogurt Parfait',
      time: '7:30 AM',
      description: 'Greek yogurt with berries, granola, and a drizzle of honey',
      calories: Math.round(calorieTarget * 0.25),
      macros: {
        protein: Math.round(proteinGrams * 0.3),
        carbs: Math.round(carbGrams * 0.25),
        fat: Math.round(fatGrams * 0.15)
      }
    },
    {
      name: 'Veggie Omelette',
      time: '8:00 AM',
      description: 'Egg omelette with spinach, tomatoes, onions, and a side of whole grain toast',
      calories: Math.round(calorieTarget * 0.25),
      macros: {
        protein: Math.round(proteinGrams * 0.3),
        carbs: Math.round(carbGrams * 0.2),
        fat: Math.round(fatGrams * 0.25)
      }
    },
    {
      name: 'Smoothie Bowl',
      time: '7:15 AM',
      description: 'Blend of frozen fruits, protein powder, spinach, topped with nuts and seeds',
      calories: Math.round(calorieTarget * 0.25),
      macros: {
        protein: Math.round(proteinGrams * 0.25),
        carbs: Math.round(carbGrams * 0.35),
        fat: Math.round(fatGrams * 0.15)
      }
    }
  ];
  
  const lunchOptions = [
    {
      name: 'Chicken Salad',
      time: '12:30 PM',
      description: 'Grilled chicken breast on a bed of mixed greens with vegetables and light dressing',
      calories: Math.round(calorieTarget * 0.3),
      macros: {
        protein: Math.round(proteinGrams * 0.4),
        carbs: Math.round(carbGrams * 0.2),
        fat: Math.round(fatGrams * 0.3)
      }
    },
    {
      name: 'Quinoa Bowl',
      time: '1:00 PM',
      description: 'Quinoa with roasted vegetables, chickpeas, and a tahini dressing',
      calories: Math.round(calorieTarget * 0.3),
      macros: {
        protein: Math.round(proteinGrams * 0.25),
        carbs: Math.round(carbGrams * 0.4),
        fat: Math.round(fatGrams * 0.25)
      }
    },
    {
      name: 'Turkey Wrap',
      time: '12:00 PM',
      description: 'Whole grain wrap with turkey, avocado, lettuce, tomato, and mustard',
      calories: Math.round(calorieTarget * 0.3),
      macros: {
        protein: Math.round(proteinGrams * 0.35),
        carbs: Math.round(carbGrams * 0.3),
        fat: Math.round(fatGrams * 0.3)
      }
    },
    {
      name: 'Lentil Soup & Sandwich',
      time: '12:15 PM',
      description: 'Lentil soup with a small whole grain sandwich with hummus and vegetables',
      calories: Math.round(calorieTarget * 0.3),
      macros: {
        protein: Math.round(proteinGrams * 0.3),
        carbs: Math.round(carbGrams * 0.4),
        fat: Math.round(fatGrams * 0.2)
      }
    }
  ];
  
  const dinnerOptions = [
    {
      name: 'Salmon & Vegetables',
      time: '6:30 PM',
      description: 'Baked salmon with steamed broccoli and sweet potato',
      calories: Math.round(calorieTarget * 0.3),
      macros: {
        protein: Math.round(proteinGrams * 0.4),
        carbs: Math.round(carbGrams * 0.3),
        fat: Math.round(fatGrams * 0.4)
      }
    },
    {
      name: 'Stir Fry',
      time: '7:00 PM',
      description: 'Chicken or tofu stir fry with mixed vegetables and brown rice',
      calories: Math.round(calorieTarget * 0.3),
      macros: {
        protein: Math.round(proteinGrams * 0.35),
        carbs: Math.round(carbGrams * 0.4),
        fat: Math.round(fatGrams * 0.25)
      }
    },
    {
      name: 'Lean Beef Pasta',
      time: '6:45 PM',
      description: 'Whole grain pasta with lean ground beef, tomato sauce, and vegetables',
      calories: Math.round(calorieTarget * 0.3),
      macros: {
        protein: Math.round(proteinGrams * 0.35),
        carbs: Math.round(carbGrams * 0.45),
        fat: Math.round(fatGrams * 0.3)
      }
    },
    {
      name: 'Bean & Vegetable Bowl',
      time: '6:15 PM',
      description: 'Bowl with mixed beans, quinoa, roasted vegetables, and avocado',
      calories: Math.round(calorieTarget * 0.3),
      macros: {
        protein: Math.round(proteinGrams * 0.3),
        carbs: Math.round(carbGrams * 0.35),
        fat: Math.round(fatGrams * 0.35)
      }
    }
  ];
  
  const snackOptions = [
    {
      name: 'Protein Shake',
      time: '3:30 PM',
      description: 'Protein powder mixed with water or milk',
      calories: Math.round(calorieTarget * 0.15),
      macros: {
        protein: Math.round(proteinGrams * 0.25),
        carbs: Math.round(carbGrams * 0.05),
        fat: Math.round(fatGrams * 0.05)
      }
    },
    {
      name: 'Nuts & Fruit',
      time: '3:00 PM',
      description: 'A handful of mixed nuts with an apple or orange',
      calories: Math.round(calorieTarget * 0.15),
      macros: {
        protein: Math.round(proteinGrams * 0.1),
        carbs: Math.round(carbGrams * 0.15),
        fat: Math.round(fatGrams * 0.25)
      }
    },
    {
      name: 'Greek Yogurt',
      time: '10:00 AM',
      description: 'Plain Greek yogurt with a drizzle of honey',
      calories: Math.round(calorieTarget * 0.15),
      macros: {
        protein: Math.round(proteinGrams * 0.2),
        carbs: Math.round(carbGrams * 0.1),
        fat: Math.round(fatGrams * 0.1)
      }
    },
    {
      name: 'Vegetable Sticks & Hummus',
      time: '4:00 PM',
      description: 'Carrot, celery, and cucumber sticks with hummus',
      calories: Math.round(calorieTarget * 0.15),
      macros: {
        protein: Math.round(proteinGrams * 0.1),
        carbs: Math.round(carbGrams * 0.15),
        fat: Math.round(fatGrams * 0.15)
      }
    }
  ];
  
  // Create a 7-day diet plan
  const mealPlans: MealPlan[] = [];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Create a different meal plan for each day
  daysOfWeek.forEach((day, index) => {
    // Rotate through meal options
    const breakfast = breakfastOptions[index % breakfastOptions.length];
    const lunch = lunchOptions[index % lunchOptions.length];
    const dinner = dinnerOptions[index % dinnerOptions.length];
    const snack = snackOptions[index % snackOptions.length];
    
    // Make copies of the meals to avoid modifying the source objects
    const breakfastCopy = { ...breakfast, completed: false };
    const lunchCopy = { ...lunch, completed: false };
    const dinnerCopy = { ...dinner, completed: false };
    const snackCopy = { ...snack, completed: false };
    
    mealPlans.push({
      day,
      meals: [breakfastCopy, lunchCopy, dinnerCopy, snackCopy]
    });
  });
  
  return mealPlans;
};

// Initialize user's AI-generated plans in localStorage
export const initializeUserPlans = () => {
  // Check if plans already exist
  const existingWorkoutPlan = localStorage.getItem('workoutPlan');
  const existingDietPlan = localStorage.getItem('dietPlan');
  
  if (!existingWorkoutPlan || !existingDietPlan) {
    // Get user profile from localStorage
    const userProfileJSON = localStorage.getItem('fitnessUserProfile');
    const userProfile = userProfileJSON ? JSON.parse(userProfileJSON) : {};
    
    // Generate plans
    const workoutPlan = generateWorkoutPlan(userProfile);
    const dietPlan = generateDietPlan(userProfile);
    
    // Store in localStorage
    localStorage.setItem('workoutPlan', JSON.stringify(workoutPlan));
    localStorage.setItem('dietPlan', JSON.stringify(dietPlan));
    
    return { workoutPlan, dietPlan };
  }
  
  return {
    workoutPlan: JSON.parse(existingWorkoutPlan),
    dietPlan: JSON.parse(existingDietPlan)
  };
};

// Update completion status of an exercise or meal
export const updateWorkoutCompletion = (day: string, exerciseIndex: number, completed: boolean) => {
  const workoutPlanJSON = localStorage.getItem('workoutPlan');
  if (workoutPlanJSON) {
    const workoutPlan = JSON.parse(workoutPlanJSON);
    const dayIndex = workoutPlan.findIndex((d: ExercisePlan) => d.day === day);
    
    if (dayIndex !== -1 && workoutPlan[dayIndex].exercises[exerciseIndex]) {
      workoutPlan[dayIndex].exercises[exerciseIndex].completed = completed;
      localStorage.setItem('workoutPlan', JSON.stringify(workoutPlan));
    }
  }
};

export const updateMealCompletion = (day: string, mealIndex: number, completed: boolean) => {
  const dietPlanJSON = localStorage.getItem('dietPlan');
  if (dietPlanJSON) {
    const dietPlan = JSON.parse(dietPlanJSON);
    const dayIndex = dietPlan.findIndex((d: MealPlan) => d.day === day);
    
    if (dayIndex !== -1 && dietPlan[dayIndex].meals[mealIndex]) {
      dietPlan[dayIndex].meals[mealIndex].completed = completed;
      localStorage.setItem('dietPlan', JSON.stringify(dietPlan));
    }
  }
};

// Get progress statistics
export const getProgressStats = () => {
  const workoutPlanJSON = localStorage.getItem('workoutPlan');
  const dietPlanJSON = localStorage.getItem('dietPlan');
  
  let workoutCompleted = 0;
  let workoutTotal = 0;
  let dietCompleted = 0;
  let dietTotal = 0;
  
  if (workoutPlanJSON) {
    const workoutPlan = JSON.parse(workoutPlanJSON);
    workoutPlan.forEach((day: ExercisePlan) => {
      day.exercises.forEach(exercise => {
        workoutTotal++;
        if (exercise.completed) workoutCompleted++;
      });
    });
  }
  
  if (dietPlanJSON) {
    const dietPlan = JSON.parse(dietPlanJSON);
    dietPlan.forEach((day: MealPlan) => {
      day.meals.forEach(meal => {
        dietTotal++;
        if (meal.completed) dietCompleted++;
      });
    });
  }
  
  return {
    workout: {
      completed: workoutCompleted,
      total: workoutTotal,
      percentage: workoutTotal > 0 ? Math.round((workoutCompleted / workoutTotal) * 100) : 0
    },
    diet: {
      completed: dietCompleted,
      total: dietTotal,
      percentage: dietTotal > 0 ? Math.round((dietCompleted / dietTotal) * 100) : 0
    }
  };
};

