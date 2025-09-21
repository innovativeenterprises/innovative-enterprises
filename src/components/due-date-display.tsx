
'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { format, differenceInCalendarDays } from 'date-fns';
import { cn } from '@/lib/utils';

export const DueDateDisplay = ({
  date,
  className,
  prefix = "Due:",
}: {
  date?: string | Date;
  className?: string;
  prefix?: string;
}) => {
  const [displayState, setDisplayState] = useState<{
    isClient: boolean;
    formattedDate: string | null;
    daysRemaining: number | null;
  }>({
    isClient: false,
    formattedDate: null,
    daysRemaining: null,
  });

  useEffect(() => {
    // This effect runs only on the client, after hydration, preventing mismatch
    if (!date) {
      setDisplayState({ isClient: true, formattedDate: `${prefix} N/A`, daysRemaining: null });
      return;
    }
    
    try {
        const dueDate = typeof date === 'string' ? new Date(date) : date;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (isNaN(dueDate.getTime())) {
            throw new Error("Invalid date");
        }
        
        const diffDays = differenceInCalendarDays(dueDate, today);
        const formatted = format(dueDate, "PPP");
        
        setDisplayState({
            isClient: true,
            formattedDate: `${prefix} ${formatted}`,
            daysRemaining: diffDays,
        });

    } catch (e) {
       setDisplayState({ isClient: true, formattedDate: `${prefix} Invalid Date`, daysRemaining: null });
    }
  }, [date, prefix]);

  // On the server and during initial client render, show a skeleton loader.
  if (!isClient) {
    return <div className={cn("text-sm text-muted-foreground", className)}><Skeleton className="h-4 w-32 mt-1" /></div>;
  }
  
  // After hydration on the client, render the actual formatted date.
  return (
    <div className={cn("text-sm text-muted-foreground", className)}>
      {displayState.formattedDate}
      {displayState.daysRemaining !== null &&
        (displayState.daysRemaining >= 0 ? (
          <span className={cn('font-medium', displayState.daysRemaining < 7 && 'text-destructive')}>
            {' '}
            ({displayState.daysRemaining} days left)
          </span>
        ) : (
          <span className="text-destructive font-medium"> (Overdue)</span>
        ))}
    </div>
  );
};
