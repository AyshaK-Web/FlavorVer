
"use client";

import { useState } from 'react';
import { useMealPlan } from '@/hooks/use-meal-plan';
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
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, CheckCircle, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

type MealPlanModalProps = {
  recipeId: string;
  recipeTitle: string;
};

export function MealPlanModal({ recipeId, recipeTitle }: MealPlanModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { addMeal } = useMealPlan();
  const { toast } = useToast();

  const handlePlanMeal = () => {
    if (date) {
      addMeal(recipeId, date);
      toast({
        title: 'Meal Planned!',
        description: `${recipeTitle} has been added to your plan for ${format(date, 'PPP')}.`,
      });
      setIsOpen(false);
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setDate(new Date());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Plan this Meal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Plan "{recipeTitle}"</DialogTitle>
          <DialogDescription>
            Select a date to add this recipe to your meal plan.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                className="rounded-md border"
            />
        </div>
        <DialogFooter>
          <Button onClick={handlePlanMeal} disabled={!date} className="w-full">
            <CheckCircle className="mr-2 h-4 w-4" />
            Confirm Plan for {date ? format(date, 'PPP') : '...'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
