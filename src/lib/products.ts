
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
    name: 'PanoSpace',
    description: 'An immersive platform for virtual tours and panoramic experiences.',
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
