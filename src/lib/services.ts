

import { Cloud, Bot, ShieldCheck, ShoppingCart, Megaphone, BarChart, FileText, Languages, Scale, Briefcase, WalletCards, NotebookText, Users, Server, Mic, Shield } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import HomeWorkforceIcon from '@/components/icons/home-workforce-icon';
import BusinessHubIcon from '@/components/icons/business-hub-icon';

export interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  enabled: boolean;
  href?: string;
}

export const initialServices: Service[] = [
  {
    icon: Cloud,
    title: "Cloud Computing",
    description: "Scalable and secure cloud infrastructure solutions to power your business.",
    enabled: true,
  },
  {
    icon: Bot,
    title: "Artificial Intelligence",
    description: "Leverage AI to automate processes, gain insights, and create intelligent products.",
    enabled: true,
    href: "/automation",
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity",
    description: "Protect your digital assets with our comprehensive cybersecurity services.",
    enabled: true,
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Solutions",
    description: "End-to-end services for building, managing, and scaling your online store, from development to marketing.",
    enabled: true,
    href: "/ecommerce",
  },
    {
    icon: BusinessHubIcon,
    title: "Business Hub",
    description: "A B2B and B2C marketplace to connect with other businesses and clients for services and job opportunities.",
    enabled: true,
    href: "/business-hub",
  },
  {
    icon: BarChart,
    title: "Data Analytics & BI",
    description: "Turn your data into actionable insights with our business intelligence and data visualization services.",
    enabled: true,
  },
  {
    icon: Server,
    title: "IT Infrastructure Rentals",
    description: "On-demand rental of IT equipment like servers, networking devices, and workstations.",
    enabled: true,
    href: "/infra-rent",
  },
  {
    icon: Briefcase,
    title: "CV & Outsourcing Services",
    description: "Get a step-by-step CV enhancement. Optimize your CV for your target job position.",
    enabled: true,
    href: "/cv-enhancer",
  },
  {
    icon: Users,
    title: "AI Outsourcing Services",
    description: "Provision of skilled labor, domestic workers, consultants, and specialists.",
    enabled: true,
    href: "/cv-enhancer",
  },
   {
    icon: Megaphone,
    title: "Marketing & Content Agent",
    description: "Generate social media posts, tender responses, and other marketing copy.",
    enabled: true,
    href: "/social-media-post-generator",
  },
  {
    icon: Languages,
    title: "Verified Document Translator",
    description: "Translate legal, financial, and official documents with high accuracy and a formal verification statement.",
    enabled: true,
    href: "/document-translator",
  },
   {
    icon: NotebookText,
    title: "AI Admin & Legal Assistant",
    description: "Get preliminary legal analysis, draft agreements, or ask general questions from our AI agent, Aida.",
    enabled: true,
    href: "/legal-agent",
  },
  {
    icon: WalletCards,
    title: "CFO as a Service",
    description: "Access a financial command center to monitor cash flow, manage expenses, and oversee payroll.",
    enabled: true,
    href: "/cfo",
  },
   {
    icon: HomeWorkforceIcon,
    title: "Domestic Workforce Platform (RAAHA)",
    description: "An AI-powered white-label platform to connect domestic work agencies with clients, simplifying recruitment.",
    enabled: true,
    href: "/raaha",
  },
  {
    icon: Mic,
    title: "AI Interview Coach",
    description: "Practice for your next job interview with AI-generated, role-specific questions.",
    enabled: true,
    href: "/interview-coach",
  },
  {
    icon: Shield,
    title: "Financial Audit Hub",
    description: "Connect with certified financial audit offices and get AI-powered preliminary analysis of your financial documents.",
    enabled: true,
    href: "/financial-audit",
  },
];
