
'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export const DueDateDisplay = ({
  date,
  className,
  prefix = "Due:",
}: {
  date: string;
  className?: string;
  prefix?: string;
}) => {
  const [displayState, setDisplayState] = useState<{ isClient: boolean; daysRemaining: number | null, formattedDate: string | null }>({ isClient: false, daysRemaining: null, formattedDate: null });

  useEffect(() => {
    // This code now runs only on the client, after the initial render.
    const dueDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to the start of the day
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    
    const formatted = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dueDate);

    setDisplayState({ isClient: true, daysRemaining: diffDays, formattedDate: `${prefix} ${formatted}` });
  }, [date, prefix]);

  if (!displayState.isClient) {
    // Return a skeleton, but ensure it doesn't cause a hydration mismatch
    // by only rendering it on the client during the initial mount.
    return displayState.isClient ? null : <Skeleton className="h-4 w-48 mt-1" />;
  }

  const { daysRemaining, formattedDate } = displayState;

  return (
    <div className={`text-sm text-muted-foreground ${className}`}>
      {formattedDate}
      {daysRemaining !== null &&
        (daysRemaining >= 0 ? (
          <span className={daysRemaining < 7 ? 'text-destructive font-medium' : ''}>
            {' '}
            ({daysRemaining} days left)
          </span>
        ) : (
          <span className="text-destructive font-medium"> (Overdue)</span>
        ))}
    </div>
  );
};
