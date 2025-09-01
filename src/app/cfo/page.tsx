
'use client';

import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { store } from "@/lib/global-store";
import CfoDashboard from "./cfo-dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { AuditSubmission } from "@/lib/audit-submissions";

function AuditHistoryTable({ submissions }: { submissions: AuditSubmission[] }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Submitted": return <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30">Submitted</Badge>;
      case "In Review": return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">In Review</Badge>;
      case "Completed": return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Completed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle>Audit & Compliance History</CardTitle>
            <CardDescription>A log of all your submitted financial analysis requests.</CardDescription>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Analysis Type</TableHead>
                        <TableHead>Submitted To</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {submissions.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">No audit requests submitted yet.</TableCell>
                        </TableRow>
                    )}
                    {submissions.map(sub => (
                        <TableRow key={sub.id}>
                            <TableCell>
                                <div className="font-medium">{sub.companyName}</div>
                                <div className="text-sm text-muted-foreground">FY {sub.fiscalYear}</div>
                            </TableCell>
                            <TableCell>{sub.analysisType}</TableCell>
                            <TableCell>{sub.assignedOffice}</TableCell>
                            <TableCell>{format(new Date(sub.submissionDate), "PPP")}</TableCell>
                            <TableCell>{getStatusBadge(sub.status)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  )
}


export default function CfoPage() {
  const [submissions, setSubmissions] = useState(store.get().auditSubmissions);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
        setSubmissions(store.get().auditSubmissions);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8">
        <CfoDashboard />
        <AuditHistoryTable submissions={submissions} />
    </div>
  );
}
