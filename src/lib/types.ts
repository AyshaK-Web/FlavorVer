
export type Ingredient = {
  name: string;
  quantity: string;
};

export type Recipe = {
  id: string;
  slug: string;
  title: string;
  description: string;
  cuisine: string;
  servings: number;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  imageId: string;
  rating: number;
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  dietaryTags: string[];
};

export type PlannedMeal = {
  recipeId: string;
  date: string; // ISO string
};

export type RecentList = {
  recipeId: string;
  recipeSlug: string;
  recipeTitle: string;
  viewedAt: string; // ISO string
};
