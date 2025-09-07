
import { CircleDollarSign, Users, TrendingUp, Percent, FolderKanban, Network } from "lucide-react";

export const kpiData = [
    { title: "Net Revenue", value: "OMR 45,231.89", change: "+20.1% from last month", icon: CircleDollarSign, href: "/admin/finance" },
    { title: "Subscriptions", value: "+2,350", change: "+180.1% from last month", icon: Users, href: "/admin/finance" },
    { title: "VAT Collected", value: "OMR 2,153.52", change: "+22% from last month", icon: Percent, href: "/admin/finance" },
    { title: "Operational Cost", value: "OMR 9,231.89", change: "+2% from last month", icon: TrendingUp, href: "/admin/finance" },
    { title: "Total Projects", value: "14", change: "+3 since last month", icon: FolderKanban, href: "/admin/projects" },
    { title: "Provider Network", value: "36", change: "+5 since last month", icon: Network, href: "/admin/network" },
];

export const transactionData = [
  { invoice: "INV001", type: 'Project', status: "Paid", total: 250.00, client: "PANOSPACE Virtual Tour - Real Estate Co." },
  { invoice: "INV002", type: 'Service', status: "Paid", total: 150.00, client: "Voxi Translation Service - Legal Docs" },
  { invoice: "INV003", type: 'Subscription', status: "Paid", total: 350.00, client: "Sanad Hub - New Office Subscription" },
  { invoice: "INV004", type: 'Expense', status: "Paid", total: 450.00, client: "Facebook/Google Ads - Marketing" },
  { invoice: "INV005", type: 'Project', status: "Pending", total: 550.00, client: "KHIDMAAI Platform Development" },
  { invoice: "INV006", type: 'Expense', status: "Paid", total: 200.00, client: "Cloud Hosting - AWS" },
  { invoice: "INV007", type: 'Service', status: "Unpaid", total: 300.00, client: "Aegis Security Audit" },
  { invoice: "INV008", type: 'Subscription', status: "Paid", total: 99.00, client: "GENIUS Career Platform - Yearly Plan" },
  { invoice: "INV009", type: 'Project', status: "Paid", total: 1200.00, client: "AI Property Valuator - Proof of Concept" },
  { invoice: "INV010", type: 'Expense', status: "Paid", total: 75.00, client: "Software Licenses - Figma" },
];

export const upcomingPayments = [
    { source: "Partner Commission Payout", amount: 1200.00, dueDate: "2024-08-25" },
    { source: "Cloud Services (AWS)", amount: 450.50, dueDate: "2024-08-28" },
    { source: "Office Rent", amount: 800.00, dueDate: "2024-09-01" },
    { source: "Software Licenses", amount: 250.00, dueDate: "2024-09-05" },
    { source: "Salaries - August", amount: 7500.00, dueDate: "2024-08-28" },
];

export const vatPayment = { source: "VAT Filing & Payment", amount: 2153.52, dueDate: "2024-09-30" };

export const cashFlowData = [
  { month: 'Mar', income: 4000, expenses: 2400 },
  { month: 'Apr', income: 3000, expenses: 1398 },
  { month: 'May', income: 2000, expenses: 9800 },
  { month: 'Jun', income: 2780, expenses: 3908 },
  { month: 'Jul', income: 1890, expenses: 4800 },
  { month: 'Aug', income: 2390, expenses: 3800 },
];
