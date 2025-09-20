
import type { Product } from './products.schema';

export interface SaaSProduct {
    name: string;
    description: string;
    stage: 'Live & Operating' | 'In Development' | 'Planning Phase' | 'Research Phase' | 'Idea Phase' | 'Testing Phase';
    status: 'Completed' | 'On Track' | 'At Risk' | 'On Hold';
    category: 'Construction Tech' | 'Real Estate Tech' | 'Education Tech' | 'Automotive Tech' | 'Fintech' | 'Gaming & Social' | 'Beauty & Wellness' | 'General Platforms & SaaS' | 'AI & Creative Tools';
    ready: boolean;
}

export interface SaasCategory {
    name: 'Construction Tech' | 'Real Estate Tech' | 'Education Tech' | 'Automotive Tech' | 'Fintech' | 'Gaming & Social' | 'Beauty & Wellness' | 'General Platforms & SaaS' | 'AI & Creative Tools';
    products: SaaSProduct[];
}

export const saasProducts: SaasCategory[] = [
    {
        name: 'Construction Tech',
        products: [
            { name: 'Smart PM SaaS', description: 'AI-based scheduling, Gantt charts, resource allocation, real-time collaboration, and document management.', stage: 'Live & Operating', status: 'Completed', category: 'Construction Tech', ready: true },
            { name: 'BidWise Estimator', description: 'Automated cost estimation (material, labor, equipment) and tender management platform with dynamic pricing.', stage: 'Live & Operating', status: 'Completed', category: 'Construction Tech', ready: true },
            { name: 'SiteGuard Compliance', description: 'Mobile safety inspection app with AI image recognition for PPE violations and automated permit tracking.', stage: 'Live & Operating', status: 'Completed', category: 'Construction Tech', ready: true },
            { name: 'WorkforceFlow', description: 'AI-driven workforce scheduling, digital timecards with face recognition, and IoT equipment tracking.', stage: 'Live & Operating', status: 'Completed', category: 'Construction Tech', ready: true },
            { name: 'ProcureChain SaaS', description: 'E-procurement platform with automated vendor approvals, asset rentals, and predictive ordering.', stage: 'Live & Operating', status: 'Completed', category: 'Construction Tech', ready: true },
            { name: 'ConstructFin', description: 'Automated invoicing, expense tracking, AI-powered budget forecasting, and fraud detection for projects.', stage: 'Live & Operating', status: 'Completed', category: 'Construction Tech', ready: true },
            { name: 'Digital Twin Ops', description: 'IoT platform for ongoing monitoring of building performance and predictive maintenance.', stage: 'Live & Operating', status: 'Completed', category: 'Construction Tech', ready: true },
            { name: 'AeroSite AI (DaaS)', description: 'Drone-as-a-Service for automated aerial surveys, progress tracking, and 3D terrain mapping.', stage: 'Live & Operating', status: 'Completed', category: 'Construction Tech', ready: true },
            { name: 'ClientView Portal', description: 'White-label dashboards for clients to see live project status, track payment milestones, and manage warranties.', stage: 'Live & Operating', status: 'Completed', category: 'Construction Tech', ready: true },
            { name: 'BoQ Generator', description: 'Upload a floor plan and get an AI-generated preliminary Bill of Quantities for your project.', stage: 'Live & Operating', status: 'Completed', category: 'Construction Tech', ready: true },
            { name: 'StructurAI BIM', description: 'AI-powered BIM for automated clash detection and material optimization. (Conceptual)', stage: 'Planning Phase', status: 'On Hold', category: 'Construction Tech', ready: false },
        ]
    },
    {
        name: 'Real Estate Tech',
        products: [
            { name: 'AI Property Valuator', description: 'Automates property appraisal using AI, considering location, size, amenities, and market trends for instant valuations.', stage: 'Live & Operating', status: 'Completed', category: 'Real Estate Tech', ready: true },
            { name: 'Smart Listing & Matching', description: 'AI matches buyers/tenants with best-fit properties based on preferences, lifestyle, and budget.', stage: 'Live & Operating', status: 'Completed', category: 'Real Estate Tech', ready: true },
            { name: '3D Virtual Tour SaaS', description: 'Offers 360° tours, AR/VR staging, and auto-generates furnished views of unfurnished properties.', stage: 'Live & Operating', status: 'Completed', category: 'Real Estate Tech', ready: true },
            { name: 'DocuChain Compliance', description: 'Auto-generates sale agreements and tenancy contracts, tracking compliance with local laws and renewal dates.', stage: 'Live & Operating', status: 'Completed', category: 'Real Estate Tech', ready: true },
            { name: 'SmartLease Manager', description: 'Automates online rent collection, reminders, and late fee calculations, including tenant background checks.', stage: 'Live & Operating', status: 'Completed', category: 'Real Estate Tech', ready: true },
            { name: 'InvestiSight AI', description: 'Provides property ROI calculators, mortgage simulations, and rental yield forecasting with investment heatmaps.', stage: 'Live & Operating', status: 'Completed', category: 'Real Estate Tech', ready: true },
            { name: 'FacilityFlow SaaS', description: 'A streamlined platform for tenants to raise service tickets, with auto-assignment to vendors and resolution tracking.', stage: 'Live & Operating', status: 'Completed', category: 'Real Estate Tech', ready: true },
            { name: 'PropToken Platform', description: 'Automates fractional property co-ownership via blockchain, with smart contracts for profit sharing and ownership transfer.', stage: 'Live & Operating', status: 'Completed', category: 'Real Estate Tech', ready: true },
            { name: 'Tenant Digital Briefcase', description: 'A one-stop app for users to manage their ID, contracts, utility bills, and insurance, with auto-reminders for renewals.', stage: 'Live & Operating', status: 'Completed', category: 'Real Estate Tech', ready: true },
            { name: 'EcoBuild Certify', description: 'Automated energy usage tracking, water consumption, and carbon footprint reporting for sustainability compliance.', stage: 'Live & Operating', status: 'Completed', category: 'Real Estate Tech', ready: true },
            { name: 'PANOSPACE', description: 'Immersive platform for virtual tours.', stage: 'Live & Operating', status: 'Completed', category: 'Real Estate Tech', ready: true },
            { name: 'StairSpace', description: 'A marketplace that turns unused under-stair spaces into rentable micro-business spots for individuals and small businesses.', stage: 'Live & Operating', status: 'Completed', category: 'Real Estate Tech', ready: true },
        ]
    },
    {
        name: 'Education Tech',
        products: [
            { name: 'EduFlow Suite', description: 'An all-in-one administrative automation platform for schools, featuring smart timetabling and automated admissions.', stage: 'Live & Operating', status: 'Completed', category: 'Education Tech', ready: true },
            { name: 'CognitaLearn', description: 'A personalized adaptive learning platform that uses AI to create custom learning paths and gamified modules.', stage: 'Live & Operating', status: 'Completed', category: 'Education Tech', ready: true },
            { name: 'Guardian AI', description: 'A student wellbeing and success platform offering risk profiling, AI career advisory, and mental health support.', stage: 'Live & Operating', status: 'Completed', category: 'Education Tech', ready: true },
            { name: 'CertiTrust', description: 'A blockchain-based digital credentialing system combined with AI proctoring for secure, verifiable certificates.', stage: 'Live & Operating', status: 'Completed', category: 'Education Tech', ready: true },
            { name: 'CampusOS', description: 'A smart campus management platform leveraging IoT for energy efficiency, space optimization, and predictive maintenance.', stage: 'Live & Operating', status: 'Completed', category: 'Education Tech', ready: true },
            { name: 'AI Scholarship Finder', description: "An AI-powered tool that searches the web for scholarship opportunities based on a student's field of study and academic level.", stage: 'Live & Operating', status: 'Completed', category: 'Education Tech', ready: true },
            { name: 'Teacher Toolkit', description: 'A suite of tools for educators, including a Lesson Gamifier to convert textbooks into interactive content, flashcards, and presentations.', stage: 'Live & Operating', status: 'Completed', category: 'Education Tech', ready: true },
        ]
    },
    {
        name: 'Automotive Tech',
        products: [
            { name: 'DriveSync AI', description: 'An AI-powered SaaS platform for car rental agencies, featuring an intelligent booking agent, fleet management, and integration with IVMS (In-Vehicle Monitoring Systems) for real-time tracking.', stage: 'Live & Operating', status: 'Completed', category: 'Automotive Tech', ready: true },
        ]
    },
    {
        name: 'Fintech',
        products: [
            { name: 'Fintech Super-App', description: 'An integrated financial services application providing AI-driven auditing, financial analysis, and CFO dashboard capabilities.', stage: 'Live & Operating', status: 'Completed', category: 'Fintech', ready: true },
        ]
    },
    {
        name: 'Gaming & Social',
        products: [
             { name: 'We Match - MATCH CUP GAME', description: 'An immersive Augmented Reality (AR) social game designed to connect people through interactive, real-world challenges and competitions.', stage: 'Research Phase', status: 'On Track', category: 'Gaming & Social', ready: false },
        ]
    },
    {
        name: 'Beauty & Wellness',
        products: [
            { name: 'Beauty & Wellness Hub', description: 'A complete SaaS solution for salons, spas, and barbershops to manage appointments, staff, services, and client relationships.', stage: 'Live & Operating', status: 'Completed', category: 'Beauty & Wellness', ready: true },
        ]
    },
    {
        name: 'General Platforms & SaaS',
        products: [
            { name: 'ameen', description: 'A secure digital identity and authentication solution, expanding into a Smart Lost & Found Solution App.', stage: 'Live & Operating', status: 'Completed', category: 'General Platforms & SaaS', ready: true },
            { name: 'APPI – عـبِّـي', description: 'An innovative mobile application that leverages AI/Deeptech and IoT to provide real-time, personalized insights into household utility consumption.', stage: 'In Development', status: 'On Track', category: 'General Platforms & SaaS', ready: false },
            { name: 'KHIDMA', description: 'A revolutionary AI/Deep-tech powered mobile application that acts as a dynamic marketplace connecting service seekers with qualified providers.', stage: 'Live & Operating', status: 'Completed', category: 'General Platforms & SaaS', ready: true },
            { name: 'VMALL', description: 'A revolutionary Web & Mobile application that leverages VR and AR to create immersive shopping experiences.', stage: 'In Development', status: 'On Track', category: 'General Platforms & SaaS', ready: false },
            { name: 'Logistics Chain AI', description: 'AI model to optimize supply chain and logistics for local and regional distributors.', stage: 'In Development', status: 'On Track', category: 'General Platforms & SaaS', ready: false },
            { name: 'RAAHA', description: 'An AI-powered, white-label SaaS platform for domestic workforce agencies to streamline recruitment and management.', stage: 'Live & Operating', status: 'Completed', category: 'General Platforms & SaaS', ready: true },
            { name: 'Nova Commerce', description: 'End-to-end solutions to build, manage, and scale your online business.', stage: 'Live & Operating', status: 'Completed', category: 'General Platforms & SaaS', ready: true },
            { name: 'AlumniConnect', description: 'A comprehensive digital platform for universities to engage their alumni network.', stage: 'Live & Operating', status: 'Completed', category: 'General Platforms & SaaS', ready: true },
            { name: 'Hadeeya', description: 'A sophisticated prepaid digital gift card platform for individuals and corporate clients.', stage: 'Live & Operating', status: 'Completed', category: 'General Platforms & SaaS', ready: true },
            { name: 'StockClear', description: 'B2B marketplace for wholesalers and retailers to liquidate excess or near-expiry stock through auctions and bulk sales.', stage: 'Live & Operating', status: 'Completed', category: 'General Platforms & SaaS', ready: true },
            { name: 'Professional Hub', description: 'A digital platform connecting trainers, educators, and professionals with their local markets, offering tools for marketing and networking.', stage: 'Live & Operating', status: 'Completed', category: 'General Platforms & SaaS', ready: true },
        ]
    },
    {
        name: 'AI & Creative Tools',
        products: [
            { name: 'AI Interior Designer', description: 'Upload a photo of your room and get instant interior design ideas powered by AI.', stage: 'Live & Operating', status: 'Completed', category: 'AI & Creative Tools', ready: true },
            { name: 'AI PDF Form Filler', description: 'Upload any PDF form and let our AI intelligently fill it out based on your profile data.', stage: 'Live & Operating', status: 'Completed', category: 'AI & Creative Tools', ready: true },
            { name: 'AI-POS', description: 'A smart, AI-driven Point-of-Sale system for small shops and groceries, providing inventory management and sales analytics without needing expensive hardware.', stage: 'Live & Operating', status: 'Completed', category: 'AI & Creative Tools', ready: true },
        ]
    }
];
