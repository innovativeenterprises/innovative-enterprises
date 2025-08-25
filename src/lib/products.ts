
export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  aiHint: string;
  enabled: boolean;
}

export const initialProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'PANOSPACE',
    description: 'An immersive technology that allows users to explore and experience a location or property virtually. Using specialized 360-degree cameras, it creates a seamless virtual tour compatible with mobile devices and VR headsets. Ideal for real estate, hospitality, and event venues, PANOSPACE boosts engagement by up to 400% with features like interactive hotspots, custom branding, and detailed analytics. It can be easily embedded on websites and shared on social media to attract a global audience.',
    image: 'https://storage.googleapis.com/stella-images/studio-app-live/20240730-192535-643-virtual_reality.png',
    aiHint: 'virtual reality',
    enabled: true,
  },
  {
    id: 'prod_2',
    name: 'ameen',
    description: 'A comprehensive "super-app" for communities in Oman and the GCC, featuring AI-powered Lost & Found, civic issue reporting, on-demand social services, and bill payments to provide trusted digital safety and convenience.',
    image: 'https://storage.googleapis.com/stella-images/studio-app-live/20240731-185127-249-secure_child.png',
    aiHint: 'community safety app',
    enabled: true,
  },
  {
    id: 'prod_3',
    name: 'APPI',
    description: 'An innovative mobile application that leverages AI/Deeptech and IoT to provide real-time, personalized insights into household utility consumption (electricity, water, gas). It empowers users with predictive analytics, automated notifications, and convenient service booking options, ultimately leading to significant cost savings and enhanced convenience.',
    image: 'https://storage.googleapis.com/stella-images/studio-app-live/20240730-192536-407-api_integration.png',
    aiHint: 'api integration',
    enabled: true,
  },
  {
    id: 'prod_4',
    name: 'KHIDMA',
    description: 'A revolutionary AI/Deep-tech powered mobile application that transforms the traditional service industry. It acts as a dynamic marketplace connecting service seekers with qualified providers through an innovative auction/tender system.',
    image: 'https://storage.googleapis.com/stella-images/studio-app-live/20240731-190300-848-service_marketplace.png',
    aiHint: 'service marketplace',
    enabled: true,
  },
  {
    id: 'prod_5',
    name: 'VMALL',
    description: 'A revolutionary Web & Mobile application that leverages Virtual Reality (VR) and Augmented Reality (AR) technology to create immersive shopping experiences. It empowers businesses across various sectors, including retail, real estate, hospitality, and event management, to showcase their offerings in a captivating and interactive manner.',
    image: 'https://storage.googleapis.com/stella-images/studio-app-live/20240730-192538-422-online_shopping.png',
    aiHint: 'online shopping',
    enabled: true,
  },
  {
    id: 'prod_6',
    name: 'AI Outsourcing Services',
    description: 'Leverage our GENIUS platform for provision of skilled labor, domestic workers, consultants, and specialists. Our AI-powered tools streamline the recruitment and management process.',
    image: 'https://images.unsplash.com/photo-1542744095-291d1f67b221?q=80&w=1920&auto=format&fit=crop',
    aiHint: 'outsourcing hr',
    enabled: true,
  },
   {
    id: 'prod_7',
    name: 'RAAHA - Domestic Workforce Platform',
    description: 'An AI-powered, white-label platform designed to empower home workforce agencies, streamline recruitment, and build trust with clients.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'home workforce',
    enabled: true,
  },
  {
    id: 'prod_8',
    name: 'Voxi - Verified Document Translator',
    description: 'Translate legal, financial, and official documents with high accuracy. This service is managed by Voxi, our AI Translation Agent.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'document translation',
    enabled: true,
  },
  {
    id: 'prod_9',
    name: 'GENIUS - AI Career Platform',
    description: 'An end-to-end solution for career development—from document parsing to interview preparation—all within a seamless mobile and web experience.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'career development',
    enabled: true,
  },
  {
    id: 'prod_10',
    name: 'InfraRent - IT Infrastructure Rentals',
    description: 'On-demand rental of IT equipment and services, such as servers, networking devices, storage systems, and workstations.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'server room',
    enabled: true,
  },
];
