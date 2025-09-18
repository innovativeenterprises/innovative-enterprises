

'use server';

import HeaderClient from "./header-client";
import { Handshake, Store, Recycle, Building2, GraduationCap, Car, Truck, Users, Bot, Scale, UserRoundCheck, Mic, Languages, FileText, GitBranch, Search, BrainCircuit, MessageSquare, ImageIcon, Video, Home, Heart, BookUser, HardHat, DollarSign, Gamepad2, Layers } from "lucide-react";
import SanadHubIcon from "../icons/sanad-hub-icon";
import BusinessHubIcon from "../icons/business-hub-icon";
import AmeenSmartLockIcon from "../icons/ameen-smart-lock-icon";
import KhidmaIcon from "../icons/khidma-icon";
import VmallIcon from "../icons/vmall-icon";
import AppiIcon from "../icons/appi-icon";
import { Gift, Warehouse } from "lucide-react";
import { getSettings } from "@/lib/firestore";


const solutions = [
    {
      title: "Sanad Hub",
      href: "/sanad-hub",
      description:
        "A digital gateway to delegate government service tasks to a network of Sanad offices.",
      icon: SanadHubIcon,
    },
    {
      title: "Business Hub",
      href: "/business-hub",
      description:
        "A B2B marketplace to find new clients, collaborate on projects, and expand your professional network.",
      icon: BusinessHubIcon,
    },
     {
      title: "Swap & Sell Hub",
      href: "/swap-and-sell",
      description:
        "A marketplace for used or old items. Easily list items for sale, donation, or as a gift.",
      icon: Recycle,
    },
      {
      title: "RAAHA",
      href: "/raaha",
      description:
        "An AI-powered platform for domestic workforce agencies to streamline recruitment and management.",
      icon: Home,
    },
     {
      title: "Ameen",
      href: "/ameen",
      description:
        "A secure digital identity and authentication solution, with smart home controls.",
      icon: AmeenSmartLockIcon,
    },
     {
      title: "KHIDMA",
      href: "/khidma",
      description:
        "A dynamic marketplace connecting service seekers with qualified providers through an innovative auction system.",
      icon: KhidmaIcon,
    },
    {
      title: "VMALL",
      href: "/vmall",
      description:
        "A platform leveraging VR and AR to create immersive shopping and touring experiences.",
      icon: VmallIcon,
    },
     {
      title: "APPI",
      href: "/appi",
      description:
        "An app providing real-time, personalized insights into household utility consumption.",
      icon: AppiIcon,
    },
     {
      title: "Hadeeya",
      href: "/hadeeya",
      description:
        "A sophisticated prepaid digital gift card platform for individuals and corporate clients.",
      icon: Gift,
    },
    {
      title: "StockClear",
      href: "/stock-clear",
      description:
        "A B2B marketplace to liquidate excess or near-expiry stock through auctions and bulk sales.",
      icon: Warehouse,
    },
    {
        title: "Professional Hub",
        href: "/professional-hub",
        description: "A digital platform connecting trainers, educators, and professionals with local markets, offering tools for marketing and networking.",
        icon: BookUser,
    },
     {
        title: "Beauty & Wellness Hub",
        href: "/beauty-hub",
        description: "A complete SaaS solution for salons, spas, and barbershops.",
        icon: Heart,
    },
];

const industries: { title: string; href: string; description: string, icon: any }[] = [
  {
    title: "Construction Tech",
    href: "/construction-tech",
    description: "AI-powered SaaS platforms to automate, optimize, and revolutionize the construction industry.",
    icon: HardHat,
  },
  {
    title: "Real Estate Tech",
    href: "/real-estate-tech",
    description: "A suite of automated SaaS platforms for property valuation, management, and investment.",
    icon: Building2,
  },
  {
    title: "Education Tech",
    href: "/education-tech",
    description: "AI-driven platforms to enhance learning, streamline administration, and improve student outcomes.",
    icon: GraduationCap,
  },
   {
    title: "DriveSync AI",
    href: "/drivesync-ai",
    description: "An AI-powered SaaS platform for car rental agencies with an intelligent booking agent and fleet management.",
    icon: Car,
  },
  {
    title: "Logistics Chain AI",
    href: "/logistics-ai",
    description: "An AI model to optimize supply chain and logistics for local and regional distributors.",
    icon: Truck,
  },
   {
    title: "Community Hub",
    href: "/community-hub",
    description: "A digital platform for communities and charities to manage their own affairs, elections, and events.",
    icon: Users,
  },
];

const aiTools = [
  {
    title: "AI Assistant (Aida)",
    href: "/faq",
    description: "Your go-to AI for instant answers about our services, products, and company.",
    icon: Bot,
  },
  {
    title: "Legal Assistant (Lexi)",
    href: "/legal-agent",
    description: "Draft contracts or get a preliminary analysis of legal documents.",
    icon: Scale,
  },
  {
    title: "CV Enhancer (Hira)",
    href: "/cv-enhancer",
    description: "Optimize your CV for Applicant Tracking Systems and generate tailored cover letters.",
    icon: UserRoundCheck,
  },
  {
    title: "Interview Coach (Coach)",
    href: "/cv-enhancer?tab=interview",
    description: "Practice for your next job interview with AI-generated, role-specific questions.",
    icon: Mic,
  },
  {
    title: "Document Translator (Voxi)",
    href: "/document-translator",
    description: "Translate official documents with high fidelity while preserving formatting.",
    icon: Languages,
  },
  {
    title: "Tender Assistant (TenderPro)",
    href: "/tender-assistant",
    description: "Analyzes tender documents and generates a comprehensive draft response.",
    icon: FileText,
  },
  {
    title: "Project Planner (Navi)",
    href: "/submit-work",
    description: "Transforms your raw ideas into structured, actionable project plans with a single click.",
    icon: GitBranch,
  },
  {
    title: "Research Agent (Rami)",
    href: "/researcher",
    description: "Scrape and summarize information from any webpage or perform a general web search.",
    icon: Search,
  },
  {
    title: "Feasibility Study (Sage)",
    href: "/feasibility-study",
    description: "Let our AI strategist analyze a business idea and generate a full feasibility report.",
    icon: BrainCircuit,
  },
   {
    title: "Social Media Post Generator",
    href: "/social-media-post-generator",
    description: "Create engaging social media content for multiple platforms from a single prompt.",
    icon: MessageSquare,
  },
   {
    title: "Image Generator (Lina)",
    href: "/image-generator",
    description: "Describe any image and our AI will generate it for you in seconds.",
    icon: ImageIcon,
  },
  {
    title: "Video Generator (VEO)",
    href: "/video-generator",
    description: "Describe a scene and our AI will generate a short video clip for you.",
    icon: Video,
  },
   {
    title: "AI Interior Designer",
    href: "/interior-designer",
    description: "Upload a photo of your room and get instant interior design ideas.",
    icon: Home,
  },
   {
    title: "Facebook Cover Generator",
    href: "/facebook-cover-generator",
    description: "Generate a professional Facebook cover photo for your business page.",
    icon: ImageIcon,
  },
  {
    title: "PDF Form Filler",
    href: "/pdf-form-filler",
    description: "Upload a PDF form and let the AI fill it out using your profile data.",
    icon: FileText,
  },
   {
    title: "Fintech Super-App (Finley CFO)",
    href: "/cfo",
    description: "Upload financial documents for an AI-powered preliminary audit and analysis.",
    icon: DollarSign,
  },
  {
    title: "Measurement Analyzer",
    href: "/measurement-analyzer",
    description: "Use your camera to scan an object and let our AI estimate its physical dimensions.",
    icon: Layers,
  },
];


export default async function Header() {
    const navLinks = [
        { href: "/about", label: "About" },
    ];
    
    const settings = await getSettings();

    const solutionsByCategory = {
        "SaaS Platforms": solutions,
        "AI Tools": aiTools,
    }

    const industriesByCategory = {
        "Industries": industries,
    }
    
    return <HeaderClient 
        navLinks={navLinks}
        settings={settings}
        solutionsByCategory={solutionsByCategory}
        industriesByCategory={industriesByCategory}
    />;
}
