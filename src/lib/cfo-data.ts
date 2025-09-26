
import { DollarSign, Users, CreditCard, Activity } from 'lucide-react';

export const initialCfoData = {
    kpiData: [
        { title: "Total Revenue", value: "OMR 45,231.89", change: "+20.1% from last month", icon: 'DollarSign', href: "#" },
        { title: "Subscriptions", value: "+2350", change: "+180.1% from last month", icon: 'Users', href: "#" },
        { title: "Sales", value: "+12,234", change: "+19% from last month", icon: 'CreditCard', href: "#" },
        { title: "Active Now", value: "+573", change: "+201 since last hour", icon: 'Activity', href: "#" },
        { title: "Projects", value: "2", change: "+20.1% from last month", icon: 'DollarSign', href: "/admin/projects" },
        { title: "Test", value: "3", change: "+20.1% from last month", icon: 'DollarSign', href: "#" }
    ],
    transactionData: [
        { client: 'OmanTel', type: 'SaaS Subscription', status: 'Paid', total: 2500.00 },
        { client: 'Petroleum Development Oman', type: 'Consulting', status: 'Pending', total: 15000.00 },
    ],
    upcomingPayments: [
        { source: "AWS Cloud Services", dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), amount: 450.00 },
        { source: "Office Rent", dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(), amount: 1200.00 },
    ],
    vatPayment: {
        amount: 1850.75,
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
    },
    cashFlowData: [
      { month: 'Jan', income: 4000, expenses: 2400 },
      { month: 'Feb', income: 3000, expenses: 1398 },
      { month: 'Mar', income: 5000, expenses: 3800 },
      { month: 'Apr', income: 4780, expenses: 3908 },
      { month: 'May', income: 6890, expenses: 4800 },
      { month: 'Jun', income: 5390, expenses: 3800 },
    ]
};
