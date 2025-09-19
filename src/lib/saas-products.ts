import type { SaasCategory } from './saas-products.schema';

export const saasProducts: SaasCategory[] = [
  {
    name: 'Construction Tech',
    products: [
      { name: 'Smart PM SaaS', description: 'AI-based scheduling, Gantt charts, resource allocation, and document management.', stage: 'Live & Operating', status: 'Completed', category: 'Construction Tech', ready: true },
    ],
  },
  {
    name: 'Real Estate Tech',
    products: [
        { name: 'AI Property Valuator', description: 'Automates property appraisal using AI, considering location, size, amenities, and market trends for instant valuations.', stage: 'Live & Operating', status: 'Completed', category: 'Real Estate Tech', ready: true },
        { name: 'Smart Listing & Matching', description: 'AI matches buyers/tenants with best-fit properties based on preferences, lifestyle, and budget.', stage: 'Live & Operating', status: 'Completed', category: 'Real Estate Tech', ready: true },
    ]
  },
];

export const initialSaaSProducts = saasProducts;
