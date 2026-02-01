import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseTime(timeString: string): number {
  const parts = timeString.split(' ');
  let totalMinutes = 0;
  for (let i = 0; i < parts.length; i += 2) {
    const value = parseInt(parts[i]);
    const unit = parts[i + 1];
    if (unit.startsWith('hr')) {
      totalMinutes += value * 60;
    } else if (unit.startsWith('min')) {
      totalMinutes += value;
    }
  }
  return totalMinutes;
}
