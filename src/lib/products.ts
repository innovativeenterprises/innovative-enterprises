
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
    description: 'An intuitive API management and integration platform.',
    image: 'https://storage.googleapis.com/stella-images/studio-app-live/20240730-192536-407-api_integration.png',
    aiHint: 'api integration',
  },
  {
    id: 'prod_4',
    name: 'KHIDMAAI',
    description: 'A digital marketplace using AI-matching for on-demand services where providers bid competitively on customer requests.',
    image: 'https://storage.googleapis.com/stella-images/studio-app-live/20240731-190300-848-service_marketplace.png',
    aiHint: 'service marketplace',
  },
  {
    id: 'prod_5',
    name: 'VMALL',
    description: 'A comprehensive virtual mall and e-commerce ecosystem.',
    image: 'https://storage.googleapis.com/stella-images/studio-app-live/20240730-192538-422-online_shopping.png',
    aiHint: 'online shopping',
  },
];
