'use server';

/**
 * @fileOverview This file defines the Genkit flow for suggesting ingredient substitutions based on dietary restrictions or ingredient availability.
 *
 * - suggestIngredientSubstitution - A function that suggests ingredient substitutions.
 * - SuggestIngredientSubstitutionInput - The input type for the suggestIngredientSubstitution function.
 * - SuggestIngredientSubstitutionOutput - The return type for the suggestIngredientSubstitution function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestIngredientSubstitutionInputSchema = z.object({
  ingredient: z.string().describe('The ingredient to be substituted.'),
  dietaryRestrictions: z
    .string()
    .describe(
      'Dietary restrictions or preferences (e.g., vegetarian, vegan, gluten-free, nut allergy).' ),
  availableIngredients: z
    .string()
    .optional()
    .describe('List of available ingredients in the user’s kitchen.'),
  recipeName: z.string().describe('The name of the recipe.'),
});

export type SuggestIngredientSubstitutionInput = z.infer<
  typeof SuggestIngredientSubstitutionInputSchema
>;

const SuggestIngredientSubstitutionOutputSchema = z.object({
  substitution: z.string().describe('The suggested ingredient substitution.'),
  reason: z
    .string()
    .describe(
      'Explanation of why the substitution is suitable, considering dietary restrictions and/or available ingredients.'
    ),
});

export type SuggestIngredientSubstitutionOutput = z.infer<
  typeof SuggestIngredientSubstitutionOutputSchema
>;

export async function suggestIngredientSubstitution(
  input: SuggestIngredientSubstitutionInput
): Promise<SuggestIngredientSubstitutionOutput> {
  return suggestIngredientSubstitutionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestIngredientSubstitutionPrompt',
  input: {schema: SuggestIngredientSubstitutionInputSchema},
  output: {schema: SuggestIngredientSubstitutionOutputSchema},
  prompt: `You are a helpful assistant that suggests ingredient substitutions for recipes.

  Recipe Name: {{{recipeName}}}
  Ingredient to Substitute: {{{ingredient}}}
  Dietary Restrictions: {{{dietaryRestrictions}}}
  Available Ingredients: {{{availableIngredients}}}

  Suggest a suitable substitution for the ingredient, considering the dietary restrictions and available ingredients. Explain why the substitution is appropriate. Return the substitution and explanation in the JSON format.
  `,
});

const suggestIngredientSubstitutionFlow = ai.defineFlow(
  {
    name: 'suggestIngredientSubstitutionFlow',
    inputSchema: SuggestIngredientSubstitutionInputSchema,
    outputSchema: SuggestIngredientSubstitutionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
