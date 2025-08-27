
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight, DollarSign, MoreHorizontal, PlusCircle, CreditCard, Users, ReceiptText, CalendarCheck, UserCheck } from "lucide-react";
import { useSettingsData } from "@/app/admin/settings-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const transactions = [
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


export default function CfoDashboard() {
  const { settings } = useSettingsData();

  const totalRevenue = 250450.00;
  const vatPayable = settings.vat.enabled ? totalRevenue * settings.vat.rate : 0;
  const vatRatePercentage = (settings.vat.rate * 100).toFixed(1);
  const { dueDate: nextVatDueDate, daysRemaining: vatDaysRemaining } = getNextVatDueDate();

  const overviewStats = [
    { title: "Total Revenue", value: `OMR ${totalRevenue.toFixed(2)}`, change: "+20.1% from last month", icon: DollarSign },
    { title: "Total Expenses", value: "OMR 120,830.00", change: "+15.2% from last month", icon: CreditCard },
    { title: "Net Income", value: "OMR 129,620.00", change: "+25.5% from last month", icon: DollarSign },
    { title: "Active Subscriptions", value: "+OMR 5,230", change: "22 active accounts", icon: Users },
  ];

  if (settings.vat.enabled) {
      overviewStats.splice(3, 0, {
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


  return (
    <div className="space-y-8">
        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {overviewStats.map((stat, index) => (
                <Card key={index} className="xl:col-span-1">
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
                        <Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Expense</Button>
                        <Button size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Create Invoice</Button>
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
                                    <TableCell className={`text-right font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-destructive'}`}>
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
