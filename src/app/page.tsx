

"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Recipe } from '@/lib/types';
import { recipes as initialRecipes } from '@/lib/recipes';
import { RecipeCard } from '@/components/recipe-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Leaf, Vegan, WheatOff, Clock, BarChart3, SlidersHorizontal, Refrigerator, Sparkles, Loader2, PlusCircle } from 'lucide-react';
import { parseTime } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from '@/components/ui/textarea';
import { findRecipesByIngredients } from '@/ai/flows/find-recipes-by-ingredients';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';


const dietaryFilters = [
  { id: 'vegetarian', label: 'Vegetarian', icon: Leaf },
  { id: 'vegan', label: 'Vegan', icon: Vegan },
  { id: 'gluten-free', label: 'Gluten-Free', icon: WheatOff },
];

type Difficulty = 'All' | 'Easy' | 'Medium' | 'Hard';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [maxTime, setMaxTime] = useState(120);
  const [difficulty, setDifficulty] = useState<Difficulty>('All');
  const [showFilters, setShowFilters] = useState(false);

  // State for "What's in your fridge?"
  const [fridgeIngredients, setFridgeIngredients] = useState('');
  const [suggestedRecipes, setSuggestedRecipes] = useState<Recipe[]>([]);
  const [isFindingRecipes, setIsFindingRecipes] = useState(false);

  useEffect(() => {
    const newRecipeJson = sessionStorage.getItem('newRecipe');
    if (newRecipeJson) {
      const newRecipe = JSON.parse(newRecipeJson);
      // Avoid adding duplicates on re-render
      if (!recipes.find(recipe => recipe.id === newRecipe.id)) {
        setRecipes(prevRecipes => [newRecipe, ...prevRecipes]);
      }
      // Clean up session storage
      // sessionStorage.removeItem('newRecipe');
    }
  }, [recipes]);

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handleFindRecipes = async () => {
    if (!fridgeIngredients.trim()) return;
    setIsFindingRecipes(true);
    setSuggestedRecipes([]);
    try {
      const recipeIds = await findRecipesByIngredients({ ingredients: fridgeIngredients });
      const foundRecipes = recipes.filter(r => recipeIds.includes(r.id));
      setSuggestedRecipes(foundRecipes);
    } catch (error) {
      console.error("Error finding recipes:", error);
    } finally {
      setIsFindingRecipes(false);
    }
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const searchMatch =
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some((ing) =>
          ing.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const filterMatch =
        activeFilters.length === 0 ||
        activeFilters.every((filter) => recipe.dietaryTags.includes(filter as keyof Recipe['dietaryTags']));

      const timeMatch = parseTime(recipe.totalTime) <= maxTime;

      const difficultyMatch = difficulty === 'All' || recipe.difficulty === difficulty;

      return searchMatch && filterMatch && timeMatch && difficultyMatch;
    });
  }, [searchQuery, activeFilters, maxTime, difficulty, recipes]);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent" style={{ fontFamily: 'Alegreya, serif' }}>
          Discover Your Next Favorite Meal
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore thousands of recipes from around the world. Your culinary adventure starts here.
        </p>
      </motion.section>

      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <Card className="bg-card/80 shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-headline">
              <Refrigerator className="text-primary" />
              What's in your fridge?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Textarea
                placeholder="e.g., chicken breast, tomatoes, rice, onions..."
                className="md:col-span-2 h-24 text-base focus:ring-primary"
                value={fridgeIngredients}
                onChange={(e) => setFridgeIngredients(e.target.value)}
              />
              <Button
                onClick={handleFindRecipes}
                disabled={isFindingRecipes || !fridgeIngredients.trim()}
                className="h-full md:col-span-1 text-lg"
              >
                {isFindingRecipes ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Sparkles className="mr-2" /> Find Recipes
                  </>
                )}
              </Button>
            </div>
            {isFindingRecipes && <p className="text-center text-muted-foreground mt-4">Checking our cookbooks for you...</p>}
            {suggestedRecipes.length > 0 && (
                 <div className="mt-6">
                    <h3 className="text-xl font-bold mb-4">Here's what you can make:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {suggestedRecipes.map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                </div>
            )}
             {!isFindingRecipes && suggestedRecipes.length === 0 && fridgeIngredients && (
                <p className="text-center text-muted-foreground mt-4">
                    No matching recipes found for these ingredients. Try being more general!
                </p>
            )}
          </CardContent>
        </Card>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-10 space-y-6"
      >
        <div className="flex justify-center items-center gap-4">
          <div className="relative max-w-2xl mx-auto flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by recipe, ingredient, or cuisine..."
              className="w-full pl-12 h-14 text-base rounded-full shadow-lg focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild size="lg" className="rounded-full h-14 w-14 p-0">
                  <Link href="/add-recipe">
                    <PlusCircle className="h-7 w-7" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a new recipe</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex justify-center gap-2 md:gap-4 flex-wrap">
          <TooltipProvider>
            {dietaryFilters.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeFilters.includes(filter.id);
              return (
                <Tooltip key={filter.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isActive ? 'default' : 'secondary'}
                      onClick={() => toggleFilter(filter.id)}
                      className="rounded-full transition-all duration-200"
                      size="icon"
                      aria-label={filter.label}
                    >
                      <Icon className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{filter.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
           <Button
            variant={showFilters ? 'default' : 'secondary'}
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-full transition-all duration-200"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>
        <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto overflow-hidden"
          >
            <div className="p-6 bg-card rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label htmlFor="max-time" className="flex items-center gap-2 text-lg font-semibold">
                    <Clock className="h-5 w-5" />
                    Max Cooking Time: <span className="text-primary font-bold">{maxTime} min</span>
                  </Label>
                  <Slider
                    id="max-time"
                    max={240}
                    step={15}
                    value={[maxTime]}
                    onValueChange={(value) => setMaxTime(value[0])}
                  />
                </div>
                <div className="space-y-4">
                    <Label className="flex items-center gap-2 text-lg font-semibold">
                        <BarChart3 className="h-5 w-5" />
                        Difficulty
                    </Label>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                                {difficulty}
                                <SlidersHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Recipe Difficulty</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                                <DropdownMenuRadioItem value="All">All</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="Easy">Easy</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="Medium">Medium</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="Hard">Hard</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </motion.div>

      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">No recipes found. Try a different search or filter!</p>
        </div>
      )}
    </div>
  );
}
