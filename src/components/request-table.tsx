'use client';

import { useState, useMemo, useEffect, forwardRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, ChevronDown, ChevronRight } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type GenericRequest = Record<string, any> & { id: string };

// Client-side component to prevent hydration errors with time formatting
export const TimeAgoCell = ({ date, isClient }: { date: string, isClient: boolean }) => {
    const [timeAgo, setTimeAgo] = useState<string | null>(null);

    useEffect(() => {
        if (isClient && date) {
            setTimeAgo(formatDistanceToNow(new Date(date), { addSuffix: true }));
        }
    }, [date, isClient]);

    if (!isClient) {
        return <Skeleton className="h-4 w-[100px]" />;
    }

    return <span>{timeAgo}</span>;
};


export const RequestTable = forwardRef<HTMLTableElement, {
    data: GenericRequest[], 
    columns: any[],
    isClient: boolean,
    renderActions?: (request: GenericRequest) => React.ReactNode,
    renderExpandedContent?: (request: GenericRequest) => React.ReactNode,
}>(({ 
    data,
    columns,
    isClient,
    renderActions,
    renderExpandedContent,
}, ref) => { 
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    const sortedData = useMemo(() => {
        let sortableItems = [...data];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [data, sortConfig]);

    const requestSort = (key: string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    
     const toggleRow = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };


    const SortableHeader = ({ label, sortKey }: { label: string, sortKey: string }) => (
         <TableHead onClick={() => requestSort(sortKey)} className="cursor-pointer">
            <div className="flex items-center gap-2">
                {label}
                {sortConfig && sortConfig.key === sortKey && <ArrowUpDown className="h-4 w-4" />}
            </div>
        </TableHead>
    );

    return (
        <Table ref={ref}>
            <TableHeader>
                <TableRow>
                    {renderExpandedContent && <TableHead className="w-10" />}
                    {columns.map(col => (
                        <SortableHeader key={col.accessor || col.Header} label={col.Header} sortKey={col.accessor} />
                    ))}
                    {renderActions && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                    {!isClient ? (
                        <TableRow>
                        <TableCell colSpan={columns.length + (renderActions ? 2: 1)} className="text-center h-24">
                            <Skeleton className="h-10 w-full" />
                        </TableCell>
                    </TableRow>
                    ) : data.length === 0 ? (
                        <TableRow>
                        <TableCell colSpan={columns.length + (renderActions ? 2 : 1)} className="text-center text-muted-foreground py-8">
                            No items found.
                        </TableCell>
                    </TableRow>
                ) : (
                    sortedData.map(req => (
                        <React.Fragment key={req.id}>
                        <TableRow onClick={() => renderExpandedContent && toggleRow(req.id)} className={cn(renderExpandedContent && 'cursor-pointer')}>
                            {renderExpandedContent && (
                                <TableCell>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                        {expandedRow === req.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                    </Button>
                                </TableCell>
                            )}
                            {columns.map(col => (
                            <TableCell key={col.accessor}>
                                {col.Cell ? col.Cell({ row: { original: req } }) : req[col.accessor as keyof GenericRequest]}
                            </TableCell>
                            ))}
                            {renderActions && (
                                <TableCell className="text-right">
                                    {renderActions(req)}
                                </TableCell>
                            )}
                        </TableRow>
                        <AnimatePresence>
                        {expandedRow === req.id && (
                             <TableRow>
                                <TableCell colSpan={columns.length + (renderActions ? 2 : 1)}>
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {renderExpandedContent && renderExpandedContent(req)}
                                    </motion.div>
                                </TableCell>
                            </TableRow>
                        )}
                        </AnimatePresence>
                        </React.Fragment>
                    ))
                )}
            </TableBody>
        </Table>
    );
});
RequestTable.displayName = "RequestTable";
