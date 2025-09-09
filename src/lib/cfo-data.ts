import { DollarSign, Users, CreditCard, Activity } from "lucide-react";
import type { LucideIcon } from 'lucide-react';

export interface KpiData {
    title: string;
    value: string;
    change: string;
    icon: LucideIcon;
    href: string;
}

export interface TransactionData {
    client: string;
    type: string;
    status: 'Paid' | 'Pending' | 'Unpaid';
    total: number;
}

export interface UpcomingPayment {
    source: string;
    dueDate: string;
    amount: number;
}

export interface VatPayment {
    amount: number;
    dueDate: string;
}

export const kpiData: KpiData[] = [
    { title: "Total Revenue", value: "OMR 45,231.89", change: "+20.1% from last month", icon: DollarSign, href: "#" },
    { title: "Active Subscriptions", value: "+2350", change: "+180.1% from last month", icon: Users, href: "#" },
    { title: "Sales", value: "+12,234", change: "+19% from last month", icon: CreditCard, href: "#" },
    { title: "Active Now", value: "+573", change: "+201 since last hour", icon: Activity, href: "#" },
    { title: "Total Expenses", value: "OMR 21,450.60", change: "+15.2% from last month", icon: DollarSign, href: "#" },
    { title: "Net Profit", value: "OMR 23,781.29", change: "+25.0% from last month", icon: DollarSign, href: "#" },
];

export const transactionData: TransactionData[] = [
    { client: "Global Tech Inc.", type: "AI Services", status: "Paid", total: 2500.00 },
    { client: "Oman Construction Co.", type: "SaaS Subscription", status: "Paid", total: 1500.00 },
    { client: "Muscat Innovations", type: "Cloud Hosting", status: "Unpaid", total: 800.00 },
    { client: "Sohar Logistics", type: "Data Analytics", status: "Paid", total: 3200.00 },
    { client: "Salalah Resorts", type: "Website Development", status: "Pending", total: 5500.00 },
    { client: "Nizwa Heritage Hotels", type: "IT Consultation", status: "Paid", total: 1200.00 },
    { client: "Buraimi Manufacturing", type: "Automation", status: "Paid", total: 7500.00 },
    { client: "Sur Fisheries", type: "AI Model Training", status: "Unpaid", total: 4200.00 },
    { client: "Ibra Digital Marketing", type: "Content Creation", status: "Paid", total: 1800.00 },
    { client: "Khasab Tourism", type: "Platform Fee", status: "Pending", total: 600.00 },
];

export const upcomingPayments: UpcomingPayment[] = [
    { source: "CloudNova Hosting", dueDate: "2024-08-01", amount: 1250.50 },
    { source: "Office Rent", dueDate: "2024-08-05", amount: 2500.00 },
    { source: "Staff Payroll", dueDate: "2024-08-25", amount: 15000.00 },
    { source: "Marketing Campaign", dueDate: "2024-09-01", amount: 3500.00 },
    { source: "Software Licenses", dueDate: "2024-09-10", amount: 850.75 },
];

export const vatPayment: VatPayment = {
    amount: 2153.45,
    dueDate: "2024-08-15",
};
