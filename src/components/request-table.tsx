
'use client';

import { useState, useMemo, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from 'date-fns';

type GenericRequest = Record<string, any>;

// Client-side component to prevent hydration errors with time formatting
export const TimeAgoCell = ({ date, isClient }: { date: string, isClient: boolean }) => {
    const timeAgo = useMemo(() => {
        if (!isClient || !date) return null;
        return formatDistanceToNow(new Date(date), { addSuffix: true });
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
    onSchedule, // Added to props
}: { 
    data: GenericRequest[], 
    columns: any[],
    isClient: boolean,
    renderActions?: (request: GenericRequest) => React.ReactNode,
    onSchedule?: (id: string, values: any) => void, // Added to props
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
                        col.sortable ? 
                        <SortableHeader key={col.accessor || col.Header} label={col.Header} sortKey={col.accessor} /> :
                        <TableHead key={col.Header}>{col.Header}</TableHead>
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

// Re-usable WorkerTable component using the generic RequestTable
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AddEditWorkerDialog } from '@/app/raaha/agency-dashboard/worker-table';
import { useToast } from "@/hooks/use-toast";
import { setRaahaWorkers } from '@/hooks/use-global-store-data';
import type { Worker } from '@/lib/raaha-workers';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function WorkerTable({ workers, columns, agencyId, isClient }: { workers: Worker[], columns: any[], agencyId: string, isClient: boolean }) { 
    const { toast } = useToast();

    const handleSave = (values: any, id?: string) => {
        const skillsArray = values.skills.map((s: { value: any; }) => s.value).filter((s: string) => s.trim() !== '');
        
        if (id) {
            setRaahaWorkers(prev => prev.map(w => w.id === id ? { ...w, ...values, skills: skillsArray } : w));
            toast({ title: "Candidate updated." });
        } else {
            const newWorker: Worker = { ...values, id: `worker_${values.name.toLowerCase().replace(/\s+/g, '_')}`, skills: skillsArray, agencyId: agencyId };
            setRaahaWorkers(prev => [newWorker, ...prev]);
            toast({ title: "Candidate added." });
        }
    };
    
    const handleDelete = (id: string) => {
        setRaahaWorkers(prev => prev.filter(w => w.id !== id));
        toast({ title: "Candidate removed.", variant: "destructive" });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Agency Candidate Management</CardTitle>
                    <CardDescription>Manage the domestic worker candidates in your agency's database.</CardDescription>
                </div>
                <AddEditWorkerDialog onSave={handleSave} agencyId={agencyId}>
                    <Button><PlusCircle /> Add Candidate</Button>
                </AddEditWorkerDialog>
            </CardHeader>
            <CardContent>
                <RequestTable 
                    data={workers}
                    columns={columns}
                    isClient={isClient}
                    renderActions={(worker) => (
                         <div className="flex justify-end gap-2">
                            <AddEditWorkerDialog worker={worker as Worker} onSave={handleSave} agencyId={agencyId}>
                                <Button variant="ghost" size="icon"><Edit /></Button>
                            </AddEditWorkerDialog>
                            <AlertDialog>
                                <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button></AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Delete Candidate?</AlertDialogTitle><AlertDialogDescription>This will permanently remove {worker.name} from your database.</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(worker.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                />
            </CardContent>
        </Card>
    );
}
