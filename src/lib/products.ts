
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
    description: 'A secure digital identity and authentication solution.',
    image: 'https://placehold.co/400x300.png',
    aiHint: 'secure child',
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
    description: 'AI-powered customer service and support automation tool.',
    image: 'https://storage.googleapis.com/stella-images/studio-app-live/20240730-192537-434-chatbot_ai.png',
    aiHint: 'chatbot ai',
  },
  {
    id: 'prod_5',
    name: 'VMALL',
    description: 'A comprehensive virtual mall and e-commerce ecosystem.',
    image: 'https://storage.googleapis.com/stella-images/studio-app-live/20240730-192538-422-online_shopping.png',
    aiHint: 'online shopping',
  },
];
