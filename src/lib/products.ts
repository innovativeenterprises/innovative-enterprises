

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  aiHint: string;
  enabled: boolean;
  stage: string;
}

export const initialProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'PANOSPACE',
    description: 'An immersive technology that allows users to explore and experience a location or property virtually. Using specialized 360-degree cameras, it creates a seamless virtual tour compatible with mobile devices and VR headsets. Ideal for real estate, hospitality, and event venues, PANOSPACE boosts engagement by up to 400% with features like interactive hotspots, custom branding, and detailed analytics. It can be easily embedded on websites and shared on social media to attract a global audience.',
    image: 'https://storage.googleapis.com/stella-images/studio-app-live/20240730-192535-643-virtual_reality.png',
    aiHint: 'virtual reality',
    enabled: true,
    stage: 'Ready',
  },
  {
    id: 'prod_2',
    name: 'ameen',
    description: 'A comprehensive "super-app" for communities in Oman and the GCC, featuring AI-powered Lost & Found, civic issue reporting, on-demand social services, and bill payments to provide trusted digital safety and convenience.',
    image: 'https://storage.googleapis.com/stella-images/studio-app-live/20240731-185127-249-secure_child.png',
    aiHint: 'community safety app',
    enabled: true,
    stage: 'Ready',
  },
  {
    id: 'prod_3',
    name: 'APPI',
    description: 'An innovative mobile application that leverages AI/Deeptech and IoT to provide real-time, personalized insights into household utility consumption (electricity, water, gas). It empowers users with predictive analytics, automated notifications, and convenient service booking options, ultimately leading to significant cost savings and enhanced convenience.',
    image: 'https://storage.googleapis.com/stella-images/studio-app-live/20240730-192536-407-api_integration.png',
    aiHint: 'api integration',
    enabled: true,
    stage: 'Development Phase',
  },
  {
    id: 'prod_4',
    name: 'KHIDMA',
    description: 'A revolutionary AI/Deep-tech powered mobile application that transforms the traditional service industry. It acts as a dynamic marketplace connecting service seekers with qualified providers through an innovative auction/tender system.',
    image: 'https://storage.googleapis.com/stella-images/studio-app-live/20240731-190300-848-service_marketplace.png',
    aiHint: 'service marketplace',
    enabled: true,
    stage: 'Development Phase',
  },
  {
    id: 'prod_5',
    name: 'VMALL',
    description: 'A revolutionary Web & Mobile application that leverages Virtual Reality (VR) and Augmented Reality (AR) technology to create immersive shopping experiences. It empowers businesses across various sectors, including retail, real estate, hospitality, and event management, to showcase their offerings in a captivating and interactive manner.',
    image: 'https://storage.googleapis.com/stella-images/studio-app-live/20240730-192538-422-online_shopping.png',
    aiHint: 'online shopping',
    enabled: true,
    stage: 'Development Phase',
  },
  {
    id: 'prod_6',
    name: 'GENIUS - AI Career Platform',
    description: 'An end-to-end solution for career development—from document parsing and CV enhancement to tailored interview preparation—all within a seamless mobile and web experience.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'career development',
    enabled: true,
    stage: 'Development Phase',
  },
   {
    id: 'prod_7',
    name: 'RAAHA - Domestic Workforce Platform',
    description: 'An AI-powered, white-label platform designed to empower home workforce agencies, streamline recruitment, and build trust with clients.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'home workforce',
    enabled: true,
    stage: 'Ready',
  },
  {
    id: 'prod_8',
    name: 'Voxi - Verified Document Translator',
    description: 'Translate legal, financial, and official documents with high accuracy. This service is managed by Voxi, our AI Translation Agent.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'document translation',
    enabled: true,
    stage: 'Ready',
  },
  {
    id: 'prod_10',
    name: 'InfraRent - IT Infrastructure Rentals',
    description: 'On-demand rental of IT equipment and services, such as servers, networking devices, storage systems, and workstations.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'server room',
    enabled: true,
    stage: 'Ready',
  },
   {
    id: 'prod_11',
    name: 'AI-POS',
    description: 'A smart, AI-driven Point-of-Sale system for small groceries, featuring inventory management, sales analytics, and customer insights to optimize stock.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'point of sale',
    enabled: true,
    stage: 'Research Phase',
  },
  {
    id: 'prod_12',
    name: 'We Match - MATCH CUP GAME',
    description: 'An immersive Augmented Reality (AR) social game designed to connect people through interactive, real-world challenges and competitions.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'augmented reality game',
    enabled: true,
    stage: 'Research Phase',
  },
  {
    id: 'prod_13',
    name: 'AlumniConnect',
    description: 'A comprehensive digital platform for universities, colleges, and schools to engage their alumni network, fostering connections and professional opportunities.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'university alumni',
    enabled: true,
    stage: 'Research Phase',
  },
  {
    id: 'prod_14',
    name: 'Hadeeya',
    description: 'A sophisticated prepaid digital gift card platform, enabling seamless and personalized gifting experiences for individuals and corporate clients.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'gift card',
    enabled: true,
    stage: 'Research Phase',
  },
];
