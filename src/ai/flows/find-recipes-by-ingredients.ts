'use server';

/**
 * @fileOverview This file defines the Genkit flow for finding recipes based on a list of ingredients.
 *
 * - findRecipesByIngredients - A function that returns recipe IDs that can be made with the given ingredients.
 * - FindRecipesByIngredientsInput - The input type for the findRecipesByIngredients function.
 * - FindRecipesByIngredientsOutput - The return type for the findRecipesByIngredients function.
 */

import { recipes } from '@/lib/recipes';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FindRecipesByIngredientsInputSchema = z.object({
  ingredients: z.string().describe('A comma-separated list of ingredients the user has.'),
});

export type FindRecipesByIngredientsInput = z.infer<
  typeof FindRecipesByIngredientsInputSchema
>;

const FindRecipesByIngredientsOutputSchema = z.array(z.string()).describe('An array of recipe IDs that can be made with the provided ingredients.');

export type FindRecipesByIngredientsOutput = z.infer<
  typeof FindRecipesByIngredientsOutputSchema
>;

export async function findRecipesByIngredients(
  input: FindRecipesByIngredientsInput
): Promise<FindRecipesByIngredientsOutput> {
  return findRecipesByIngredientsFlow(input);
}

// By providing the full recipe list in the prompt, the AI can make more intelligent decisions
// about what recipes are a good match, even if the user's ingredients aren't an exact match.
const recipeDataForPrompt = recipes.map(recipe => ({
    id: recipe.id,
    title: recipe.title,
    ingredients: recipe.ingredients.map(i => i.name).join(', '),
})).map(r => `Recipe ID: ${r.id}, Title: ${r.title}, Ingredients: ${r.ingredients}`).join('\n');


const prompt = ai.definePrompt({
  name: 'findRecipesByIngredientsPrompt',
  input: { schema: FindRecipesByIngredientsInputSchema },
  output: { schema: FindRecipesByIngredientsOutputSchema },
  prompt: `You are an expert recipe suggestion engine.
  Given a list of available ingredients, your task is to identify which recipes can be prepared.

  You should be flexible. A user might not have every single ingredient for a recipe.
  If a user has the main ingredients for a recipe, you should suggest it.
  For example, if a recipe calls for 'pancetta' and the user has 'bacon', that's a good match.
  If a recipe needs 'chicken breast' and the user has 'chicken', that is also a good match.

  Here is the list of available recipes:
  ---
  ${recipeDataForPrompt}
  ---

  Here are the ingredients the user has:
  {{{ingredients}}}

  Please return an array of recipe IDs that are a good match for the user's ingredients.
  Only return the IDs, nothing else.
  `,
});

const findRecipesByIngredientsFlow = ai.defineFlow(
  {
    name: 'findRecipesByIngredientsFlow',
    inputSchema: FindRecipesByIngredientsInputSchema,
    outputSchema: FindRecipesByIngredientsOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
