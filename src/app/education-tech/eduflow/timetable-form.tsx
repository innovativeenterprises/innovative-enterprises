
'use client';

import { useState } from 'react';
import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, AlertTriangle, PlusCircle, Trash2 } from 'lucide-react';
import { TimetableGeneratorInputSchema, type TimetableGeneratorInput, type TimetableGeneratorOutput, type Subject, type Classroom } from '@/ai/flows/timetable-generator.schema';
import { generateTimetable } from '@/ai/flows/timetable-generator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const timeSlots = ["08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

export default function TimetableForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<TimetableGeneratorOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<TimetableGeneratorInput>({
    resolver: zodResolver(TimetableGeneratorInputSchema),
    defaultValues: {
      subjects: [
        { id: 'math1', name: 'Mathematics', teacher: 'Mr. Ahmed', requiredSlots: 5 },
        { id: 'sci1', name: 'Science', teacher: 'Ms. Fatima', requiredSlots: 4 },
        { id: 'eng1', name: 'English', teacher: 'Mr. David', requiredSlots: 5 },
        { id: 'art1', name: 'Art', teacher: 'Ms. Chloe', requiredSlots: 2 },
      ],
      classrooms: [
        { id: 'c101', name: 'Classroom 101' },
        { id: 'c102', name: 'Classroom 102' },
        { id: 'art_room', name: 'Art Room' },
      ],
      timeSlots: timeSlots,
      days: days,
    },
  });

  const { fields: subjectFields, append: appendSubject, remove: removeSubject } = useFieldArray({
    control: form.control,
    name: "subjects"
  });

  const { fields: classroomFields, append: appendClassroom, remove: removeClassroom } = useFieldArray({
    control: form.control,
    name: "classrooms"
  });

  const onSubmit: SubmitHandler<TimetableGeneratorInput> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await generateTimetable(data);
      setResponse(result);
      if (result.diagnostics.isPossible) {
          toast({ title: 'Timetable Generated!', description: 'Your optimized schedule is ready.' });
      } else {
          toast({ title: 'Scheduling Failed', description: result.diagnostics.message, variant: 'destructive', duration: 10000 });
      }
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to generate timetable. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const scheduleGrid: Record<string, Record<string, (typeof response.schedule)[0]>> | undefined = response?.schedule.reduce((acc, entry) => {
    if (!acc[entry.timeSlot]) {
      acc[entry.timeSlot] = {};
    }
    acc[entry.timeSlot][entry.day] = entry;
    return acc;
  }, {} as Record<string, Record<string, any>>);


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Define Your School's Constraints</CardTitle>
          <CardDescription>Define your subjects, teachers, and classrooms. Our AI will generate an optimized, conflict-free schedule.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Subjects */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Subjects & Teachers</h3>
                        {subjectFields.map((field, index) => (
                             <Card key={field.id} className="p-4 bg-muted/50 relative">
                                <div className="grid grid-cols-2 gap-4">
                                     <FormField control={form.control} name={`subjects.${index}.name`} render={({ field }) => (<FormItem><FormLabel>Subject</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                                     <FormField control={form.control} name={`subjects.${index}.teacher`} render={({ field }) => (<FormItem><FormLabel>Teacher</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                                </div>
                                <FormField control={form.control} name={`subjects.${index}.requiredSlots`} render={({ field }) => (<FormItem className="mt-4"><FormLabel>Weekly Slots</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>)} />
                                <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeSubject(index)}><Trash2 className="h-4 w-4" /></Button>
                            </Card>
                        ))}
                         <Button type="button" variant="outline" size="sm" onClick={() => appendSubject({ id: `sub_${Date.now()}`, name: '', teacher: '', requiredSlots: 4 })}><PlusCircle className="mr-2 h-4 w-4"/> Add Subject</Button>
                    </div>
                     {/* Classrooms */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Classrooms</h3>
                        {classroomFields.map((field, index) => (
                             <Card key={field.id} className="p-4 bg-muted/50 relative">
                                <FormField control={form.control} name={`classrooms.${index}.name`} render={({ field }) => (<FormItem><FormLabel>Classroom Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                                <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeClassroom(index)}><Trash2 className="h-4 w-4" /></Button>
                            </Card>
                        ))}
                         <Button type="button" variant="outline" size="sm" onClick={() => appendClassroom({ id: `class_${Date.now()}`, name: '' })}><PlusCircle className="mr-2 h-4 w-4"/> Add Classroom</Button>
                    </div>
                </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Schedule...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Generate Timetable</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {response?.diagnostics && !response.diagnostics.isPossible && (
         <Alert variant="destructive" className="mt-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Scheduling Impossible</AlertTitle>
            <AlertDescription>{response.diagnostics.message}</AlertDescription>
        </Alert>
      )}

      {response?.diagnostics && response.diagnostics.isPossible && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Generated Weekly Timetable</CardTitle>
            <CardDescription>{response.diagnostics.message}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
                 <Table className="border">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="border-r">Time</TableHead>
                            {days.map(day => <TableHead key={day} className="text-center border-r">{day}</TableHead>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                       {timeSlots.map(slot => (
                           <TableRow key={slot}>
                             <TableCell className="font-medium border-r">{slot}</TableCell>
                             {days.map(day => {
                                const entry = scheduleGrid?.[slot]?.[day];
                                const subject = entry ? form.getValues('subjects').find(s => s.id === entry.subjectId) : null;
                                const classroom = entry ? form.getValues('classrooms').find(c => c.id === entry.classroomId) : null;
                                return (
                                    <TableCell key={day} className="border-r p-2 text-center">
                                        {entry && subject && classroom ? (
                                            <div className="bg-primary/10 p-2 rounded-md text-xs">
                                                <p className="font-bold text-primary">{subject.name}</p>
                                                <p className="text-muted-foreground">{subject.teacher}</p>
                                                <p className="text-muted-foreground italic">({classroom.name})</p>
                                            </div>
                                        ) : null}
                                    </TableCell>
                                )
                             })}
                           </TableRow>
                       ))}
                    </TableBody>
                </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
