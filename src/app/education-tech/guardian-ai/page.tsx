
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, UserCheck, ShieldCheck, Heart, FileText, Mic, MessageSquare, Bot } from 'lucide-react';
import Link from 'next/link';
import { initialStudents } from '@/lib/students';
import type { Student } from '@/lib/students';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ChatComponent } from '@/components/chat/chat-component';
import { wellbeingCheckin } from '@/ai/flows/wellbeing-checkin';
import { useSettingsData } from '@/app/admin/settings-table';


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

export default function GuardianAiPage() {
    const [students, setStudents] = useState<Student[]>(initialStudents);
    const { settings } = useSettingsData();

    const getStatusBadge = (status: Student['status']) => {
        switch (status) {
            case 'On Track': return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">On Track</Badge>;
            case 'Needs Attention': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Needs Attention</Badge>;
            case 'At Risk': return <Badge variant="destructive">At Risk</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

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
                                    {students.map(student => (
                                        <TableRow key={student.id}>
                                            <TableCell>
                                                 <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={student.photo} alt={student.name} />
                                                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
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
                                                        <Button asChild variant="outline" size="sm"><Link href="/cv-enhancer"><FileText className="mr-2 h-4 w-4"/>CV</Link></Button>
                                                        <Button asChild variant="outline" size="sm"><Link href="/interview-coach"><Mic className="mr-2 h-4 w-4"/>Interview</Link></Button>
                                                        <DialogTrigger asChild><Button variant="secondary" size="sm"><MessageSquare className="mr-2 h-4 w-4"/>Check-in</Button></DialogTrigger>
                                                    </div>
                                                    <WellbeingChat studentName={student.name} />
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    )
}
