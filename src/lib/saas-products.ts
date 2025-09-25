

import type { SaasCategory } from './saas-products.schema';

export const saasProducts: SaasCategory[] = [
    {
        name: 'Construction Tech',
        products: [
            { name: "Smart PM SaaS", description: "AI-based scheduling and resource allocation.", stage: "Live & Operating", category: "Construction Tech", status: "Completed", ready: true },
            { name: "BidWise Estimator", description: "Automated cost estimation and tender management.", stage: "Live & Operating", category: "Construction Tech", status: "Completed", ready: true },
            { name: "SiteGuard Compliance", description: "Mobile safety inspection app with AI image recognition.", stage: "Live & Operating", category: "Construction Tech", status: "Completed", ready: true },
            { name: "WorkforceFlow", description: "AI-driven workforce scheduling and digital timecards.", stage: "Live & Operating", category: "Construction Tech", status: "Completed", ready: true },
            { name: "ProcureChain SaaS", description: "E-procurement platform with predictive ordering.", stage: "Live & Operating", category: "Construction Tech", status: "Completed", ready: true },
            { name: "ConstructFin", description: "Automated invoicing and AI-powered budget forecasting.", stage: "Live & Operating", category: "Construction Tech", status: "Completed", ready: true },
            { name: "Digital Twin Ops", description: "IoT platform for monitoring building performance.", stage: "Live & Operating", category: "Construction Tech", status: "Completed", ready: false },
            { name: "AeroSite AI (DaaS)", description: "Drone-as-a-Service for automated aerial surveys.", stage: "Live & Operating", category: "Construction Tech", status: "Completed", ready: false },
            { name: "ClientView Portal", description: "White-label dashboards for clients to see live project status.", stage: "Live & Operating", category: "Construction Tech", status: "Completed", ready: true },
            { name: "BoQ Generator", description: "AI-generated Bill of Quantities from floor plans.", stage: "Live & Operating", category: "Construction Tech", status: "Completed", ready: true },
            { name: "StructurAI BIM", description: "AI-powered BIM for automated clash detection.", stage: "In Development", category: "Construction Tech", status: "On Track", ready: false },
            { name: "AI Smart Home Estimator", description: "AI-powered tool to estimate costs for smart home installations.", stage: "Live & Operating", category: "Construction Tech", status: "Completed", ready: true },
        ]
    },
    {
        name: 'Real Estate Tech',
        products: [
            { name: "AI Property Valuator", description: "Automates property appraisal using AI.", stage: "Live & Operating", category: "Real Estate Tech", status: "Completed", ready: true },
            { name: "Smart Listing & Matching", description: "AI matches buyers/tenants with properties.", stage: "Live & Operating", category: "Real Estate Tech", status: "Completed", ready: true },
            { name: "3D Virtual Tour SaaS", description: "Offers 360° tours and AR/VR staging.", stage: "Live & Operating", category: "Real Estate Tech", status: "Completed", ready: true },
            { name: "DocuChain Compliance", description: "Auto-generates sale and tenancy agreements.", stage: "Live & Operating", category: "Real Estate Tech", status: "Completed", ready: true },
            { name: "SmartLease Manager", description: "Automates rent collection and reminders.", stage: "Live & Operating", category: "Real Estate Tech", status: "Completed", ready: true },
            { name: "InvestiSight AI", description: "Property ROI calculators and mortgage simulations.", stage: "Live & Operating", category: "Real Estate Tech", status: "Completed", ready: true },
            { name: "FacilityFlow SaaS", description: "Streamlined platform for tenant service tickets.", stage: "Live & Operating", category: "Real Estate Tech", status: "Completed", ready: true },
            { name: "PropToken Platform", description: "Fractional property co-ownership via blockchain.", stage: "Live & Operating", category: "Real Estate Tech", status: "Completed", ready: false },
            { name: "Tenant Digital Briefcase", description: "App for managing personal documents and bills.", stage: "Live & Operating", category: "Real Estate Tech", status: "Completed", ready: false },
            { name: "EcoBuild Certify", description: "Automated sustainability compliance reporting.", stage: "Live & Operating", category: "Real Estate Tech", status: "Completed", ready: false },
            { name: "PANOSPACE", description: "Immersive platform for virtual tours.", stage: "Live & Operating", category: "Real Estate Tech", status: "Completed", ready: true },
            { name: "StairSpace", description: "Marketplace for renting under-stair and micro-retail spaces.", stage: "Live & Operating", category: "Real Estate Tech", status: "Completed", ready: true },
        ]
    },
    {
        name: 'Education Tech',
        products: [
            { name: "EduFlow Suite", description: "All-in-one administrative automation for schools.", stage: "Live & Operating", category: "Education Tech", status: "Completed", ready: true },
            { name: "CognitaLearn", description: "Personalized adaptive learning platform.", stage: "Live & Operating", category: "Education Tech", status: "Completed", ready: true },
            { name: "Guardian AI", description: "Student wellbeing and career advisory platform.", stage: "Live & Operating", category: "Education Tech", status: "Completed", ready: true },
            { name: "CertiTrust", description: "Blockchain-based digital credentialing and AI proctoring.", stage: "Live & Operating", category: "Education Tech", status: "Completed", ready: false },
            { name: "CampusOS", description: "Smart campus management platform using IoT.", stage: "Live & Operating", category: "Education Tech", status: "Completed", ready: false },
            { name: "AI Scholarship Finder", description: "AI tool to find scholarships based on student profile.", stage: "Live & Operating", category: "Education Tech", status: "Completed", ready: true },
            { name: "Teacher Toolkit", description: "Tools for educators, including a Lesson Gamifier.", stage: "Live & Operating", category: "Education Tech", status: "Completed", ready: true },
        ]
    },
    {
        name: "Automotive Tech",
        products: [
             { name: "DriveSync AI", description: "AI-powered SaaS platform for car rental agencies.", stage: "Live & Operating", category: "Automotive Tech", status: "Completed", ready: true },
        ]
    },
     {
        name: "Fintech",
        products: [
             { name: "Fintech Super-App", description: "Integrated financial services app with AI auditing.", stage: "Live & Operating", category: "Fintech", status: "Completed", ready: true },
        ]
    },
    {
        name: "Gaming & Social",
        products: [
             { name: "We Match - MATCH CUP GAME", description: "Immersive AR social game for real-world challenges.", stage: "Research Phase", category: "Gaming & Social", status: "On Track", ready: false },
        ]
    },
     {
        name: "Beauty & Wellness",
        products: [
             { name: "Beauty & Wellness Hub", description: "SaaS solution for salons and spas.", stage: "Live & Operating", category: "Beauty & Wellness", status: "Completed", ready: true },
        ]
    },
    {
        name: "General Platforms & SaaS",
        products: [
            { name: "ameen", description: "Secure digital identity and Smart Lost & Found.", stage: "Live & Operating", category: "General Platforms & SaaS", status: "Completed", ready: true },
            { name: "APPI – عـبِّـي", description: "Real-time insights into household utility consumption.", stage: "In Development", category: "General Platforms & SaaS", status: "On Track", ready: false },
            { name: "KHIDMA", description: "AI-powered marketplace for service seekers and providers.", stage: "Live & Operating", category: "General Platforms & SaaS", status: "Completed", ready: true },
            { name: "VMALL", description: "Immersive VR/AR shopping experiences.", stage: "In Development", category: "General Platforms & SaaS", status: "On Track", ready: false },
            { name: "Logistics Chain AI", description: "AI model to optimize supply chains.", stage: "In Development", category: "General Platforms & SaaS", status: "On Track", ready: false },
            { name: "RAAHA", description: "White-label SaaS platform for domestic workforce agencies.", stage: "Live & Operating", category: "General Platforms & SaaS", status: "Completed", ready: true },
            { name: "Nova Commerce", description: "End-to-end e-commerce solutions.", stage: "Live & Operating", category: "General Platforms & SaaS", status: "Completed", ready: true },
            { name: "AlumniConnect", description: "Digital platform for university alumni networks.", stage: "Live & Operating", category: "General Platforms & SaaS", status: "Completed", ready: true },
            { name: "Hadeeya", description: "Digital gift card platform.", stage: "Live & Operating", category: "General Platforms & SaaS", status: "Completed", ready: true },
            { name: "StockClear", description: "B2B marketplace for liquidating overstock goods.", stage: "Live & Operating", category: "General Platforms & SaaS", status: "Completed", ready: true },
            { name: "Professional Hub", description: "Digital platform connecting trainers and educators with local markets.", stage: "Live & Operating", category: "General Platforms & SaaS", status: "Completed", ready: true },
        ]
    },
    {
        name: "AI & Creative Tools",
        products: [
            { name: "AI Interior Designer", description: "Generates interior design ideas from photos.", stage: "Live & Operating", category: "AI & Creative Tools", status: "Completed", ready: true },
            { name: "AI PDF Form Filler", description: "Intelligently fills PDF forms from profile data.", stage: "Live & Operating", category: "AI & Creative Tools", status: "Completed", ready: true },
            { name: "AI-POS", description: "Smart Point-of-Sale system for small shops.", stage: "Live & Operating", category: "AI & Creative Tools", status: "Completed", ready: true },
            { name: "Facebook Cover Generator", description: "AI tool to generate Facebook cover images.", stage: "Live & Operating", category: "AI & Creative Tools", status: "Completed", ready: true },
        ]
    }
];
