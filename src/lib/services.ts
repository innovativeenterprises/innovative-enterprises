
import { Cloud, Bot, ShieldCheck, ShoppingCart, Megaphone, BarChart, FileText, Languages, Scale, Briefcase, WalletCards } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

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
    icon: Briefcase,
    title: "CV ATS Enhancer",
    description: "Get a step-by-step CV enhancement. Optimize your CV for your target job position.",
    enabled: true,
    href: "/cv-enhancer",
  },
   {
    icon: FileText,
    title: "Tender Response Assistant",
    description: "Save time preparing proposals. Upload tender documents to generate a compelling draft response.",
    enabled: true,
    href: "/tender-assistant",
  },
  {
    icon: Languages,
    title: "Verified Document Translator",
    description: "Translate legal, financial, and official documents with high accuracy and a formal verification statement.",
    enabled: true,
    href: "/document-translator",
  },
   {
    icon: Scale,
    title: "AI Legal Agent",
    description: "Get preliminary legal analysis and insights for your business questions from our AI agent.",
    enabled: true,
    href: "/legal-agent",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description: "Enhance your online presence and reach your target audience effectively.",
    enabled: true,
    href: "/social-media-post-generator",
  },
  {
    icon: WalletCards,
    title: "CFO as a Service",
    description: "Access a financial command center to monitor cash flow, manage expenses, and oversee payroll.",
    enabled: true,
    href: "/cfo",
  },
];
