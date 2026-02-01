
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Award, Soup, Cake, Salad, Flame, ChefHat } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

const badges = [
  {
    icon: Flame,
    title: "Spice Master",
    description: "Cooked 5 spicy recipes.",
    achieved: true,
  },
  {
    icon: ChefHat,
    title: "Weekend Chef",
    description: "Cooked a recipe every weekend for a month.",
    achieved: true,
  },
  {
    icon: Cake,
    title: "Dessert Dynamo",
    description: "Mastered 3 different cake recipes.",
    achieved: true,
  },
  {
    icon: Salad,
    title: "Salad Superstar",
    description: "Tried 5 different salad recipes.",
    achieved: false,
  },
  {
    icon: Soup,
    title: "Soup Sensei",
    description: "Prepared 5 unique soup recipes.",
    achieved: false,
  },
  {
    icon: Award,
    title: "Cuisine Explorer",
    description: "Cooked recipes from 5 different cuisines.",
    achieved: false,
  },
];

export default function BadgesPage() {

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
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto px-4 py-8 md:px-6 md:py-12"
    >
      <motion.div variants={itemVariants} className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-headline font-bold" style={{ fontFamily: 'Alegreya, serif' }}>
          Your Badge Collection
        </h1>
        <p className="text-lg text-muted-foreground mt-2">Celebrate your culinary achievements!</p>
      </motion.div>

      <motion.div variants={containerVariants} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
        {badges.map((badge, index) => (
          <motion.div key={index} variants={itemVariants}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className={`text-center transition-all duration-300 ${!badge.achieved ? 'opacity-40 grayscale' : 'hover:shadow-lg hover:-translate-y-1'}`}>
                    <CardContent className="p-6 flex flex-col items-center justify-center">
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-colors ${badge.achieved ? 'bg-primary/10' : 'bg-muted'}`}>
                        <badge.icon className={`w-12 h-12 transition-colors ${badge.achieved ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <h3 className="font-semibold text-sm">{badge.title}</h3>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{badge.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
