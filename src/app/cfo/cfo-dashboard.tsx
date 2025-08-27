
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight, DollarSign, PlusCircle, CreditCard, Users, ReceiptText, CalendarCheck, UserCheck, Upload } from "lucide-react";
import { useSettingsData } from "@/app/admin/settings-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const initialTransactions = [
    { description: "Payment from Gov Entity A", amount: 50000.00, type: "income", status: "Completed", date: "2024-07-28" },
    { description: "AWS Cloud Services Bill", amount: -2500.00, type: "expense", status: "Paid", date: "2024-07-27" },
    { description: "Freelancer Payment - John Doe", amount: -1200.00, type: "expense", status: "Paid", date: "2024-07-25" },
    { description: "Invoice #INV-007 to Tech Corp", amount: 15000.00, type: "income", status: "Pending", date: "2024-07-22" },
    { description: "Salaries - July 2024", amount: -15000.00, type: "expense", status: "Paid", date: "2024-07-31" },
    { description: "Office Supplies Purchase", amount: -350.00, type: "expense", status: "Paid", date: "2024-07-20" },
];

const upcomingPayments = [
    { name: "Google Workspace Subscription", amount: 150.00, dueDate: "2024-08-01" },
    { name: "Office Rent - August", amount: 2000.00, dueDate: "2024-08-05" },
    { name: "Figma Subscription", amount: 75.00, dueDate: "2024-08-10" },
];


const CsvImportSchema = z.object({
  csvFile: z.any().refine(file => file?.length == 1, 'A CSV file is required.'),
});
type CsvImportValues = z.infer<typeof CsvImportSchema>;
type Transaction = typeof initialTransactions[0];

const ImportTransactionsDialog = ({ onImport, children }: { onImport: (transactions: Transaction[]) => void, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<CsvImportValues>({ resolver: zodResolver(CsvImportSchema) });
    const { toast } = useToast();

    const handleFileParse = (file: File): Promise<Transaction[]> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                const rows = text.split('\n').slice(1); // remove header
                const newTransactions: Transaction[] = rows.map((row, index) => {
                    const columns = row.split(',');
                    if (columns.length !== 5) {
                        console.warn(`Skipping malformed row ${index + 2}: ${row}`);
                        return null;
                    }
                    return {
                        description: columns[0]?.trim(),
                        amount: parseFloat(columns[1]?.trim()) || 0,
                        type: columns[2]?.trim() as any,
                        status: columns[3]?.trim(),
                        date: columns[4]?.trim(),
                    };
                }).filter((t): t is Transaction => t !== null && t.description !== '');
                resolve(newTransactions);
            };
            reader.onerror = (error) => reject(error);
            reader.readAsText(file);
        });
    }

    const onSubmit: SubmitHandler<CsvImportValues> = async (data) => {
        try {
            const newTransactions = await handleFileParse(data.csvFile[0]);
            onImport(newTransactions);
            toast({ title: "Import Successful", description: `${newTransactions.length} transactions have been added.` });
            setIsOpen(false);
            form.reset();
        } catch (error) {
            toast({ title: "Import Failed", description: "Could not parse the CSV file. Please check the format.", variant: 'destructive' });
        }
    };
    
    const handleDownloadTemplate = () => {
        const headers = ["description", "amount", "type (income/expense)", "status", "date (YYYY-MM-DD)"];
        const csvContent = headers.join(",") + "\n";
        const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "transaction_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Import Transactions from CSV</DialogTitle>
                    <DialogDescription>
                        Upload a CSV file to add multiple income/expense records at once.
                    </DialogDescription>
                </DialogHeader>
                <Button variant="outline" onClick={handleDownloadTemplate}>Download Template</Button>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="csvFile" render={({ field }) => (
                            <FormItem><FormLabel>CSV File</FormLabel><FormControl><Input type="file" accept=".csv" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Import Transactions</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};


const getStatusBadge = (status: string) => {
    switch (status) {
        case "Completed":
        case "Paid":
            return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30 dark:bg-green-500/10 dark:text-green-400">Completed</Badge>;
        case "Pending":
            return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-400">Pending</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
}

const getNextVatDueDate = (): { dueDate: Date, daysRemaining: number } => {
    const now = new Date();
    const year = now.getFullYear();
    const quarterEndDates = [
        new Date(year, 2, 31), // March 31
        new Date(year, 5, 30), // June 30
        new Date(year, 8, 30), // September 30
        new Date(year, 11, 31) // December 31
    ];

    let nextDueDate: Date | null = null;
    for (const date of quarterEndDates) {
        if (date >= now) {
            nextDueDate = date;
            break;
        }
    }

    // If all of this year's due dates have passed, the next one is next year's first quarter
    if (!nextDueDate) {
        nextDueDate = new Date(year + 1, 2, 31);
    }
    
    const timeDiff = nextDueDate.getTime() - now.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return { dueDate: nextDueDate, daysRemaining };
};

const getNextIncomeTaxDueDate = (): { dueDate: Date, daysRemaining: number } => {
    const now = new Date();
    let year = now.getFullYear();
    
    // The deadline is April 30th of the following year for the current tax year.
    let dueDate = new Date(year, 3, 30); // April 30 of current year

    if (now > dueDate) {
        // If we are past April 30th, the next deadline is next year.
        dueDate = new Date(year + 1, 3, 30);
    }
    
    const timeDiff = dueDate.getTime() - now.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return { dueDate, daysRemaining };
};


export default function CfoDashboard() {
  const { settings } = useSettingsData();
  const [transactions, setTransactions] = useState(initialTransactions);

  const totalRevenue = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const netIncome = totalRevenue - totalExpenses;
  
  const vatPayable = settings.vat.enabled ? totalRevenue * settings.vat.rate : 0;
  const corporateTaxPayable = netIncome > 0 ? netIncome * 0.15 : 0; // 15% corporate tax on net income
  
  const vatRatePercentage = (settings.vat.rate * 100).toFixed(1);
  const { dueDate: nextVatDueDate, daysRemaining: vatDaysRemaining } = getNextVatDueDate();
  const { dueDate: nextIncomeTaxDueDate, daysRemaining: incomeTaxDaysRemaining } = getNextIncomeTaxDueDate();

  const handleImport = (newTransactions: Transaction[]) => {
      setTransactions(prev => [...newTransactions, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };


  const overviewStats = [
    { title: "Total Revenue", value: `OMR ${totalRevenue.toFixed(2)}`, change: "+20.1% from last month", icon: DollarSign },
    { title: "Total Expenses", value: `OMR ${totalExpenses.toFixed(2)}`, change: "+15.2% from last month", icon: CreditCard },
    { title: "Net Income", value: `OMR ${netIncome.toFixed(2)}`, change: "+25.5% from last month", icon: DollarSign },
    { title: "Active Subscriptions", value: "+OMR 5,230", change: "22 active accounts", icon: Users },
  ];

  if (settings.vat.enabled) {
      overviewStats.push({
          title: `VAT Payable (${vatRatePercentage}%)`,
          value: `OMR ${vatPayable.toFixed(2)}`,
          change: "on this month's revenue",
          icon: ReceiptText
      });
      overviewStats.push({
          title: "VAT Payment Due",
          value: `${vatDaysRemaining} days`,
          change: `Next deadline: ${nextVatDueDate.toLocaleDateString()}`,
          icon: CalendarCheck
      });
  }

  // Add Corporate Tax stats
   overviewStats.push({
      title: `Estimated Corp. Tax (15%)`,
      value: `OMR ${corporateTaxPayable.toFixed(2)}`,
      change: "on current net income",
      icon: ReceiptText
  });
   overviewStats.push({
      title: "Corp. Tax Filing Due",
      value: `${incomeTaxDaysRemaining} days`,
      change: `Next deadline: ${nextIncomeTaxDueDate.toLocaleDateString()}`,
      icon: CalendarCheck
  });


  return (
    <div className="space-y-8">
        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {overviewStats.map((stat, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">{stat.change}</p>
                    </CardContent>
                </Card>
            ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Transactions */}
            <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>An overview of recent financial movements.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <ImportTransactionsDialog onImport={handleImport}>
                            <Button variant="outline" size="sm"><Upload className="mr-2 h-4 w-4" /> Import from CSV</Button>
                        </ImportTransactionsDialog>
                        <Button size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Manually</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Amount (OMR)</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((tx, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1 rounded-full ${tx.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                                {tx.type === 'income' ? <ArrowDownLeft className="h-4 w-4 text-green-600" /> : <ArrowUpRight className="h-4 w-4 text-red-600" />}
                                            </div>
                                            <span className="font-medium">{tx.description}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                                    <TableCell className={`text-right font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-destructive'}`}>
                                        {tx.amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-center">{getStatusBadge(tx.status)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Side Column */}
            <div className="space-y-8">
                 {/* VAT Filing Task */}
                {settings.vat.enabled && (
                    <Card>
                        <CardHeader>
                            <CardTitle>VAT Filing Task</CardTitle>
                             <CardDescription>Quarterly VAT filing and payment.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Alert className="border-primary/30">
                                <UserCheck className="h-4 w-4"/>
                                <AlertTitle>Assigned To</AlertTitle>
                                <AlertDescription>
                                    This task is assigned to the **PRO & Financial Agent (Finley)** for processing and payment before the deadline.
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                )}
                {/* Upcoming Payments */}
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Payments</CardTitle>
                        <CardDescription>Bills and subscriptions to be paid soon.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {upcomingPayments.map((payment, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{payment.name}</p>
                                    <p className="text-sm text-muted-foreground">Due: {payment.dueDate}</p>
                                </div>
                                <p className="font-semibold">OMR {payment.amount.toFixed(2)}</p>
                            </div>
                        ))}
                        <Button variant="outline" className="w-full mt-4">Manage Subscriptions</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  )
}
