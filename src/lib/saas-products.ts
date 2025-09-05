
export interface SaaSProduct {
  name: string;
  description: string;
  stage: string;
  status: string;
  ready: boolean;
  category: string;
}

export interface SaasCategory {
    name: string;
    products: SaaSProduct[];
}

export const saasProducts: SaasCategory[] = [
    {
        name: 'Construction Tech',
        products: [
            { name: 'Smart PM SaaS', description: 'AI-based scheduling, Gantt charts, resource allocation, real-time collaboration, and document management.', stage: 'Development Phase', status: 'Completed', ready: true, category: 'Construction Tech' },
            { name: 'BidWise Estimator', description: 'Automated cost estimation (material, labor, equipment) and tender management platform with dynamic pricing.', stage: 'Testing Phase', status: 'On Track', ready: true, category: 'Construction Tech' },
            { name: 'SiteGuard Compliance', description: 'Mobile safety inspection app with AI image recognition for PPE violations and automated permit tracking.', stage: 'Design Phase', status: 'On Track', ready: true, category: 'Construction Tech' },
            { name: 'WorkforceFlow', description: 'AI-driven workforce scheduling, digital timecards with face recognition, and IoT equipment tracking.', stage: 'Live & Operating', status: 'Completed', ready: true, category: 'Construction Tech' },
            { name: 'ProcureChain SaaS', description: 'E-procurement platform with automated vendor approvals, asset rentals, and predictive ordering.', stage: 'Idea Phase', status: 'Completed', ready: true, category: 'Construction Tech' },
            { name: 'ConstructFin', description: 'Automated invoicing, expense tracking, AI-powered budget forecasting, and fraud detection for projects.', stage: 'Live & Operating', status: 'Completed', ready: true, category: 'Construction Tech' },
            { name: 'Digital Twin Ops', description: 'IoT platform for ongoing monitoring of building performance and predictive maintenance. (Conceptual)', stage: 'Idea Phase', status: 'On Track', ready: false, category: 'Construction Tech' },
            { name: 'AeroSite AI (DaaS)', description: 'Drone-as-a-Service for automated aerial surveys, progress tracking, and 3D terrain mapping. (Conceptual)', stage: 'Development Phase', status: 'At Risk', ready: false, category: 'Construction Tech' },
            { name: 'ClientView Portal', description: 'White-label dashboards for clients to see live project status, track payment milestones, and manage warranties.', stage: 'Live & Operating', status: 'Completed', ready: true, category: 'Construction Tech' },
            { name: 'BoQ Generator', description: 'Upload a floor plan and get an AI-generated preliminary Bill of Quantities for your project.', stage: 'Live & Operating', status: 'Completed', ready: true, category: 'Construction Tech' },
            { name: 'StructurAI BIM', description: 'AI-powered BIM for automated clash detection and material optimization. (Conceptual)', stage: 'Planning Phase', status: 'On Hold', ready: false, category: 'Construction Tech' }
        ]
    },
    {
        name: 'Real Estate Tech',
        products: [
            { name: 'AI Property Valuator', description: 'Automates property appraisal using AI, considering location, size, amenities, and market trends for instant valuations.', stage: 'Live & Operating', status: 'Completed', ready: true, category: 'Real Estate Tech' },
            { name: 'Smart Listing & Matching', description: 'AI matches buyers/tenants with best-fit properties based on preferences, lifestyle, and budget.', stage: 'Development Phase', status: 'On Track', ready: true, category: 'Real Estate Tech' },
            { name: '3D Virtual Tour SaaS', description: 'Offers 360° tours, AR/VR staging, and auto-generates furnished views of unfurnished properties.', stage: 'Launch Phase', status: 'On Track', ready: true, category: 'Real Estate Tech' },
            { name: 'DocuChain Compliance', description: 'Auto-generates sale agreements and tenancy contracts, tracking compliance with local laws and renewal dates.', stage: 'Live & Operating', status: 'Completed', ready: true, category: 'Real Estate Tech' },
            { name: 'SmartLease Manager', description: 'Automates online rent collection, reminders, and late fee calculations, including tenant background checks.', stage: 'Live & Operating', status: 'Completed', ready: true, category: 'Real Estate Tech' },
            { name: 'InvestiSight AI', description: 'Provides property ROI calculators, mortgage simulations, and rental yield forecasting with investment heatmaps.', stage: 'Validation Phase', status: 'On Hold', ready: true, category: 'Real Estate Tech' },
            { name: 'FacilityFlow SaaS', description: 'A streamlined platform for tenants to raise service tickets, with auto-assignment to vendors and resolution tracking.', stage: 'Planning Phase', status: 'On Track', ready: true, category: 'Real Estate Tech' },
            { name: 'PropToken Platform', description: 'Automates fractional property co-ownership via blockchain, with smart contracts for profit sharing and ownership transfer.', stage: 'Research Phase', status: 'On Track', ready: true, category: 'Real Estate Tech' },
            { name: 'Tenant Digital Briefcase', description: 'A one-stop app for users to manage their ID, contracts, utility bills, and insurance, with auto-reminders for renewals.', stage: 'Idea Phase', status: 'On Track', ready: true, category: 'Real Estate Tech' },
            { name: 'EcoBuild Certify', description: 'Automated energy usage tracking, water consumption, and carbon footprint reporting for sustainability compliance.', stage: 'Idea Phase', status: 'On Track', ready: true, category: 'Real Estate Tech' },
            { name: 'PANOSPACE', description: 'Immersive platform for virtual tours.', stage: 'Live & Operating', status: 'Completed', ready: true, category: 'Real Estate Tech' }
        ]
    },
    {
        name: 'Education Tech',
        products: [
            { name: 'EduFlow Suite', description: 'An all-in-one administrative automation platform for schools, featuring smart timetabling and automated admissions.', stage: 'Idea Phase', status: 'On Track', ready: true, category: 'Education Tech' },
            { name: 'CognitaLearn', description: 'A personalized adaptive learning platform that uses AI to create custom learning paths and gamified modules.', stage: 'Idea Phase', status: 'On Track', ready: false, category: 'Education Tech' },
            { name: 'Guardian AI', description: 'A student wellbeing and success platform offering risk profiling, AI career advisory, and mental health support.', stage: 'Idea Phase', status: 'On Track', ready: false, category: 'Education Tech' },
            { name: 'CertiTrust', description: 'A blockchain-based digital credentialing system combined with AI proctoring for secure, verifiable certificates.', stage: 'Idea Phase', status: 'On Track', ready: false, category: 'Education Tech' },
            { name: 'CampusOS', description: 'A smart campus management platform leveraging IoT for energy efficiency, space optimization, and predictive maintenance.', stage: 'Idea Phase', status: 'On Track', ready: false, category: 'Education Tech' }
        ]
    },
    {
        name: 'General Platforms & SaaS',
        products: [
            { name: 'ameen', description: 'A secure digital identity and authentication solution, expanding into a Smart Lost & Found Solution App.', stage: 'Live & Operating', status: 'Completed', ready: true, category: 'General Platforms & SaaS' },
            { name: 'APPI – عـبِّـي', description: 'An innovative mobile application that leverages AI/Deeptech and IoT to provide real-time, personalized insights into household utility consumption.', stage: 'In Development', status: 'On Track', ready: true, category: 'General Platforms & SaaS' },
            { name: 'KHIDMA', description: 'A revolutionary AI/Deep-tech powered mobile application that acts as a dynamic marketplace connecting service seekers with qualified providers.', stage: 'In Development', status: 'On Track', ready: true, category: 'General Platforms & SaaS' },
            { name: 'VMALL', description: 'A revolutionary Web & Mobile application that leverages VR and AR to create immersive shopping experiences.', stage: 'In Development', status: 'On Track', ready: true, category: 'General Platforms & SaaS' },
            { name: 'Logistics Chain AI', description: 'AI model to optimize supply chain and logistics for local and regional distributors.', stage: 'In Development', status: 'On Track', ready: true, category: 'General Platforms & SaaS' },
            { name: 'RAAHA', description: 'An AI-powered, white-label SaaS platform for domestic workforce agencies to streamline recruitment and management.', stage: 'Live & Operating', status: 'Completed', ready: true, category: 'General Platforms & SaaS' },
            { name: 'Nova Commerce', description: 'End-to-end solutions to build, manage, and scale your online business.', stage: 'Live & Operating', status: 'Completed', ready: true, category: 'General Platforms & SaaS' },
            { name: 'AlumniConnect', description: 'A comprehensive digital platform for universities to engage their alumni network.', stage: 'Research Phase', status: 'On Track', ready: false, category: 'General Platforms & SaaS' },
            { name: 'Hadeeya', description: 'A sophisticated prepaid digital gift card platform for individuals and corporate clients.', stage: 'Research Phase', status: 'On Track', ready: false, category: 'General Platforms & SaaS' }
        ]
    },
    {
        name: 'AI & Creative Tools',
        products: [
            { name: 'AI Interior Designer', description: 'Upload a photo of your room and get instant interior design ideas powered by AI.', stage: 'Live & Operating', status: 'Completed', ready: true, category: 'AI & Creative Tools' },
            { name: 'AI PDF Form Filler', description: 'Upload any PDF form and let our AI intelligently fill it out based on your profile data.', stage: 'Idea Phase', status: 'On Track', ready: false, category: 'AI & Creative Tools' },
            { name: 'AI-POS for Education', description: 'A smart, AI-driven Point-of-Sale system for university canteens or school stores.', stage: 'Research Phase', status: 'On Track', ready: false, category: 'AI & Creative Tools' }
        ]
    }
];
