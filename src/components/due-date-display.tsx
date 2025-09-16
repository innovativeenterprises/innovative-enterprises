
'use client';

import { useState, useEffect, useMemo } from 'react';
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the initial mount.
    setIsClient(true);
  }, []);

  const { formattedDate, daysRemaining } = useMemo(() => {
    // Perform calculations only on the client side
    if (!date || !isClient) return { formattedDate: null, daysRemaining: null };
    
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

    return { formattedDate: `${prefix} ${formatted}`, daysRemaining: diffDays };
  }, [date, prefix, isClient]);

  if (!isClient) {
    // Render a skeleton on the server and during initial client hydration
    return <div className={`text-sm text-muted-foreground ${className}`}><Skeleton className="h-4 w-40 mt-1" /></div>;
  }
  
  // This will only render on the client after hydration is complete
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

    