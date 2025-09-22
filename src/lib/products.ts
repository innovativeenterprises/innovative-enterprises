
import type { Product } from './products.schema';

export const initialStoreProducts: Product[] = [
    {
        id: 1,
        name: "AI-Powered Smart Camera",
        description: "A high-resolution security camera with onboard AI for object detection and intelligent alerts.",
        stage: "Live & Operating",
        category: "Electronics",
        price: 79.900,
        image: "https://images.unsplash.com/photo-1588052163994-b3d5b9b8c253?q=80&w=600&auto=format&fit=crop",
        aiHint: "smart camera",
        rating: 4.8,
        enabled: true,
        adminStatus: 'Completed',
    },
    {
        id: 2,
        name: "VR Headset 'PANOSPACE'",
        description: "Experience immersive virtual reality with our flagship VR headset, PANOSPACE. Perfect for gaming, virtual tours, and professional training.",
        stage: "Live & Operating",
        category: "Electronics",
        price: 189.900,
        image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=600&auto=format&fit=crop",
        aiHint: "vr headset",
        rating: 4.9,
        enabled: true,
        adminStatus: 'Completed',
    }
];

export const saasProducts = [
    {
        name: "Construction Tech",
        products: [
            { name: "Smart PM SaaS", description: "AI-based scheduling, Gantt charts, resource allocation, real-time collaboration, and document management.", stage: "Live & Operating", category: "Construction Tech", status: "Completed" },
            { name: "BidWise Estimator", description: "Automated cost estimation (material, labor, equipment) and tender management platform with dynamic pricing.", stage: "Live & Operating", category: "Construction Tech", status: "Completed" },
            { name: "SiteGuard Compliance", description: "Mobile safety inspection app with AI image recognition for PPE violations and automated permit tracking.", stage: "Live & Operating", category: "Construction Tech", status: "Completed" },
            { name: "WorkforceFlow", description: "AI-driven workforce scheduling, digital timecards with face recognition, and IoT equipment tracking.", stage: "Live & Operating", category: "Construction Tech", status: "Completed" },
            { name: "ProcureChain SaaS", description: "E-procurement platform with automated vendor approvals, asset rentals, and predictive ordering.", stage: "Live & Operating", category: "Construction Tech", status: "Completed" },
            { name: "ConstructFin", description: "Automated invoicing, expense tracking, AI-powered budget forecasting, and fraud detection for projects.", stage: "Live & Operating", category: "Construction Tech", status: "Completed" },
            { name: "Digital Twin Ops", description: "IoT platform for ongoing monitoring of building performance and predictive maintenance.", stage: "Live & Operating", category: "Construction Tech", status: "Completed" },
            { name: "AeroSite AI (DaaS)", description: "Drone-as-a-Service for automated aerial surveys, progress tracking, and 3D terrain mapping.", stage: "Live & Operating", category: "Construction Tech", status: "Completed" },
            { name: "ClientView Portal", description: "White-label dashboards for clients to see live project status, track payment milestones, and manage warranties.", stage: "Live & Operating", category: "Construction Tech", status: "Completed" },
            { name: "BoQ Generator", description: "Upload a floor plan and get an AI-generated preliminary Bill of Quantities for your project.", stage: "Live & Operating", category: "Construction Tech", status: "Completed" },
        ],
    },
    // Other categories can be added here following the same structure
];


const allSaaSProducts = saasProducts.flatMap(category => category.products);


export const initialProducts: Product[] = allSaaSProducts.map((p, index) => ({
    id: index + 1,
    name: p.name,
    description: p.description,
    stage: p.stage,
    category: p.category,
    price: 0,
    image: "https://placehold.co/600x400/293462/F0F4F8?text=Product",
    aiHint: "product image",
    rating: 0,
    enabled: p.status === 'Completed' || p.stage === 'Live & Operating',
    adminStatus: p.status,
    href: '#',
}));
