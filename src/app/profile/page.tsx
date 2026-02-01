
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, ListChecks, Heart, Utensils, Sparkles, BarChart2, Trash2 } from 'lucide-react';
import { ActivityChart } from './activity-chart';
import { RecipeCard } from '@/components/recipe-card';
import { recipes } from '@/lib/recipes';
import { motion } from 'framer-motion';
import { useMealPlan } from '@/hooks/use-meal-plan';
import { useRecentLists } from '@/hooks/use-recent-lists';
import { useFavorites } from '@/hooks/use-favorites';
import { format, isFuture } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { user, isInitialized } = useAuth();
  const { plannedMeals, removeMeal, isInitialized: plansInitialized } = useMealPlan();
  const { recentLists, isInitialized: listsInitialized } = useRecentLists();
  const { favorites, isInitialized: favsInitialized } = useFavorites();

  const suggestedRecipes = recipes.slice(0, 3); // Dummy suggestions

  if (!isInitialized) {
    return <div>Loading...</div>; // Or a proper skeleton loader
  }

  if (!user) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  const getInitials = (email: string) => {
    return email ? email.charAt(0).toUpperCase() : '?';
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5
      },
    },
  };

  const upcomingMeals = plannedMeals.filter(meal => isFuture(new Date(meal.date)));

  return (
    <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto max-w-6xl py-8 md:py-12"
    >
      <header className="mb-12">
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarFallback className="text-4xl">
              {getInitials(user.email)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-4xl font-bold font-headline">My Dashboard</h1>
            <p className="text-muted-foreground text-lg">{user.email}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - Left and Center columns */}
        <div className="lg:col-span-2 space-y-8">
            {/* Suggestions */}
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl font-headline">
                        <Sparkles className="text-primary" /> Personalized Suggestions
                    </CardTitle>
                    <CardDescription>Based on your recent activity and favorites.</CardDescription>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suggestedRecipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </CardContent>
            </Card>

            {/* Activity */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl font-headline">
                        <BarChart2 className="text-primary" /> Cooking Activity
                    </CardTitle>
                    <CardDescription>A look at your recipes cooked per week.</CardDescription>
                </CardHeader>
                <CardContent>
                   <ActivityChart />
                </CardContent>
            </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                        <Calendar /> Upcoming Plans
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {plansInitialized && upcomingMeals.length > 0 ? (
                        <ul className="space-y-3">
                            {upcomingMeals.slice(0, 5).map(meal => {
                                const recipe = recipes.find(r => r.id === meal.recipeId);
                                if (!recipe) return null;
                                return (
                                    <li key={`${meal.recipeId}-${meal.date}`} className="flex justify-between items-center text-sm">
                                        <div>
                                            <Link href={`/recipes/${recipe.slug}`} className="font-semibold hover:underline">{recipe.title}</Link>
                                            <p className="text-muted-foreground">{format(new Date(meal.date), 'EEE, MMM d')}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeMeal(meal.recipeId, meal.date)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </li>
                                )
                            })}
                        </ul>
                    ) : (
                        <p className="text-muted-foreground text-sm">You have no upcoming cooking plans. Plan a meal from a recipe!</p>
                    )}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                        <ListChecks /> Recent Shopping Lists
                    </CardTitle>
                </CardHeader>
                 <CardContent>
                    {listsInitialized && recentLists.length > 0 ? (
                         <ul className="space-y-3">
                            {recentLists.map(list => (
                                <li key={list.recipeId}>
                                    <Link href={`/shopping-list/${list.recipeSlug}`} className="text-sm font-medium hover:underline">
                                        {list.recipeTitle}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted-foreground text-sm">No recent shopping lists found.</p>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                       <Heart /> At a Glance
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Recipes Favorited</span>
                        <span className="font-bold text-lg">{favsInitialized ? favorites.length : '...'}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Recipes Cooked</span>
                        <span className="font-bold text-lg">28</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Recipes Added</span>
                        <span className="font-bold text-lg">3</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </motion.div>
  );
}
