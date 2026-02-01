
'use client';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { recipes } from '@/lib/recipes';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Clock, UtensilsCrossed, Zap, Info, Leaf, Vegan, WheatOff, Sparkles, BarChart3, ListChecks, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SubstitutionModal } from '@/components/substitution-modal';
import { Button } from '@/components/ui/button';
import { RecipeRating } from '@/components/recipe-rating';
import { MealPlanModal } from '@/components/meal-plan-modal';

export default function RecipePage({ params }: { params: { slug: string } }) {
  const recipe = recipes.find((p) => p.slug === params.slug);

  if (!recipe) {
    notFound();
  }

  const placeholderImage = PlaceHolderImages.find((img) => img.id === recipe.imageId);
  const imageUrl = placeholderImage?.imageUrl || 'https://picsum.photos/seed/placeholder/1200/800';
  const imageHint = placeholderImage?.imageHint || 'food';

  const tagIcons: { [key: string]: React.ElementType } = {
    vegetarian: Leaf,
    vegan: Vegan,
    'gluten-free': WheatOff,
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    },
  };

  return (
    <motion.div 
      className="container mx-auto max-w-5xl py-8 md:py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <article>
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight mb-3" style={{ fontFamily: 'Alegreya, serif' }}>
            {recipe.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{recipe.description}</p>
          <div className="mt-4">
            <RecipeRating rating={recipe.rating} />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg mb-8">
          <Image
            src={imageUrl}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
            data-ai-hint={imageHint}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
            <div className="bg-card p-4 rounded-lg shadow-sm">
                <Clock className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="font-semibold">Total Time</p>
                <p className="text-muted-foreground text-sm">{recipe.totalTime}</p>
            </div>
             <div className="bg-card p-4 rounded-lg shadow-sm">
                <BarChart3 className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="font-semibold">Difficulty</p>
                <p className="text-muted-foreground text-sm">{recipe.difficulty}</p>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm">
                <UtensilsCrossed className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="font-semibold">Servings</p>
                <p className="text-muted-foreground text-sm">{recipe.servings}</p>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm">
                <Info className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="font-semibold">Cuisine</p>
                <p className="text-muted-foreground text-sm">{recipe.cuisine}</p>
            </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-center flex-wrap gap-2 mb-10">
            {recipe.dietaryTags.map(tag => {
                const Icon = tagIcons[tag];
                return (
                    <Badge key={tag} variant="secondary" className="text-sm capitalize py-1 px-3">
                        {Icon && <Icon className="mr-2 h-4 w-4" />}
                        {tag}
                    </Badge>
                );
            })}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <motion.div variants={itemVariants} className="md:col-span-1">
                <div className="flex items-center justify-between mb-4 border-b-2 border-primary pb-2">
                    <h2 className="text-2xl font-bold font-headline">Ingredients</h2>
                </div>
                <div className="flex gap-2 mb-4">
                  <Button asChild variant="default" className="flex-1">
                    <Link href={`/shopping-list/${recipe.slug}`}>
                      <ListChecks className="mr-2 h-4 w-4" />
                      Shopping List
                    </Link>
                  </Button>
                  <MealPlanModal recipeId={recipe.id} recipeTitle={recipe.title} />
                </div>
                <ul className="space-y-3">
                    {recipe.ingredients.map((ingredient, index) => (
                        <motion.li 
                            key={ingredient.name} 
                            className="flex justify-between items-center group"
                            custom={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                        >
                            <div>
                                <span className="font-semibold">{ingredient.name}</span>
                                <span className="text-muted-foreground ml-2">{ingredient.quantity}</span>
                            </div>
                            <SubstitutionModal ingredient={ingredient.name} recipeName={recipe.title} />
                        </motion.li>
                    ))}
                </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="md:col-span-2">
                <h2 className="text-2xl font-bold font-headline mb-4 border-b-2 border-primary pb-2">Instructions</h2>
                <ol className="space-y-6">
                    {recipe.instructions.map((step, index) => (
                         <motion.li 
                            key={index} 
                            className="flex gap-4"
                            custom={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                        >
                            <div className="flex-shrink-0 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">{index + 1}</div>
                            <p className="flex-1 mt-1">{step}</p>
                        </motion.li>
                    ))}
                </ol>
            </motion.div>
        </div>
        
        <Separator className="my-12" />

        <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold font-headline mb-4 text-center">Nutritional Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-card p-4 rounded-lg shadow-sm">
                    <p className="font-semibold text-primary">Calories</p>
                    <p className="text-lg font-bold">{recipe.nutrition.calories}</p>
                </div>
                <div className="bg-card p-4 rounded-lg shadow-sm">
                    <p className="font-semibold text-primary">Protein</p>
                    <p className="text-lg font-bold">{recipe.nutrition.protein}</p>
                </div>
                <div className="bg-card p-4 rounded-lg shadow-sm">
                    <p className="font-semibold text-primary">Carbs</p>
                    <p className="text-lg font-bold">{recipe.nutrition.carbs}</p>
                </div>
                <div className="bg-card p-4 rounded-lg shadow-sm">
                    <p className="font-semibold text-primary">Fat</p>
                    <p className="text-lg font-bold">{recipe.nutrition.fat}</p>
                </div>
            </div>
        </motion.div>
      </article>
    </motion.div>
  );
}
