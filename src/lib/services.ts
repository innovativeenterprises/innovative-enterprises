
import { Cloud, Bot, ShieldCheck, ShoppingCart, Megaphone, BarChart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  enabled: boolean;
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
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity",
    description: "Protect your digital assets with our comprehensive cybersecurity services.",
    enabled: true,
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce Solutions",
    description: "Build powerful online stores and digital marketplaces with our expertise.",
    enabled: true,
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description: "Enhance your online presence and reach your target audience effectively.",
    enabled: false,
  },
  {
    icon: BarChart,
    title: "Data Analytics",
    description: "Turn your data into actionable insights with our advanced analytics capabilities.",
    enabled: false,
  }
];
