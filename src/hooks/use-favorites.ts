
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';

const getFavoritesKey = (email: string | undefined) => {
  if (!email) return 'flavorverse-favorites-guest';
  return `flavorverse-favorites-${email}`;
};

export function useFavorites() {
  const { user, isInitialized: authIsInitialized } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const favoritesKey = getFavoritesKey(user?.email);

  useEffect(() => {
    if (authIsInitialized) {
      try {
        const storedFavorites = localStorage.getItem(favoritesKey);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error('Error reading favorites from localStorage', error);
        setFavorites([]);
      } finally {
        setIsInitialized(true);
      }
    }
  }, [favoritesKey, authIsInitialized]);

  const toggleFavorite = useCallback((recipeId: string) => {
    if (!authIsInitialized) return;

    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.includes(recipeId)
        ? prevFavorites.filter(id => id !== recipeId)
        : [...prevFavorites, recipeId];
      
      try {
        localStorage.setItem(favoritesKey, JSON.stringify(newFavorites));
      } catch (error) {
        console.error('Error writing favorites to localStorage', error);
      }
      
      return newFavorites;
    });
  }, [favoritesKey, authIsInitialized]);

  const isFavorite = useCallback((recipeId: string) => {
    return favorites.includes(recipeId);
  }, [favorites]);

  return { favorites, toggleFavorite, isFavorite, isInitialized: authIsInitialized && isInitialized };
}
