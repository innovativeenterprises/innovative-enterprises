
'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';

export const DueDateDisplay = ({
  date,
  className,
  prefix = "Due:",
}: {
  date: string;
  className?: string;
  prefix?: string;
}) => {
  const [displayState, setDisplayState] = useState<{ isClient: boolean; formattedDate: string | null; daysRemaining: number | null }>({
    isClient: false,
    formattedDate: null,
    daysRemaining: null,
  });

  useEffect(() => {
    // This effect runs only on the client, after the initial mount, preventing hydration mismatch.
    if (!date) {
        setDisplayState({ isClient: true, formattedDate: `${prefix} Invalid Date`, daysRemaining: null });
        return;
    }
    
    try {
        const dueDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
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
    // Render a skeleton on the server and during initial client hydration
    return <div className={`text-sm text-muted-foreground ${className}`}><Skeleton className="h-4 w-32 mt-1" /></div>;
  }
  
  // This will only render on the client after hydration is complete
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
