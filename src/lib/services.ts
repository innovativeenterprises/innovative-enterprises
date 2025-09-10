

import { Cloud, Bot, ShieldCheck, ShoppingCart, Megaphone, BarChart, FileText, Languages, Scale, Briefcase, WalletCards, NotebookText, Users, Server, Mic, Shield, Video, UserRoundCheck, Lock, Database, BrainCircuit, HardHat, Building2, GraduationCap, Gem, GanttChartSquare, Package, Lightbulb, Home, GitBranch, Search, Zap, Handshake } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import HomeWorkforceIcon from '@/components/icons/home-workforce-icon';
import BusinessHubIcon from '@/components/icons/business-hub-icon';
import SanadHubIcon from '@/components/icons/sanad-hub-icon';
import AmeenSmartLockIcon from '@/components/icons/ameen-smart-lock-icon';

export interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  enabled: boolean;
  href?: string;
  category: "Digital Transformations" | "Data Analytics" | "AI Powered & Automation" | "Business Tech Solutions" | "Essential Business Services";
}

export const initialServices: Service[] = [
  // Digital Transformations
  {
    icon: SanadHubIcon,
    title: "Sanad Hub Platform",
    description: "A digital gateway connecting users with Sanad Service Centres across Oman for task delegation and service bidding.",
    enabled: true,
    href: "/sanad-hub",
    category: "Digital Transformations"
  },
  {
    icon: BusinessHubIcon,
    title: "Business Hub",
    description: "A B2B and B2C marketplace to connect with other businesses and clients for services and job opportunities.",
    enabled: true,
    href: "/business-hub",
    category: "Digital Transformations"
  },
  {
    icon: Users,
    title: "Community Hub",
    description: "A digital platform for expatriate communities and charities to manage their own affairs, elections, and events.",
    enabled: true,
    href: "/community-hub",
    category: "Digital Transformations"
  },
  {
    icon: Gem,
    title: "The Majlis (VIP Hub)",
    description: "An exclusive, AI-managed ecosystem for VIPs, executives, and their trusted networks, focusing on discreet problem-solving and curated opportunities.",
    enabled: true,
    href: "/vip-hub",
    category: "Digital Transformations"
  },
  // Data Analytics
  {
    icon: Search,
    title: "Data Scraping & Automation",
    description: "Automated data extraction from web sources to provide you with the insights you need.",
    enabled: true,
    href: "/researcher",
    category: "Data Analytics"
  },
   {
    icon: WalletCards,
    title: "Finley CFO",
    description: "An AI-powered CFO dashboard to monitor financial health, track transactions, and view cash flow.",
    enabled: true,
    href: "/cfo",
    category: "Data Analytics"
  },
  // AI Powered & Automation
  {
    icon: Bot,
    title: "Synergy AI",
    description: "Leverage AI to automate processes, gain insights, and create intelligent products and agents.",
    enabled: true,
    href: "/automation",
    category: "AI Powered & Automation"
  },
  {
    icon: BrainCircuit,
    title: "AI & Machine Learning",
    description: "Custom AI/ML model development, training, and deployment to solve your specific business challenges.",
    enabled: true,
    category: "AI Powered & Automation"
  },
  {
    icon: Languages,
    title: "Voxi Translator",
    description: "Translate legal, financial, and official documents with high accuracy using our AI-powered service.",
    enabled: true,
    href: "/document-translator",
    category: "AI Powered & Automation"
  },
  {
    icon: Scale,
    title: "Lexi Legal Assistant",
    description: "Leverage AI to analyze legal documents, identifying potential risks, liabilities, and ambiguities before you sign.",
    enabled: true,
    href: "/legal-agent",
    category: "AI Powered & Automation"
  },
  {
    icon: GanttChartSquare,
    title: "WorkforceFlow",
    description: "AI-driven workforce scheduling, digital timecards with face recognition, and IoT equipment tracking.",
    enabled: true,
    href: "/construction-tech/workforce-scheduler",
    category: "AI Powered & Automation"
  },
  // Business Tech Solutions
  {
    icon: Cloud,
    title: "Orion Cloud",
    description: "Scalable and secure cloud infrastructure solutions to power your business.",
    enabled: true,
    category: "Business Tech Solutions"
  },
  {
    icon: ShoppingCart,
    title: "Nova Commerce",
    description: "End-to-end solutions to build, manage, and scale your online business.",
    enabled: true,
    href: "/ecommerce",
    category: "Business Tech Solutions"
  },
  {
    icon: AmeenSmartLockIcon,
    title: "Ameen Digital Identity & Smart Home",
    description: "Secure, password-free login using your WhatsApp account and manage your smart home devices.",
    enabled: true,
    href: "/ameen",
    category: "Business Tech Solutions"
  },
  {
    icon: HardHat,
    title: "Construction Tech",
    description: "Explore our suite of SaaS solutions designed to automate and innovate the construction industry.",
    enabled: true,
    href: "/construction-tech",
    category: "Business Tech Solutions"
  },
  {
    icon: Building2,
    title: "Real Estate Tech",
    description: "A suite of automated SaaS platforms for property valuation, management, and investment.",
    enabled: true,
    href: "/real-estate-tech",
    category: "Business Tech Solutions"
  },
  {
    icon: GraduationCap,
    title: "Education Tech",
    description: "AI-driven platforms to enhance learning, streamline administration, and improve student outcomes.",
    enabled: true,
    href: "/education-tech",
    category: "Business Tech Solutions"
  },
  // Essential Business Services
  {
    icon: ShieldCheck,
    title: "Aegis Security",
    description: "Protect your digital assets with our comprehensive cybersecurity services.",
    enabled: true,
    category: "Essential Business Services"
  },
  {
    icon: Package,
    title: "ProcureChain SaaS",
    description: "E-procurement platform with automated vendor approvals, asset rentals, and predictive ordering.",
    enabled: true,
    href: "/construction-tech/asset-rentals",
    category: "Essential Business Services"
  },
  {
    icon: Server,
    title: "InfraRent",
    description: "On-demand rental of IT equipment like servers, workstations, and networking gear for events and projects.",
    enabled: true,
    href: "/infra-rent",
    category: "Essential Business Services"
  },
  {
    icon: UserRoundCheck,
    title: "GENIUS Career Platform",
    description: "Optimize CVs for ATS and get support for skilled labor provision and recruitment.",
    enabled: true,
    href: "/cv-enhancer",
    category: "Essential Business Services"
  }
];
