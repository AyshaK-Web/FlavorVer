
"use client";

import { useFavorites } from '@/hooks/use-favorites';
import { recipes } from '@/lib/recipes';
import { RecipeCard } from '@/components/recipe-card';
import { Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export default function FavoritesPage() {
  const { favorites, isInitialized } = useFavorites();
  
  const favoriteRecipes = recipes.filter(recipe => favorites.includes(recipe.id));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto px-4 py-8 md:px-6 md:py-12"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-headline font-bold" style={{ fontFamily: 'Alegreya, serif' }}>
          Your Favorite Recipes
        </h1>
        <p className="text-lg text-muted-foreground mt-2">Your personal collection of culinary gems.</p>
      </motion.div>

      {isInitialized && favoriteRecipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {favoriteRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      {isInitialized && favoriteRecipes.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center text-center py-20 bg-card rounded-lg border-dashed border-2"
        >
            <Heart className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Favorites Yet!</h2>
            <p className="text-muted-foreground max-w-sm">
                You haven't saved any favorite recipes. Start exploring and click the heart icon to save the ones you love.
            </p>
        </motion.div>
      )}

      {!isInitialized && (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
