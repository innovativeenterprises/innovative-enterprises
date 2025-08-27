
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight, DollarSign, PlusCircle, CreditCard, Users, ReceiptText, CalendarCheck, UserCheck, Upload, Paperclip, FilePlus, Eye, Trash2 } from "lucide-react";
import { useSettingsData } from "@/app/admin/settings-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const initialTransactions = [
    { id: "tx_1", description: "Payment from Gov Entity A", amount: 50000.00, type: "income", status: "Completed", date: "2024-07-28", proof: "doc_123.pdf" },
    { id: "tx_2", description: "AWS Cloud Services Bill", amount: -2500.00, type: "expense", status: "Paid", date: "2024-07-27", proof: "doc_124.pdf" },
    { id: "tx_3", description: "Freelancer Payment - John Doe", amount: -1200.00, type: "expense", status: "Paid", date: "2024-07-25" },
    { id: "tx_4", description: "Invoice #INV-007 to Tech Corp", amount: 15000.00, type: "income", status: "Pending", date: "2024-07-22" },
    { id: "tx_5", description: "Salaries - July 2024", amount: -15000.00, type: "expense", status: "Paid", date: "2024-07-31", proof: "doc_125.pdf" },
    { id: "tx_6", description: "Office Supplies Purchase", amount: -350.00, type: "expense", status: "Paid", date: "2024-07-20" },
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


const InvoiceLineItemSchema = z.object({
    description: z.string().min(1, "Description is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    price: z.coerce.number().min(0, "Price must be positive"),
});

const InvoiceSchema = z.object({
    clientName: z.string().min(2, "Client name is required"),
    clientEmail: z.string().email("A valid email is required"),
    invoiceDate: z.string(),
    dueDate: z.string(),
    lineItems: z.array(InvoiceLineItemSchema).min(1, "At least one line item is required"),
});

type InvoiceValues = z.infer<typeof InvoiceSchema>;


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
                    if (columns.length < 5) {
                        console.warn(`Skipping malformed row ${index + 2}: ${row}`);
                        return null;
                    }
                    return {
                        id: `tx_csv_${Date.now()}_${index}`,
                        description: columns[0]?.trim(),
                        amount: parseFloat(columns[1]?.trim()) || 0,
                        type: columns[2]?.trim() as any,
                        status: columns[3]?.trim(),
                        date: columns[4]?.trim(),
                        proof: columns[5]?.trim() || '',
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
        const headers = ["description", "amount", "type (income/expense)", "status", "date (YYYY-MM-DD)", "proof (optional_filename)"];
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


const AddInvoiceDialog = ({ onSave, children, vatRate }: { onSave: (invoice: InvoiceValues, total: number) => void, children: React.ReactNode, vatRate: number }) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<InvoiceValues>({
        resolver: zodResolver(InvoiceSchema),
        defaultValues: {
            clientName: "",
            clientEmail: "",
            invoiceDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            lineItems: [{ description: "", quantity: 1, price: 0 }],
        }
    });
    
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "lineItems",
    });

    const watchLineItems = form.watch("lineItems");
    const subtotal = watchLineItems.reduce((acc, item) => acc + (item.quantity || 0) * (item.price || 0), 0);
    const vat = subtotal * vatRate;
    const total = subtotal + vat;
    
    const onSubmit: SubmitHandler<InvoiceValues> = (data) => {
        onSave(data, total);
        setIsOpen(false);
        form.reset();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create New Invoice</DialogTitle>
                    <DialogDescription>Fill in the details below to create and log a new invoice.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField name="clientName" control={form.control} render={({ field }) => <FormItem><FormLabel>Client Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                            <FormField name="clientEmail" control={form.control} render={({ field }) => <FormItem><FormLabel>Client Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>} />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <FormField name="invoiceDate" control={form.control} render={({ field }) => <FormItem><FormLabel>Invoice Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>} />
                            <FormField name="dueDate" control={form.control} render={({ field }) => <FormItem><FormLabel>Due Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>} />
                        </div>

                        <Separator />
                        
                        <div>
                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-12 gap-2 items-end mb-2">
                                    <FormField name={`lineItems.${index}.description`} control={form.control} render={({ field }) => (
                                        <FormItem className="col-span-6"><FormLabel className={cn(index !== 0 && "sr-only")}>Description</FormLabel><FormControl><Input placeholder="Service or product description" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField name={`lineItems.${index}.quantity`} control={form.control} render={({ field }) => (
                                        <FormItem className="col-span-2"><FormLabel className={cn(index !== 0 && "sr-only")}>Qty</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField name={`lineItems.${index}.price`} control={form.control} render={({ field }) => (
                                        <FormItem className="col-span-3"><FormLabel className={cn(index !== 0 && "sr-only")}>Price</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <div className="col-span-1">
                                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                    </div>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => append({ description: "", quantity: 1, price: 0 })}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Line Item
                            </Button>
                        </div>
                        
                        <Separator />

                        <div className="flex justify-end">
                            <div className="w-64 space-y-2 text-sm">
                                <div className="flex justify-between"><span>Subtotal:</span><span>OMR {subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>VAT ({vatRate * 100}%):</span><span>OMR {vat.toFixed(2)}</span></div>
                                <div className="flex justify-between font-bold text-base border-t pt-2"><span>Total:</span><span>OMR {total.toFixed(2)}</span></div>
                            </div>
                        </div>

                        <DialogFooter className="sticky bottom-0 bg-background pt-4 pb-0 -mb-2">
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Create & Log Invoice</Button>
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
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();

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
  
  const handleSaveInvoice = (invoice: InvoiceValues, total: number) => {
    const newTransaction: Transaction = {
        id: `tx_inv_${Date.now()}`,
        description: `Invoice to ${invoice.clientName}`,
        amount: total,
        type: 'income',
        status: 'Pending',
        date: invoice.invoiceDate,
        proof: '', // No proof initially for an invoice
    };
    setTransactions(prev => [newTransaction, ...prev]);
    toast({ title: "Invoice Created", description: `Invoice for OMR ${total.toFixed(2)} has been logged as a pending transaction.` });
  };
  
  const filteredTransactions = transactions.filter(t => {
      if (filter === 'all') return true;
      return t.type === filter;
  });


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
                <CardHeader className="flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>An overview of recent financial movements.</CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                         <AddInvoiceDialog onSave={handleSaveInvoice} vatRate={settings.vat.enabled ? settings.vat.rate : 0}>
                            <Button variant="outline" size="sm" className="w-full"><FilePlus className="mr-2 h-4 w-4" /> Create Invoice</Button>
                        </AddInvoiceDialog>
                        <ImportTransactionsDialog onImport={handleImport}>
                            <Button variant="outline" size="sm" className="w-full"><Upload className="mr-2 h-4 w-4" /> Import Transactions</Button>
                        </ImportTransactionsDialog>
                        <Button size="sm" className="w-full"><PlusCircle className="mr-2 h-4 w-4" /> Add Manually</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 mb-4">
                        <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All</Button>
                        <Button variant={filter === 'income' ? 'default' : 'outline'} onClick={() => setFilter('income')}>Income</Button>
                        <Button variant={filter === 'expense' ? 'default' : 'outline'} onClick={() => setFilter('expense')}>Expenses</Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Proof of Payment</TableHead>
                                <TableHead className="text-right">Amount (OMR)</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTransactions.map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className={cn("p-1 rounded-full", tx.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20')}>
                                                {tx.type === 'income' ? <ArrowDownLeft className="h-4 w-4 text-green-600" /> : <ArrowUpRight className="h-4 w-4 text-red-600" />}
                                            </div>
                                            <div>
                                                <p className="font-medium">{tx.description}</p>
                                                {getStatusBadge(tx.status)}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                                    <TableCell>
                                        {tx.proof ? (
                                             <Button variant="outline" size="sm" className="h-8">
                                                <Paperclip className="h-3 w-3 mr-2" />
                                                View Proof
                                            </Button>
                                        ) : (
                                            <Button variant="ghost" size="sm" className="h-8 text-muted-foreground">
                                                <Upload className="h-3 w-3 mr-2" />
                                                Attach
                                            </Button>
                                        )}
                                    </TableCell>
                                    <TableCell className={cn("text-right font-semibold", tx.amount > 0 ? 'text-green-600' : 'text-destructive')}>
                                        {tx.amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                         <Button variant="ghost" size="icon" onClick={() => setSelectedTransaction(tx)}><Eye className="h-4 w-4"/></Button>
                                    </TableCell>
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
         {selectedTransaction && (
            <Dialog open={!!selectedTransaction} onOpenChange={(open) => !open && setSelectedTransaction(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Transaction Details</DialogTitle>
                        <DialogDescription>{selectedTransaction.description}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 text-sm">
                        <p><strong>Date:</strong> {selectedTransaction.date}</p>
                        <p><strong>Amount:</strong> <span className={cn(selectedTransaction.amount > 0 ? 'text-green-600' : 'text-destructive')}>{selectedTransaction.amount.toFixed(2)} OMR</span></p>
                        <p><strong>Type:</strong> {selectedTransaction.type}</p>
                        <p><strong>Status:</strong> {selectedTransaction.status}</p>
                        <p><strong>Proof:</strong> {selectedTransaction.proof || 'Not attached'}</p>
                    </div>
                </DialogContent>
            </Dialog>
        )}
    </div>
  )
}
