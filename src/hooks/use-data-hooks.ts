'use client';

import { useState, useMemo, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from 'date-fns';

type GenericRequest = Record<string, any>;

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


export function RequestTable({ 
    data,
    columns,
    isClient,
    renderActions,
}: { 
    data: GenericRequest[], 
    columns: any[],
    isClient: boolean,
    renderActions?: (request: GenericRequest) => React.ReactNode,
}) { 
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);

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

    const SortableHeader = ({ label, sortKey }: { label: string, sortKey: string }) => (
         <TableHead onClick={() => requestSort(sortKey)} className="cursor-pointer">
            <div className="flex items-center gap-2">
                {label}
                {sortConfig && sortConfig.key === sortKey && <ArrowUpDown className="h-4 w-4" />}
            </div>
        </TableHead>
    );

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map(col => (
                        <SortableHeader key={col.accessor || col.Header} label={col.Header} sortKey={col.accessor} />
                    ))}
                    {renderActions && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                    {!isClient ? (
                        <TableRow>
                        <TableCell colSpan={columns.length + (renderActions ? 1: 0)} className="text-center h-24">
                            <Skeleton className="h-10 w-full" />
                        </TableCell>
                    </TableRow>
                    ) : data.length === 0 ? (
                        <TableRow>
                        <TableCell colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center text-muted-foreground py-8">
                            No items found.
                        </TableCell>
                    </TableRow>
                ) : (
                    sortedData.map(req => (
                        <TableRow key={req.id}>
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
                    ))
                )}
            </TableBody>
        </Table>
    );
}