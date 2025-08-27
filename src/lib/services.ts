

import { Cloud, Bot, ShieldCheck, ShoppingCart, Megaphone, BarChart, FileText, Languages, Scale, Briefcase, WalletCards, NotebookText, Users, Server, Mic, Shield, Video, UserRoundCheck, Lock } from 'lucide-react';
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
    icon: HomeWorkforceIcon,
    title: "RAAHA Platform",
    description: "An AI-powered white-label platform to connect domestic work agencies with clients.",
    enabled: true,
    href: "/raaha",
  },
  {
    icon: BarChart,
    title: "Momentum BI",
    description: "Turn your data into actionable insights with our business intelligence and data visualization services.",
    enabled: false,
  },
  {
    icon: Server,
    title: "InfraRent",
    description: "On-demand rental of IT equipment like servers, workstations, and networking gear for events and projects.",
    enabled: true,
    href: "/infra-rent",
  },
   {
    icon: Languages,
    title: "Voxi Translator",
    description: "Translate legal, financial, and official documents with high accuracy using our AI-powered service.",
    enabled: true,
    href: "/document-translator",
  },
  {
    icon: FileText,
    title: "Certus Audit Hub",
    description: "Connect with certified audit offices and leverage AI for a preliminary analysis of your financial documents.",
    enabled: true,
    href: "/financial-audit",
  },
  {
    icon: Lock,
    title: "Ameen Digital Identity",
    description: "Secure, password-free login using your WhatsApp account and other advanced authentication solutions.",
    enabled: true,
    href: "/ameen",
  },
];
