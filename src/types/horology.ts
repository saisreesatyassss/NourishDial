export interface LogEntry {
  id: string;
  time: string;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'MID-DAY REFUEL' | 'SNACK' | 'HYDRATION' | 'CUSTOM';
  verificationTag: 'MANUAL VERIFIED' | 'AI OPTIC LOGGED' | 'QUICK LOG' | 'UNCONFIRMED' | 'PLAN ESTIMATE';
  title: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
  isWater?: boolean;
  waterAmountMl?: number;
  isConfirmed?: boolean;
}

export interface DayRecord {
  dateKey: string; // e.g. "2026-10-24"
  displayDate: string; // e.g. "OCT 24, THU"
  targetCalories: number;
  waterTargetMl: number;
  waterLoggedMl: number;
  proteinTargetG: number;
  carbsTargetG: number;
  fatTargetG: number;
  entries: LogEntry[];
}

export interface PantryItem {
  id: string;
  name: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: 'PROTEIN' | 'PRODUCE' | 'GRAINS' | 'DAIRY' | 'FATS';
  imageUrl?: string;
}

export interface UserGoals {
  targetCalories: number;
  targetWaterMl: number;
  targetProteinG: number;
  targetCarbsG: number;
  targetFatG: number;
  bmrKcal: number;
  tdeeKcal: number;
  streakDays: number;
  toleranceKcal24h: number;
}
