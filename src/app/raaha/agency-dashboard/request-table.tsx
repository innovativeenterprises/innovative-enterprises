
'use client';

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { HireRequest } from "@/lib/raaha-requests";
import type { BookingRequest } from "@/lib/stairspace-requests";
import { format } from 'date-fns';
import { CalendarIcon, ArrowUpDown } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { ScheduleInterviewDialog, type InterviewValues } from "@/components/schedule-interview-dialog";

type GenericRequest = HireRequest | BookingRequest;

export function RequestTable({ 
    data,
    columns,
    isClient,
    onSchedule,
    sortConfig,
    requestSort,
}: { 
    data: GenericRequest[], 
    columns: any[],
    isClient: boolean,
    onSchedule: (id: string, values: InterviewValues) => void,
    sortConfig: { key: string; direction: string; },
    requestSort?: (key: string) => void,
}) { 

    const SortableHeader = ({ label, sortKey }: { label: string, sortKey: string }) => (
         <TableHead onClick={() => requestSort && requestSort(sortKey)} className="cursor-pointer">
            <div className="flex items-center gap-2">
                {label}
                {sortConfig.key === sortKey && <ArrowUpDown className="h-4 w-4" />}
            </div>
        </TableHead>
    );

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map(col => (
                        col.sortable && requestSort ? 
                        <SortableHeader key={col.accessor || col.Header} label={col.Header} sortKey={col.accessor} /> :
                        <TableHead key={col.Header}>{col.Header}</TableHead>
                    ))}
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                    {!isClient ? (
                        <TableRow>
                        <TableCell colSpan={columns.length + 1} className="text-center h-24">
                            <Skeleton className="h-10 w-full" />
                        </TableCell>
                    </TableRow>
                    ) : data.length === 0 ? (
                        <TableRow>
                        <TableCell colSpan={columns.length + 1} className="text-center text-muted-foreground py-8">
                            No requests found.
                        </TableCell>
                    </TableRow>
                ) : (
                    data.map(req => (
                        <TableRow key={req.id}>
                            {columns.map(col => (
                            <TableCell key={col.accessor}>
                                {col.Cell ? col.Cell({ row: { original: req } }) : req[col.accessor as keyof GenericRequest]}
                            </TableCell>
                            ))}
                            <TableCell className="text-right">
                                    <ScheduleInterviewDialog request={req} onSchedule={onSchedule} />
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
