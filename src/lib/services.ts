
import { Cloud, Bot, ShieldCheck, ShoppingCart, Megaphone, BarChart, FileText, Languages, Scale, Briefcase, WalletCards, NotebookText, Users, Server, Mic, Shield, Video, UserRoundCheck, Lock, Database, BrainCircuit, HardHat, Building2, GraduationCap, Gem } from 'lucide-react';
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
    icon: BrainCircuit,
    title: "AI & Machine Learning",
    description: "Custom AI/ML model development, training, and deployment to solve your specific business challenges.",
    enabled: true,
  },
  {
    icon: Database,
    title: "Data Scraping & Automation",
    description: "Automated data extraction from web sources to provide you with the insights you need.",
    enabled: true,
    href: "/researcher",
  },
  {
    icon: ShoppingCart,
    title: "Nova Commerce",
    description: "End-to-end solutions to build, manage, and scale your online business.",
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
    description: "An AI-powered white-label SaaS platform to connect domestic work agencies with clients.",
    enabled: true,
    href: "/raaha",
  },
  {
    icon: Users,
    title: "Community Hub",
    description: "A digital platform for expatriate communities and charities to manage their own affairs, elections, and events.",
    enabled: true,
    href: "/community-hub",
  },
  {
    icon: Gem,
    title: "The Majlis (VIP Hub)",
    description: "An exclusive, AI-managed ecosystem for VIPs, executives, and their trusted networks, focusing on discreet problem-solving and curated opportunities.",
    enabled: true,
    href: "/vip-hub",
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
    icon: Scale,
    title: "AI Legal Agent",
    description: "Leverage AI to analyze legal documents, identifying potential risks, liabilities, and ambiguities before you sign.",
    enabled: true,
    href: "/legal-agent",
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
   {
    icon: HardHat,
    title: "Construction Tech",
    description: "Explore our suite of SaaS solutions designed to automate and innovate the construction industry.",
    enabled: true,
    href: "/construction-tech",
  },
  {
    icon: Building2,
    title: "Real Estate Tech",
    description: "A suite of automated SaaS platforms for property valuation, management, and investment.",
    enabled: true,
    href: "/real-estate-tech",
  },
  {
    icon: GraduationCap,
    title: "Education Tech",
    description: "AI-driven platforms to enhance learning, streamline administration, and improve student outcomes.",
    enabled: true,
    href: "/education-tech",
  },
];
