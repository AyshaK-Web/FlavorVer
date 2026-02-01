"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  suggestIngredientSubstitution,
  type SuggestIngredientSubstitutionOutput,
} from '@/ai/flows/smart-ingredient-substitution';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Sparkles, Loader2, Lightbulb } from 'lucide-react';

const formSchema = z.object({
  dietaryRestrictions: z.string().min(1, 'Please specify a dietary need (e.g., vegan, gluten-free).'),
  availableIngredients: z.string().optional(),
});

type SubstitutionModalProps = {
  ingredient: string;
  recipeName: string;
};

export function SubstitutionModal({ ingredient, recipeName }: SubstitutionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<SuggestIngredientSubstitutionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dietaryRestrictions: '',
      availableIngredients: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const res = await suggestIngredientSubstitution({
        ingredient,
        recipeName,
        dietaryRestrictions: values.dietaryRestrictions,
        availableIngredients: values.availableIngredients,
      });
      setResult(res);
    } catch (error) {
      console.error('Error fetching substitution:', error);
      // Here you could use a toast to show an error message
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state when closing
      form.reset();
      setResult(null);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Find substitution for ${ingredient}`}>
          <Sparkles className="h-4 w-4 text-accent" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Smart Substitution for {ingredient}
          </DialogTitle>
          <DialogDescription>
            Let AI help you find a replacement based on your needs.
          </DialogDescription>
        </DialogHeader>
        
        {!result && !isLoading && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="dietaryRestrictions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dietary Restriction or Preference</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., vegan, nut-free, low-carb" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableIngredients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Ingredients (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., oats, bananas, maple syrup..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  Find Substitution
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center h-48 space-y-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-muted-foreground">Finding the perfect match...</p>
          </div>
        )}

        {result && (
          <div className="pt-4 space-y-6">
            <div className="p-4 bg-secondary rounded-lg">
                <p className="font-semibold text-lg text-secondary-foreground">Suggested Substitution:</p>
                <p className="text-2xl font-bold text-primary">{result.substitution}</p>
            </div>
             <div className="p-4 border-l-4 border-accent bg-accent/20 rounded-r-lg">
                <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-accent-foreground flex-shrink-0 mt-1" />
                    <div>
                        <p className="font-semibold text-accent-foreground">Reasoning:</p>
                        <p className="text-sm text-muted-foreground">{result.reason}</p>
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button onClick={() => { form.reset(); setResult(null); }} className="w-full">
                    Try another search
                </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
