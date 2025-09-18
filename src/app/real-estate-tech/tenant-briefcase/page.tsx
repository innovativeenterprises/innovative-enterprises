
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, FileText, Bell, PlusCircle, Download } from 'lucide-react';
import { initialUserDocuments, type UserDocument } from '@/lib/user-documents';
import { useState } from 'react';
import { DueDateDisplay } from "@/components/due-date-display";

const DocumentCard = ({ doc }: { doc: UserDocument }) => (
    <Card className="bg-muted/50">
        <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <div>
                    <p className="font-semibold">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">Uploaded: {doc.uploadDate}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon"><Download className="h-4 w-4"/></Button>
            </div>
        </CardContent>
    </Card>
);

export default function TenantBriefcasePage() {
    const [documents, setDocuments] = useState(initialUserDocuments);
    
    // In a real app, you would have a function to handle file uploads
    const handleUpload = () => {
        // Placeholder for upload logic
    };

    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto text-center">
                     <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Briefcase className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">My Digital Briefcase</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                       A secure, one-stop app to manage your important personal documents like IDs, contracts, utility bills, and insurance, with automatic reminders for renewals.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto mt-12 grid gap-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Renewals</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {documents.filter(doc => doc.expiryDate).map(doc => (
                                <div key={doc.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-3">
                                         <Bell className="h-5 w-5 text-yellow-500" />
                                         <p className="font-medium">{doc.name}</p>
                                    </div>
                                    <DueDateDisplay date={doc.expiryDate} prefix="Expires:" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                         <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>My Documents</CardTitle>
                            <Button variant="outline" disabled><PlusCircle className="mr-2 h-4 w-4"/> Upload New</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {documents.map(doc => <DocumentCard key={doc.id} doc={doc} />)}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}
