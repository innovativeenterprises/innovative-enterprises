

import { Cloud, Bot, ShieldCheck, ShoppingCart, Megaphone, BarChart, FileText, Languages, Scale, Briefcase, WalletCards, NotebookText, Users, Server, Mic, Shield, Video, UserRoundCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import HomeWorkforceIcon from '@/components/icons/home-workforce-icon';
import BusinessHubIcon from '@/components/icons/business-hub-icon';
import SanadHubIcon from '@/components/icons/sanad-hub-icon';

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
    description: "Leverage AI to automate processes, gain insights, and create intelligent products and agents.",
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
    icon: SanadHubIcon,
    title: "Sanad Hub Platform",
    description: "A digital gateway connecting users with Sanad Service Centres across Oman for task delegation and service bidding.",
    enabled: true,
    href: "/sanad-hub",
  },
  {
    icon: BarChart,
    title: "Momentum BI",
    description: "Turn your data into actionable insights with our business intelligence and data visualization services.",
    enabled: true,
  },
  {
    icon: Video,
    title: "Vision AI Estimator",
    description: "Get an AI-powered quotation for your surveillance system needs, from design to installation.",
    enabled: true,
    href: "/cctv-estimator",
  },
   {
    icon: FileText,
    title: "Tender Assistant",
    description: "Generate comprehensive and professional draft responses to help you win your next bid.",
    enabled: true,
    href: "/tender-assistant",
  },
   {
    icon: Megaphone,
    title: "Mira Marketing Agent",
    description: "Generate social media posts, tender responses, and other marketing copy.",
    enabled: true,
    href: "/social-media-post-generator",
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
    icon: Shield,
    title: "Certus Audit Hub",
    description: "Connect with certified financial audit offices and get AI-powered preliminary analysis of your financial documents.",
    enabled: true,
    href: "/financial-audit",
  },
  {
    icon: UserRoundCheck,
    title: "PRO Task Delegation",
    description: "Efficiently manage your government-related tasks and generate assignment documents for your PRO.",
    enabled: true,
    href: "/pro-agent",
  }
];
