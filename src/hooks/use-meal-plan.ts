
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';
import type { PlannedMeal } from '@/lib/types';

const getMealPlanKey = (email: string | undefined) => {
  if (!email) return 'flavorverse-meal-plan-guest';
  return `flavorverse-meal-plan-${email}`;
};

export function useMealPlan() {
  const { user, isInitialized: authIsInitialized } = useAuth();
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const mealPlanKey = getMealPlanKey(user?.email);

  useEffect(() => {
    if (authIsInitialized) {
      try {
        const storedPlans = localStorage.getItem(mealPlanKey);
        if (storedPlans) {
          const parsedPlans: PlannedMeal[] = JSON.parse(storedPlans);
          // Sort by date ascending
          const sortedPlans = parsedPlans.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          setPlannedMeals(sortedPlans);
        } else {
          setPlannedMeals([]);
        }
      } catch (error) {
        console.error('Error reading meal plan from localStorage', error);
        setPlannedMeals([]);
      } finally {
        setIsInitialized(true);
      }
    }
  }, [mealPlanKey, authIsInitialized]);

  const addMeal = useCallback((recipeId: string, date: Date) => {
    if (!authIsInitialized) return;

    setPlannedMeals(prevMeals => {
      const newMeal: PlannedMeal = { recipeId, date: date.toISOString() };
      const updatedMeals = [...prevMeals, newMeal].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      try {
        localStorage.setItem(mealPlanKey, JSON.stringify(updatedMeals));
      } catch (error) {
        console.error('Error writing meal plan to localStorage', error);
      }
      
      return updatedMeals;
    });
  }, [mealPlanKey, authIsInitialized]);

  const removeMeal = useCallback((recipeId: string, date: string) => {
    if (!authIsInitialized) return;

    setPlannedMeals(prevMeals => {
      const updatedMeals = prevMeals.filter(meal => !(meal.recipeId === recipeId && meal.date === date));
      
      try {
        localStorage.setItem(mealPlanKey, JSON.stringify(updatedMeals));
      } catch (error) {
        console.error('Error writing meal plan to localStorage', error);
      }
      
      return updatedMeals;
    });
  }, [mealPlanKey, authIsInitialized]);


  return { plannedMeals, addMeal, removeMeal, isInitialized: authIsInitialized && isInitialized };
}
