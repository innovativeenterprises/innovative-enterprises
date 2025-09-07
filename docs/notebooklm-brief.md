# Project Brief: Innovative Enterprises AI-Powered Business Platform

**Document Purpose:** This document serves as a comprehensive, centralized source of truth for the Innovative Enterprises project, intended for use with AI analysis tools like Google NotebookLM.

---

## 1. Core Idea & Vision

**Vision:** To create a comprehensive, AI-powered business services platform for the Omani and GCC market that automates key operations, connects a network of service providers, and provides a suite of intelligent tools to enhance business productivity and digital transformation.

**Core Problem:** Omani Small and Medium Enterprises (SMEs) face significant operational friction due to manual, paper-based processes, a fragmented service provider market, and limited access to affordable, advanced technology, which hinders their growth and ability to compete.

**Proposed Solution:** A one-stop-shop digital platform that integrates three core pillars:
1.  **Service Marketplaces:** A "Sanad Hub" for government services and a "Business Hub" for B2B/B2C projects.
2.  **AI Workforce:** A suite of specialized AI agents (Aida, Voxi, Hira, etc.) to automate tasks like document translation, legal analysis, and marketing content creation.
3.  **Partner Ecosystem:** A secure "E-Briefcase" and AI-assisted onboarding to empower our network of freelancers, subcontractors, and service providers.

---

## 2. Technical Architecture & Stack

The platform is a monolithic **Next.js 14+ (App Router)** application serving both the frontend and backend.

-   **Frontend:**
    -   **Framework:** Next.js (App Router)
    -   **Language:** TypeScript
    -   **UI Components:** ShadCN UI built on Radix UI.
    -   **Styling:** Tailwind CSS.
    -   **State Management:** A simple global store (`src/lib/global-store.ts`) for prototype state, supplemented by React Context and hooks.

-   **Backend & AI:**
    -   **Framework:** Genkit (TypeScript)
    -   **Deployment:** AI flows are deployed as serverless Cloud Functions for Firebase.
    -   **AI Model Provider:** Google AI (`@genkit-ai/googleai`), utilizing various Gemini models for text, vision, and image generation.

-   **Database & Auth:**
    -   **Database:** Cloud Firestore (NoSQL) for all application data.
    -   **Authentication:** Firebase Authentication (Email/Password, Google OAuth, and a custom WhatsApp OTP flow).
    -   **Storage:** Cloud Storage for Firebase for all user-uploaded files.

-   **Deployment:** Firebase App Hosting.

---

## 3. Key Data Models (Firestore Collections)

-   **`users`**: Stores user profile information.
-   **`providers`**: Profiles for freelancers, subcontractors, and partners.
-   **`sanad_offices`**: Profiles for registered Sanad Centre partners.
-   **`opportunities`**: Publicly posted tasks, projects, and competitions.
-   **`products`**: Data for the e-commerce store (Nova Commerce).
-   **`services`**: Configuration for services shown on the homepage.
-   **`knowledgeBase`**: Stores documents used to train AI agents.

---

## 4. Full Feature & Agent List

### 4.1. Digital Products & SaaS Platforms (39 Total)

#### Construction Tech (11)
-   **Smart PM SaaS:** AI-based project management.
-   **BidWise Estimator:** Automated cost estimation and tender management.
-   **SiteGuard Compliance:** Mobile safety inspection app with AI image recognition.
-   **WorkforceFlow:** AI-driven workforce scheduling and digital timecards.
-   **ProcureChain SaaS:** E-procurement platform with predictive ordering.
-   **ConstructFin:** Automated invoicing and AI-powered budget forecasting.
-   **Digital Twin Ops:** IoT platform for monitoring building performance.
-   **AeroSite AI (DaaS):** Drone-as-a-Service for automated aerial surveys.
-   **ClientView Portal:** White-label dashboards for clients.
-   **BoQ Generator:** AI-generated Bill of Quantities from floor plans.
-   **StructurAI BIM:** AI-powered BIM for automated clash detection.

#### Real Estate Tech (12)
-   **AI Property Valuator:** Instant property appraisals using AI.
-   **Smart Listing & Matching:** AI matches buyers/tenants with properties.
-   **3D Virtual Tour SaaS:** 360° tours and AR/VR staging.
-   **DocuChain Compliance:** Auto-generates sale and tenancy agreements.
-   **SmartLease Manager:** Automates rent collection and reminders.
-   **InvestiSight AI:** Property ROI calculators and mortgage simulations.
-   **FacilityFlow SaaS:** Streamlined platform for tenant service tickets.
-   **PropToken Platform:** Fractional property co-ownership via blockchain.
-   **Tenant Digital Briefcase:** App for managing personal documents and bills.
-   **EcoBuild Certify:** Automated sustainability compliance reporting.
-   **PANOSPACE:** Immersive platform for virtual tours.
-   **StairSpace:** Marketplace for renting under-stair and micro-retail spaces.

#### Education Tech (5)
-   **EduFlow Suite:** All-in-one administrative automation for schools.
-   **CognitaLearn:** Personalized adaptive learning platform.
-   **Guardian AI:** Student wellbeing and career advisory platform.
-   **CertiTrust:** Blockchain-based digital credentialing and AI proctoring.
-   **CampusOS:** Smart campus management platform using IoT.

#### General Platforms & SaaS (10)
-   **ameen:** Secure digital identity and Smart Lost & Found.
-   **APPI – عـبِّـي:** Real-time insights into household utility consumption.
-   **KHIDMA:** AI-powered marketplace for service seekers and providers.
-   **VMALL:** Immersive VR/AR shopping experiences.
-   **Logistics Chain AI:** AI model to optimize supply chains.
-   **RAAHA:** White-label SaaS platform for domestic workforce agencies.
-   **Nova Commerce:** End-to-end e-commerce solutions.
-   **AlumniConnect:** Digital platform for university alumni networks.
-   **Hadeeya:** Digital gift card platform.
-   **StockClear:** B2B marketplace for liquidating overstock goods.


#### AI & Creative Tools (3)
-   **AI Interior Designer:** Generates interior design ideas from photos.
-   **AI PDF Form Filler:** Intelligently fills PDF forms from profile data.
-   **AI-POS for Education:** Smart Point-of-Sale system for canteens/stores.

### 4.2. Core Business Services (19 Total)
A suite of services including cloud infrastructure (Orion Cloud), AI automation (Synergy AI), cybersecurity (Aegis Security), B2B/B2C marketplaces (Business Hub, Sanad Hub), AI-powered translation (Voxi), legal analysis (Lexi), and more.

### 4.3. AI Agents / Digital Workforce (26 Total)

#### AI Business & Operations Agents (13)
-   **Aida:** Admin & Legal Assistant.
-   **Lexi:** AI Legal Agent.
-   **Finley:** Product Manager (Finley CFO).
-   **Hira:** Product Manager (GENIUS).
-   **TenderPro:** Tender Response Assistant.
-   **Talia:** Talent & Competition Agent.
-   **Waleed:** WhatsApp Comms Agent.
-   **Coach:** AI Interview Coach.
-   **Sami:** Sales Agent.
-   **Mira:** Marketing & Content Agent.
-   **Remi:** CRM Agent.
-   **Hubert:** Product Manager (Business Hub).
-   **Fahim:** Product Manager (Sanad Hub).

#### AI Technical & Creative Agents (13)
-   **Tariq Tech:** IT Support Agent.
-   **A.S.A:** Product Manager (InfraRent).
-   **Dana:** Data Analyst Agent.
-   **Neo:** AI Training Agent.
-   **AutoNabil:** Automation Agent.
-   **Lina:** Image Generation Agent.
-   **Voxi:** Product Manager (Voxi Translator).
-   **Echo:** Voice Synthesis Agent.
-   **Vista:** Product Manager (PANOSPACE).
-   **Rami:** Strategy & Research Agent.
-   **Sage:** Business Strategist.
-   **Navi:** Innovation Agent.
-   **Paz:** Partnership Agent.

---
**End of Document**
