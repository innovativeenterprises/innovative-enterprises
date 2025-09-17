
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShieldCheck, Heart, PenSquare, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { type Student } from '@/lib/students';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ChatComponent } from '@/components/chat/chat-component';
import { wellbeingCheckin } from '@/ai/flows/guardian-ai/wellbeing-checkin';
import { useSettingsData } from '@/hooks/use-global-store-data';
import { ScholarshipEssayAssistant } from './scholarship-essay-assistant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';

const WellbeingChat = ({ studentName }: { studentName: string }) => {
    const { settings } = useSettingsData();

    const checkinFlow = async (input: { [key: string]: any }) => {
        return await wellbeingCheckin({ studentQuery: input.message });
    };

    return (
        <DialogContent className="w-[450px] h-[80vh] p-0 border-0">
             <ChatComponent
                agentName="Guardian AI"
                agentIcon={Heart}
                agentDescription={`Wellbeing Check-in for ${studentName}`}
                welcomeMessage={`Hi ${studentName}, this is a safe space to talk. How are you feeling today?`}
                placeholder="You can talk about anything..."
                aiFlow={checkinFlow}
                settings={settings}
            />
        </DialogContent>
    )
}

const StudentDashboard = ({ students }: { students: Student[] }) => {
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
    }, []);

    const getStatusBadge = (status: Student['status']) => {
        switch (status) {
            case 'On Track': return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">On Track</Badge>;
            case 'Needs Attention': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Needs Attention</Badge>;
            case 'At Risk': return <Badge variant="destructive">At Risk</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };
    
    return (
         <Card>
            <CardHeader>
                <CardTitle>Student Success Overview</CardTitle>
                <CardDescription>Monitor student status and provide timely support and guidance.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Major</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isClient ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell colSpan={4}>
                                        <Skeleton className="h-10 w-full" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            students.map(student => (
                            <TableRow key={student.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar><AvatarImage src={student.photo} alt={student.name} /><AvatarFallback>{student.name.charAt(0)}</AvatarFallback></Avatar>
                                        <div>
                                            <p className="font-medium">{student.name}</p>
                                            <p className="text-sm text-muted-foreground">ID: {student.id}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{student.major}</TableCell>
                                <TableCell>{getStatusBadge(student.status)}</TableCell>
                                <TableCell className="text-right">
                                    <Dialog>
                                        <div className="flex justify-end gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild><Button variant="outline" size="sm"><PenSquare className="mr-2 h-4 w-4"/>Essay</Button></DialogTrigger>
                                                <ScholarshipEssayAssistant student={student} />
                                            </Dialog>
                                            <DialogTrigger asChild><Button variant="secondary" size="sm"><MessageSquare className="mr-2 h-4 w-4"/>Check-in</Button></DialogTrigger>
                                        </div>
                                        <WellbeingChat studentName={student.name} />
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        )))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default function GuardianAiClientPage({ initialStudents }: { initialStudents: Student[] }) {
    
    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto space-y-8">
                     <div>
                        <Button asChild variant="outline" className="mb-4">
                            <Link href="/education-tech">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Education Tech
                            </Link>
                        </Button>
                        <div className="text-center">
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                                <ShieldCheck className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-primary">Guardian AI Dashboard</h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                A holistic overview of student wellbeing and career readiness.
                            </p>
                        </div>
                    </div>

                    <Tabs defaultValue="dashboard" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="dashboard">Student Success Dashboard</TabsTrigger>
                            <TabsTrigger value="scholarships">Scholarship Finder</TabsTrigger>
                            <TabsTrigger value="interview">AI Interview Coach</TabsTrigger>
                        </TabsList>
                        <TabsContent value="dashboard" className="mt-6">
                            <StudentDashboard students={initialStudents} />
                        </TabsContent>
                         <TabsContent value="scholarships" className="mt-6">
                             <Link href="/education-tech/scholarships">
                                <Card className="hover:bg-muted/50 cursor-pointer text-center">
                                  <CardHeader>
                                    <CardTitle>Navigate to Scholarship Finder</CardTitle>
                                    <CardDescription>The AI Scholarship Finder has been moved to its own dedicated page for a better user experience.</CardDescription>
                                  </CardHeader>
                                </Card>
                            </Link>
                        </TabsContent>
                         <TabsContent value="interview" className="mt-6">
                             <Link href="/cv-enhancer?tab=interview">
                                <Card className="hover:bg-muted/50 cursor-pointer">
                                  <CardHeader>
                                    <CardTitle>Navigate to GENIUS Platform</CardTitle>
                                    <CardDescription>The AI Interview Coach has been integrated into our GENIUS Career Platform for a more seamless experience.</CardDescription>
                                  </CardHeader>
                                </Card>
                            </Link>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

    