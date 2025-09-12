
'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { ProjectStage } from "@/lib/stages";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjectStagesData } from "@/hooks/use-global-store-data";

const StageSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description is required"),
});
type StageValues = z.infer<typeof StageSchema>;


const AddEditStageDialog = ({ 
    stage, 
    onSave,
    children
}: { 
    stage?: ProjectStage, 
    onSave: (values: StageValues, id?: string) => void,
    children: React.ReactNode 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<StageValues>({
        resolver: zodResolver(StageSchema),
        defaultValues: stage || { name: "", description: "" },
    });

    useEffect(() => {
        if(isOpen) {
            form.reset(stage || { name: "", description: "" });
        }
    }, [stage, form, isOpen]);

    const onSubmit: SubmitHandler<StageValues> = (data) => {
        onSave(data, stage?.id);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{stage ? "Edit" : "Add"} Project Stage</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Stage Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Save Stage</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};


export default function StageTable() {
    const { stages, setStages } = useProjectStagesData();
    const { toast } = useToast();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleSave = (values: StageValues, id?: string) => {
        if (id) {
            setStages(prev => prev.map(s => s.id === id ? { ...s, ...values } : s));
            toast({ title: "Stage updated successfully." });
        } else {
            const newStage: ProjectStage = { ...values, id: `stage_${values.name.toLowerCase().replace(/\s+/g, '_')}` };
            setStages(prev => [...prev, newStage]);
            toast({ title: "Stage added successfully." });
        }
    };

    const handleDelete = (id: string) => {
        setStages(prev => prev.filter(s => s.id !== id));
        toast({ title: "Stage removed.", variant: "destructive" });
    };
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Project Stage Management</CardTitle>
                    <CardDescription>Manage the project lifecycle stages for your products.</CardDescription>
                </div>
                <AddEditStageDialog onSave={handleSave}>
                    <Button><PlusCircle /> Add Stage</Button>
                </AddEditStageDialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Stage Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isClient ? (
                             Array.from({length: 5}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={3}><Skeleton className="h-10 w-full" /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            stages.map(stage => (
                                <TableRow key={stage.id}>
                                    <TableCell className="font-medium">{stage.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{stage.description}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <AddEditStageDialog stage={stage} onSave={handleSave}>
                                                <Button variant="ghost" size="icon"><Edit /></Button>
                                            </AddEditStageDialog>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon"><Trash2 className="text-destructive" /></Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the "{stage.name}" stage.</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(stage.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
