
import { Bot, Cloud, Shield, Handshake, Briefcase, FileText, GanttChartSquare, Server } from "lucide-react";
import type { Service } from "./services.schema";


export const initialServices: Service[] = [
  {
    title: "Synergy AI",
    description: "Leverage AI to automate processes, gain insights, and create intelligent products and agents.",
    icon: Bot,
    category: "AI Powered & Automation",
    enabled: true,
    href: '/automation'
  },
  {
    title: "Orion Cloud",
    description: "Scalable and secure cloud infrastructure solutions to power your business.",
    icon: Cloud,
    category: "Digital Transformations",
    enabled: true,
    href: '/services/cloud'
  },
  {
    title: "Aegis Security",
    description: "Protect your digital assets with our comprehensive cybersecurity services.",
    icon: Shield,
    category: "Digital Transformations",
    enabled: true,
    href: '/services/cybersecurity'
  },
  {
    title: "Business Hub",
    description: "A B2B and B2C marketplace to connect with other businesses and clients for services and job opportunities.",
    icon: Handshake,
    category: "Business Tech Solutions",
    enabled: true,
    href: '/business-hub'
  },
  {
    title: "Sanad Hub Platform",
    description: "A digital gateway connecting users with Sanad Service Centres across Oman for task delegation and service bidding.",
    icon: Briefcase,
    category: "Business Tech Solutions",
    enabled: true,
    href: '/sanad-hub'
  },
  {
    title: "Tender Response Assistant",
    description: "Let our AI analyze tender documents and generate a comprehensive, professional draft response in minutes.",
    icon: FileText,
    category: "AI Powered & Automation",
    enabled: true,
    href: '/tender-assistant'
  },
  {
    title: "Smart Project Management",
    description: "AI-based scheduling, resource allocation, and real-time collaboration for your most complex projects.",
    icon: GanttChartSquare,
    category: "AI Powered & Automation",
    enabled: false,
    href: '#'
  },
  {
    title: "InfraRent",
    description: "On-demand rental of IT equipment like servers, workstations, and networking gear for events and projects.",
    icon: Server,
    category: "Business Tech Solutions",
    enabled: true,
    href: '/construction-tech/asset-rentals'
  },
];
