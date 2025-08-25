
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
    image: 'https://images.unsplash.com/photo-1593342371934-08a6e87906d9?q=80&w=1920&auto=format&fit=crop',
    aiHint: 'virtual reality',
  },
  {
    id: 'prod_2',
    name: 'ameen',
    description: 'A secure digital identity and authentication solution.',
    image: 'https://images.unsplash.com/photo-1550751827-4138d04d475d?q=80&w=1920&auto=format&fit=crop',
    aiHint: 'security shield',
  },
  {
    id: 'prod_3',
    name: 'APPI',
    description: 'An intuitive API management and integration platform.',
    image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=1920&auto=format&fit=crop',
    aiHint: 'api integration',
  },
  {
    id: 'prod_4',
    name: 'KHIDMAAI',
    description: 'AI-powered customer service and support automation tool.',
    image: 'https://images.unsplash.com/photo-1516110833944-245a44a10a58?q=80&w=1920&auto=format&fit=crop',
    aiHint: 'chatbot ai',
  },
  {
    id: 'prod_5',
    name: 'VMALL',
    description: 'A comprehensive virtual mall and e-commerce ecosystem.',
    image: 'https://images.unsplash.com/photo-1570857502809-0c8936733934?q=80&w=1920&auto=format&fit=crop',
    aiHint: 'online shopping',
  },
];
