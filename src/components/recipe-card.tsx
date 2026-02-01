
"use client";

import type { Recipe } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFavorites } from '@/hooks/use-favorites';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from './ui/skeleton';

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { isFavorite, toggleFavorite, isInitialized } = useFavorites();
  const favorite = isFavorite(recipe.id);
  const placeholderImage = PlaceHolderImages.find((img) => img.id === recipe.imageId);
  const imageUrl = placeholderImage?.imageUrl || 'https://picsum.photos/seed/placeholder/600/400';
  const imageHint = placeholderImage?.imageHint || 'food';

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toggleFavorite(recipe.id);
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col h-full group">
        <div className="relative">
          <Link href={`/recipes/${recipe.slug}`} aria-label={recipe.title}>
            <Image
              src={imageUrl}
              alt={recipe.title}
              width={600}
              height={400}
              className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={imageHint}
            />
          </Link>
          {isInitialized ? (
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-3 right-3 rounded-full bg-background/70 hover:bg-background h-9 w-9"
            onClick={handleFavoriteClick}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={cn('h-5 w-5 transition-colors', favorite ? 'text-red-500' : 'text-foreground')}
              fill={favorite ? 'currentColor' : 'none'}
            />
          </Button>
          ) : (
            <Skeleton className="absolute top-3 right-3 h-9 w-9 rounded-full" />
          )}
        </div>
        <CardHeader>
          <CardTitle className="font-headline text-xl leading-tight">
            <Link href={`/recipes/${recipe.slug}`} className="hover:text-primary transition-colors">
              {recipe.title}
            </Link>
          </CardTitle>
          <CardDescription>{recipe.cuisine}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-end">
          <div className="flex flex-wrap gap-2 mt-auto">
            {recipe.dietaryTags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="capitalize">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
