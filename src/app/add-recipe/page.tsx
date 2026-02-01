
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Recipe } from '@/lib/types';


const recipeSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long.' }),
  cuisine: z.string().min(2, { message: 'Cuisine is required.' }),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  prepTime: z.string().min(1, { message: 'Prep time is required.' }),
  cookTime: z.string().min(1, { message: 'Cook time is required.' }),
  servings: z.coerce.number().min(1, { message: 'Servings must be at least 1.' }),
  ingredients: z.array(
    z.object({
      name: z.string().min(1, 'Ingredient name is required.'),
      quantity: z.string().min(1, 'Quantity is required.'),
    })
  ).min(1, { message: 'At least one ingredient is required.' }),
  instructions: z.array(
    z.object({
      step: z.string().min(1, 'Instruction step cannot be empty.'),
    })
  ).min(1, { message: 'At least one instruction is required.' }),
});

export default function AddRecipePage() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof recipeSchema>>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: '',
      description: '',
      cuisine: '',
      difficulty: 'Easy',
      prepTime: '',
      cookTime: '',
      servings: 1,
      ingredients: [{ name: '', quantity: '' }],
      instructions: [{ step: '' }],
    },
  });

  const { fields: ingredients, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const { fields: instructions, append: appendInstruction, remove: removeInstruction } = useFieldArray({
    control: form.control,
    name: "instructions",
  });

  function onSubmit(values: z.infer<typeof recipeSchema>) {
    const newRecipe: Recipe = {
        id: `new-${Date.now()}`,
        slug: values.title.toLowerCase().replace(/\s+/g, '-'),
        ...values,
        totalTime: `${parseInt(values.prepTime) + parseInt(values.cookTime)} mins`,
        imageId: 'placeholder',
        rating: 0,
        instructions: values.instructions.map(i => i.step),
        nutrition: { // Dummy data
            calories: 'N/A',
            protein: 'N/A',
            carbs: 'N/A',
            fat: 'N/A',
        },
        dietaryTags: [],
    }

    try {
      sessionStorage.setItem('newRecipe', JSON.stringify(newRecipe));
      toast({
        title: 'Recipe Added!',
        description: `${values.title} has been added to your session.`,
      });
      router.push('/');
    } catch (error) {
        toast({
            variant: "destructive",
            title: 'Uh oh! Something went wrong.',
            description: "Could not save recipe to session storage.",
        });
    }
  }

  return (
    <div className="container mx-auto max-w-3xl py-8 md:py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Contribute a Recipe</CardTitle>
          <CardDescription>Share your culinary creation with the world.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipe Title</FormLabel>
                    <FormControl><Input placeholder="e.g., Grandma's Apple Pie" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea placeholder="A short and sweet summary of your recipe." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="cuisine"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cuisine</FormLabel>
                        <FormControl><Input placeholder="e.g., Italian, Mexican" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Easy">Easy</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                    control={form.control}
                    name="prepTime"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Prep Time (mins)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 15" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="cookTime"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cook Time (mins)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 30" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="servings"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Servings</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 4" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

              <div>
                <Label className="text-lg font-semibold">Ingredients</Label>
                <div className="space-y-4 mt-2">
                  {ingredients.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-start">
                      <FormField
                        control={form.control}
                        name={`ingredients.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl><Input placeholder="Ingredient Name" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`ingredients.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl><Input placeholder="Quantity (e.g., 1 cup)" {...field} /></FormControl>
                             <FormMessage />
                          </FormItem>
                        )}
                      />
                       <Button type="button" variant="destructive" size="icon" onClick={() => removeIngredient(index)} disabled={ingredients.length <= 1}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                 <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => appendIngredient({ name: '', quantity: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Ingredient
                </Button>
              </div>

              <div>
                <Label className="text-lg font-semibold">Instructions</Label>
                 <div className="space-y-4 mt-2">
                  {instructions.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-start">
                        <span className="font-bold text-lg text-primary pt-2">{index + 1}.</span>
                        <FormField
                            control={form.control}
                            name={`instructions.${index}.step`}
                            render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl><Textarea placeholder="Describe this step..." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeInstruction(index)} disabled={instructions.length <= 1}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                  ))}
                 </div>
                 <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => appendInstruction({ step: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Step
                </Button>
              </div>

              <Button type="submit" size="lg" className="w-full">Submit Recipe</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
