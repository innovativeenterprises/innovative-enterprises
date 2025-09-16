
'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { format, differenceInCalendarDays } from 'date-fns';

export const DueDateDisplay = ({
  date,
  className,
  prefix = "Due:",
}: {
  date?: string;
  className?: string;
  prefix?: string;
}) => {
  const [displayState, setDisplayState] = useState<{ isClient: boolean; formattedDate: string | null; daysRemaining: number | null }>({
    isClient: false,
    formattedDate: null,
    daysRemaining: null,
  });

  useEffect(() => {
    if (typeof date !== 'string' || !date) {
        setDisplayState({ isClient: true, formattedDate: `${prefix} Invalid Date`, daysRemaining: null });
        return;
    }
    
    try {
        const dueDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
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

  if (!displayState.isClient) {
    return <div className={`text-sm text-muted-foreground ${className}`}><Skeleton className="h-4 w-32 mt-1" /></div>;
  }
  
  return (
    <div className={`text-sm text-muted-foreground ${className}`}>
      {displayState.formattedDate}
      {displayState.daysRemaining !== null &&
        (displayState.daysRemaining >= 0 ? (
          <span className={displayState.daysRemaining < 7 ? 'text-destructive font-medium' : ''}>
            {' '}
            ({displayState.daysRemaining} days left)
          </span>
        ) : (
          <span className="text-destructive font-medium"> (Overdue)</span>
        ))}
    </div>
  );
};
