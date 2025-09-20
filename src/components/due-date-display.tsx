'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { format, differenceInCalendarDays } from 'date-fns';
import { cn } from '@/lib/utils';

export const DueDateDisplay = ({
  date,
  className,
  prefix = "Due:",
  warnDays = 7,
}: {
  date?: string;
  className?: string;
  prefix?: string;
  warnDays?: number;
}) => {
  const [displayState, setDisplayState] = useState<{
    isClient: boolean;
    formattedDate: string | null;
    daysRemaining: number | null;
    status: 'normal' | 'warn' | 'error';
  }>({
    isClient: false,
    formattedDate: null,
    daysRemaining: null,
    status: 'normal',
  });

  useEffect(() => {
    // This effect runs only on the client, after hydration, preventing mismatch
    if (!date) {
      setDisplayState({ isClient: true, formattedDate: `${prefix} N/A`, daysRemaining: null, status: 'normal' });
      return;
    }
    
    try {
        const dueDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (isNaN(dueDate.getTime())) {
            throw new Error("Invalid date");
        }
        
        const diffDays = differenceInCalendarDays(dueDate, today);
        const formatted = format(dueDate, "PPP");
        
        let status: 'normal' | 'warn' | 'error' = 'normal';
        if (diffDays < 0) {
            status = 'error';
        } else if (diffDays <= warnDays) {
            status = 'warn';
        }

        setDisplayState({
            isClient: true,
            formattedDate: `${prefix} ${formatted}`,
            daysRemaining: diffDays,
            status,
        });

    } catch (e) {
       setDisplayState({ isClient: true, formattedDate: `${prefix} Invalid Date`, daysRemaining: null, status: 'error' });
    }
  }, [date, prefix, warnDays]);

  // On the server and during initial client render, show a skeleton loader.
  if (!displayState.isClient) {
    return <div className={cn("text-sm text-muted-foreground", className)}><Skeleton className="h-4 w-32 mt-1" /></div>;
  }
  
  // After hydration on the client, render the actual formatted date.
  return (
    <div className={cn("text-sm text-muted-foreground", className)}>
      {displayState.formattedDate}
      {displayState.daysRemaining !== null &&
        (displayState.daysRemaining >= 0 ? (
          <span className={cn('font-medium', {
              'text-yellow-600 dark:text-yellow-400': displayState.status === 'warn',
              'text-destructive': displayState.status === 'error' && displayState.daysRemaining < 0,
          })}>
            {' '}
            ({displayState.daysRemaining} days left)
          </span>
        ) : (
          <span className="text-destructive font-medium"> (Overdue)</span>
        ))}
    </div>
  );
};
