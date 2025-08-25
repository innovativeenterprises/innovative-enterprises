
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
    image: 'https://placehold.co/400x300.png',
    aiHint: 'virtual reality',
  },
  {
    id: 'prod_2',
    name: 'ameen',
    description: 'A secure digital identity and authentication solution.',
    image: 'https://placehold.co/400x300.png',
    aiHint: 'security shield',
  },
  {
    id: 'prod_3',
    name: 'APPI',
    description: 'An intuitive API management and integration platform.',
    image: 'https://placehold.co/400x300.png',
    aiHint: 'api integration',
  },
  {
    id: 'prod_4',
    name: 'KHIDMAAI',
    description: 'AI-powered customer service and support automation tool.',
    image: 'https://placehold.co/400x300.png',
    aiHint: 'chatbot ai',
  },
  {
    id: 'prod_5',
    name: 'VMALL',
    description: 'A comprehensive virtual mall and e-commerce ecosystem.',
    image: 'https://placehold.co/400x300.png',
    aiHint: 'online shopping',
  },
];
