

import { Cloud, Bot, ShieldCheck, ShoppingCart, Megaphone, BarChart, FileText, Languages, Scale, Briefcase, WalletCards, NotebookText, Users, Server, Mic, Shield, Video } from 'lucide-react';
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
    title: "Orion Cloud",
    description: "Scalable and secure cloud infrastructure solutions to power your business.",
    enabled: true,
  },
  {
    icon: Bot,
    title: "Synergy AI",
    description: "Leverage AI to automate processes, gain insights, and create intelligent products.",
    enabled: true,
    href: "/automation",
  },
  {
    icon: ShieldCheck,
    title: "Aegis Security",
    description: "Protect your digital assets with our comprehensive cybersecurity services.",
    enabled: true,
  },
  {
    icon: ShoppingCart,
    title: "Nova Commerce",
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
    title: "Momentum BI",
    description: "Turn your data into actionable insights with our business intelligence and data visualization services.",
    enabled: true,
  },
  {
    icon: Server,
    title: "InfraRent",
    description: "On-demand rental of IT equipment like servers, networking devices, and workstations.",
    enabled: true,
    href: "/infra-rent",
  },
  {
    icon: Video,
    title: "Vision AI Estimator",
    description: "Get an AI-powered quotation for your surveillance system needs, from design to installation.",
    enabled: true,
    href: "/cctv-estimator",
  },
  {
    icon: Briefcase,
    title: "GENIUS Career Platform",
    description: "Enhance your CV, get tailored career advice, and prepare for interviews with our AI coach.",
    enabled: true,
    href: "/cv-enhancer",
  },
   {
    icon: FileText,
    title: "Tender Assistant",
    description: "Generate comprehensive and professional draft responses to help you win your next bid.",
    enabled: true,
    href: "/tender-assistant",
  },
  {
    icon: Users,
    title: "Catalyst Workforce",
    description: "Provision of skilled labor, domestic workers, consultants, and specialists.",
    enabled: true,
    href: "/cv-enhancer",
  },
   {
    icon: Megaphone,
    title: "Mira Marketing Agent",
    description: "Generate social media posts, tender responses, and other marketing copy.",
    enabled: true,
    href: "/social-media-post-generator",
  },
  {
    icon: Languages,
    title: "Voxi Translator",
    description: "Translate legal, financial, and official documents with high accuracy and a formal verification statement.",
    enabled: true,
    href: "/document-translator",
  },
   {
    icon: NotebookText,
    title: "Aida Legal Assistant",
    description: "Get preliminary legal analysis, draft agreements, or ask general questions from our AI agent, Aida.",
    enabled: true,
    href: "/legal-agent",
  },
  {
    icon: WalletCards,
    title: "Finley CFO Service",
    description: "Access a financial command center to monitor cash flow, manage expenses, and oversee payroll.",
    enabled: true,
    href: "/cfo",
  },
   {
    icon: HomeWorkforceIcon,
    title: "RAAHA Platform",
    description: "An AI-powered white-label platform to connect domestic work agencies with clients, simplifying recruitment.",
    enabled: true,
    href: "/raaha",
  },
  {
    icon: Shield,
    title: "Certus Audit Hub",
    description: "Connect with certified financial audit offices and get AI-powered preliminary analysis of your financial documents.",
    enabled: true,
    href: "/financial-audit",
  },
];
