
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';
import type { RecentList } from '@/lib/types';
import type { Recipe } from '@/lib/types';

const getRecentListsKey = (email: string | undefined) => {
  if (!email) return 'flavorverse-recent-lists-guest';
  return `flavorverse-recent-lists-${email}`;
};

const MAX_RECENT_LISTS = 5;

export function useRecentLists() {
  const { user, isInitialized: authIsInitialized } = useAuth();
  const [recentLists, setRecentLists] = useState<RecentList[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const recentListsKey = getRecentListsKey(user?.email);

  useEffect(() => {
    if (authIsInitialized) {
      try {
        const storedLists = localStorage.getItem(recentListsKey);
        if (storedLists) {
          setRecentLists(JSON.parse(storedLists));
        } else {
          setRecentLists([]);
        }
      } catch (error) {
        console.error('Error reading recent lists from localStorage', error);
        setRecentLists([]);
      } finally {
        setIsInitialized(true);
      }
    }
  }, [recentListsKey, authIsInitialized]);

  const addRecentList = useCallback((recipe: Recipe) => {
    if (!authIsInitialized) return;

    setRecentLists(prevLists => {
      const newList: RecentList = {
        recipeId: recipe.id,
        recipeSlug: recipe.slug,
        recipeTitle: recipe.title,
        viewedAt: new Date().toISOString(),
      };

      // Remove any existing list for the same recipe to avoid duplicates
      const filteredLists = prevLists.filter(list => list.recipeId !== recipe.id);
      
      // Add the new list to the top and slice to maintain max length
      const updatedLists = [newList, ...filteredLists].slice(0, MAX_RECENT_LISTS);
      
      try {
        localStorage.setItem(recentListsKey, JSON.stringify(updatedLists));
      } catch (error) {
        console.error('Error writing recent lists to localStorage', error);
      }
      
      return updatedLists;
    });
  }, [recentListsKey, authIsInitialized]);

  return { recentLists, addRecentList, isInitialized: authIsInitialized && isInitialized };
}
