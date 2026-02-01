
'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { recipes } from '@/lib/recipes';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ListChecks, Printer, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRecentLists } from '@/hooks/use-recent-lists';

export default function ShoppingListPage({ params }: { params: { slug: string } }) {
  const recipe = recipes.find((p) => p.slug === params.slug);
  const { toast } = useToast();
  const { addRecentList } = useRecentLists();
  
  useEffect(() => {
    if (recipe) {
      addRecentList(recipe);
    }
  }, [recipe, addRecentList]);

  if (!recipe) {
    notFound();
  }

  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const handleCheckChange = (ingredientName: string) => {
    setCheckedItems(prev =>
      prev.includes(ingredientName)
        ? prev.filter(item => item !== ingredientName)
        : [...prev, ingredientName]
    );
  };
  
  const handleShare = () => {
    const listText = recipe.ingredients
        .map(ing => `- ${ing.name} (${ing.quantity})`)
        .join('\n');
    const shareData = {
        title: `Shopping List for ${recipe.title}`,
        text: `Here's the shopping list for ${recipe.title}:\n\n${listText}`,
        url: window.location.href,
    };
    try {
        if (navigator.share) {
            navigator.share(shareData);
        } else {
           navigator.clipboard.writeText(shareData.text);
           toast({ title: 'Copied to clipboard!', description: 'Shopping list copied.' });
        }
    } catch (err) {
        console.error('Share failed:', err);
        navigator.clipboard.writeText(shareData.text);
        toast({ title: 'Copied to clipboard!', description: 'Could not open share dialog.' });
    }
  }

  const handlePrint = () => {
      window.print();
  }

  return (
    <div className="container mx-auto max-w-2xl py-8 md:py-12">
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-2xl font-headline">
                            <ListChecks className="h-6 w-6 text-primary"/>
                            Shopping List
                        </CardTitle>
                        <CardDescription>For your recipe: {recipe.title}</CardDescription>
                    </div>
                     <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={handleShare}>
                            <Share2 className="h-4 w-4" />
                            <span className="sr-only">Share</span>
                        </Button>
                        <Button variant="outline" size="icon" onClick={handlePrint}>
                            <Printer className="h-4 w-4" />
                            <span className="sr-only">Print</span>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recipe.ingredients.map((ingredient) => {
                        const isChecked = checkedItems.includes(ingredient.name);
                        return (
                            <div key={ingredient.name} className="flex items-center space-x-3 bg-card p-3 rounded-md border transition-all">
                                <Checkbox
                                    id={ingredient.name}
                                    checked={isChecked}
                                    onCheckedChange={() => handleCheckChange(ingredient.name)}
                                />
                                <label
                                    htmlFor={ingredient.name}
                                    className={`flex-1 text-sm font-medium leading-none cursor-pointer ${isChecked ? 'line-through text-muted-foreground' : ''}`}
                                >
                                    <span className="font-semibold">{ingredient.name}</span>
                                    <span className="text-muted-foreground ml-2">({ingredient.quantity})</span>
                                </label>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
