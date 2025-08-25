
export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  aiHint: string;
}

export const initialProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'PANOSPACE',
    description: 'An immersive technology that allows users to explore and experience a location or property virtually. Using specialized 360-degree cameras, it creates a seamless virtual tour compatible with mobile devices and VR headsets. Ideal for real estate, hospitality, and event venues, PANOSPACE boosts engagement by up to 400% with features like interactive hotspots, custom branding, and detailed analytics. It can be easily embedded on websites and shared on social media to attract a global audience.',
    image: 'https://storage.googleapis.com/stella-images/studio-app-live/20240730-192535-643-virtual_reality.png',
    aiHint: 'virtual reality',
  },
  {
    id: 'prod_2',
    name: 'ameen',
    description: 'A comprehensive "super-app" for communities in Oman and the GCC, featuring AI-powered Lost & Found, civic issue reporting, on-demand social services, and bill payments to provide trusted digital safety and convenience.',
    image: 'https://storage.googleapis.com/stella-images/studio-app-live/20240731-185127-249-secure_child.png',
    aiHint: 'community safety app',
  },
  {
    id: 'prod_3',
    name: 'APPI',
    description: 'An innovative mobile application that leverages AI/Deeptech and IoT to provide real-time, personalized insights into household utility consumption (electricity, water, gas). It empowers users with predictive analytics, automated notifications, and convenient service booking options, ultimately leading to significant cost savings and enhanced convenience.',
    image: 'https://storage.googleapis.com/stella-images/studio-app-live/20240730-192536-407-api_integration.png',
    aiHint: 'api integration',
  },
  {
    id: 'prod_4',
    name: 'KHIDMA',
    description: 'A revolutionary AI/Deep-tech powered mobile application that transforms the traditional service industry. It acts as a dynamic marketplace connecting service seekers with qualified providers through an innovative auction/tender system.',
    image: 'https://storage.googleapis.com/stella-images/studio-app-live/20240731-190300-848-service_marketplace.png',
    aiHint: 'service marketplace',
  },
  {
    id: 'prod_5',
    name: 'VMALL',
    description: 'A revolutionary Web & Mobile application that leverages Virtual Reality (VR) and Augmented Reality (AR) technology to create immersive shopping experiences. It empowers businesses across various sectors, including retail, real estate, hospitality, and event management, to showcase their offerings in a captivating and interactive manner.',
    image: 'https://storage.googleapis.com/stella-images/studio-app-live/20240730-192538-422-online_shopping.png',
    aiHint: 'online shopping',
  },
];
