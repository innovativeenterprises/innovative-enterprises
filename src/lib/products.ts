
import type { Product } from './products.schema';
import { saasProducts } from '@/lib/saas-products';


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

const allSaaSProducts = saasProducts.flatMap(category => category.products);

const hrefMap: Record<string, string> = {
    "PANOSPACE": "/real-estate-tech/virtual-tour",
    "ameen": "/ameen",
    "APPI – عـبِّـي": "/appi",
    "KHIDMA": "/khidma",
    "VMALL": "/vmall",
    "BidWise Estimator": "/construction-tech/bid-estimator",
    "AI Property Valuator": "/real-estate-tech/property-valuator",
    "DocuChain Compliance": "/real-estate-tech/docu-chain",
    "SmartLease Manager": "/real-estate-tech/smart-lease-manager",
    "InvestiSight AI": "/real-estate-tech/investisight",
    "EduFlow Suite": "/education-tech/eduflow",
    "CognitaLearn": "/education-tech/cognita-learn",
    "Guardian AI": "/education-tech/guardian-ai",
    "CertiTrust": "/education-tech/certitrust",
    "CampusOS": "/education-tech/campus-os",
    "BoQ Generator": "/construction-tech/quantity-calculator",
    "Fire & Safety Estimator": "/construction-tech/fire-safety-estimator",
    "SiteGuard Compliance": "/construction-tech/site-guard",
    "WorkforceFlow": "/construction-tech/workforce-scheduler",
    "FacilityFlow SaaS": "/real-estate-tech/facility-flow",
    "AeroSite AI (DaaS)": "/construction-tech/aero-site",
    "Digital Twin Ops": "/construction-tech/digital-twin",
    "EcoBuild Certify": "/real-estate-tech/ecobuild-certify",
    "PropToken Platform": "/real-estate-tech/proptoken-platform",
    "Tenant Digital Briefcase": "/real-estate-tech/tenant-briefcase",
    "AI Scholarship Finder": "/education-tech/scholarships",
    "Teacher Toolkit": "/education-tech/lesson-gamifier",
    "AlumniConnect": "/education-tech/alumni-connect",
    "AI Interior Designer": "/interior-designer",
    "AI PDF Form Filler": "/pdf-form-filler",
    "ProcureChain SaaS": "/construction-tech/procurechain",
    "DriveSync AI": "/drivesync-ai",
    "Fintech Super-App": "/cfo",
    "Beauty & Wellness Hub": "/beauty-hub",
    "Professional Hub": "/professional-hub",
    "StockClear": "/stock-clear",
    "Hadeeya": "/hadeeya",
    "RAAHA": "/raaha",
    "Nova Commerce": "/ecommerce",
};

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
    href: hrefMap[p.name] || '#',
}));
