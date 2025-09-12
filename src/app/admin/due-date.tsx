
'use client';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Reusable component for displaying due dates and remaining days
export default function DueDate({ date, className }: { date: string, className?: string }) {
    const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  
    useEffect(() => {
      const calculateRemainingDays = () => {
        const dueDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day for accurate diff
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysRemaining(diffDays);
      }
      
      calculateRemainingDays();
  
    }, [date]);
  
    if (daysRemaining === null) {
      // Render a skeleton on the server and initial client render
      return <Skeleton className="h-4 w-24 mt-1" />;
    }
  
    return (
      <div className={`text-sm text-muted-foreground ${className}`}>
        Due: {date}
        {daysRemaining >= 0 ? (
            <span className={daysRemaining < 7 ? "text-destructive font-medium" : ""}> ({daysRemaining} days left)</span>
          ) : (
            <span className="text-destructive font-medium"> (Overdue)</span>
          )
        }
      </div>
    );
}
