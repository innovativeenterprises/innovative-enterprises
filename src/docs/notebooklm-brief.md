
# Project Brief: INNOVATIVE ENTERPRISES AI-Powered Business Platform

**Document Purpose:** This document serves as a comprehensive, centralized source of truth for the INNOVATIVE ENTERPRISES project. It is intended to be a master prompt for AI analysis or for a development team to understand, replicate, or "clone" the project's complete functionality and vision.

---

## 1. Core Idea & Vision

**Vision:** To create a comprehensive, AI-powered business services platform for the Omani and GCC market that functions as a "digital operating system." It automates key operations, connects a network of service providers, and provides a suite of intelligent tools to enhance business productivity and digital transformation.

**Core Problem:** Omani Small and Medium Enterprises (SMEs) face significant operational friction due to manual, paper-based processes, a fragmented service provider market, and limited access to affordable, advanced technology. This hinders their growth, wastes resources, and limits their ability to compete.

**Proposed Solution:** A one-stop-shop digital platform that integrates three core pillars:
1.  **Service Marketplaces:** Digital hubs (`Sanad Hub`, `Business Hub`) that transform the opaque, offline process of procuring services into a transparent, efficient digital marketplace.
2.  **AI Workforce:** A suite of over 25 specialized AI agents, each with a specific role, designed to automate complex, knowledge-based tasks that would otherwise require significant human effort.
3.  **Partner Ecosystem:** A secure `E-Briefcase` and AI-assisted onboarding process to empower our network of freelancers, subcontractors, and service providers, reducing their administrative burden.

---

## 2. Technical Architecture & Stack

The platform is a monolithic **Next.js 14+ (App Router)** application serving both the frontend (UI) and backend API routes. This ensures a consistent user experience. The core intelligence and business logic are architected as decoupled, serverless microservices using the **Genkit** framework.

-   **Frontend:**
    -   **Framework:** Next.js (App Router) with React Server Components (RSC) by default for performance. `'use client'` directive is used only for interactive components.
    -   **Language:** TypeScript
    -   **UI Components:** ShadCN UI built on Radix UI for accessibility and customizability.
    -   **Styling:** Tailwind CSS for utility-first styling.
    -   **State Management:** A simple global store (`src/lib/global-store.ts`) for prototype state, supplemented by React Context and hooks.

-   **Backend & AI:**
    -   **Framework:** Genkit (TypeScript), a powerful orchestration layer for AI flows.
    -   **Deployment:** AI flows are defined in `src/ai/flows/` and deployed as serverless **Cloud Functions for Firebase**, allowing for automatic scaling and cost-efficiency.
    -   **AI Model Provider:** Google AI (`@genkit-ai/googleai`), utilizing various **Gemini models** (e.g., `gemini-2.0-flash`) for their advanced text, vision, and multimodal capabilities.

-   **Database & Auth:**
    -   **Database:** Cloud Firestore (NoSQL) for all application data, including user profiles, projects, products, and opportunities.
    -   **Authentication:** Firebase Authentication for standard email/password and Google OAuth logins. A custom flow using the WhatsApp Business API provides a secure, OTP-based login via the "Ameen" digital identity service.
    -   **Storage:** Cloud Storage for Firebase for all user-uploaded files (e.g., CRs, ID cards, financial documents).

-   **Deployment:** Firebase App Hosting for seamless CI/CD and deployment of the Next.js application.

---

## 3. Key Data Models (Firestore Collections)

-   **`users`**: Stores user profile information, linking to Firebase Auth UID.
-   **`providers`**: Profiles for freelancers, subcontractors, and partners, including their vetted status and service categories.
-   **`sanad_offices`**: Specific profiles for registered Sanad Centre partners.
-   **`opportunities`**: Publicly posted tasks, projects, and competitions available on the marketplaces.
-   **`products`**: Data for all digital and physical products, including those on the e-commerce store (Nova Commerce).
-   **`services`**: Configuration for the core business services displayed on the homepage.
-   **`knowledgeBase`**: A repository of documents (laws, regulations, articles) used for training and fine-tuning AI agents.

---

## 4. Full Feature & Agent List

This section details every component of the ecosystem, explaining its function and the AI agents that power it.

### 4.1. Core Platforms & Services

#### **Sanad Hub Platform**
-   **Description:** A digital gateway connecting users with Sanad Service Centres across Oman. It digitizes the process of delegating government service tasks.
-   **Workflow:**
    1.  A user selects a government service (e.g., "Renew Commercial Registration").
    2.  The **Fahim (AI Agent)** analyzes the request and returns a checklist of required documents and prerequisites.
    3.  The user uploads the documents.
    4.  The platform broadcasts the complete task package to a network of vetted Sanad offices.
    5.  Sanad offices submit competitive bids for the work.
    6.  The user selects the best offer and tracks the task to completion.

#### **Business Hub**
-   **Description:** A B2B/B2C marketplace for businesses to find local freelancers, agencies, and subcontractors for projects.
-   **Workflow:**
    1.  A business posts a project (e.g., "Need a logo designed").
    2.  The **Hubert (AI Agent)** assists the user in correctly categorizing the project.
    3.  The **Talia (AI Agent)** analyzes the work order and publishes it to the `opportunities` board.
    4.  Vetted providers in the relevant category are notified and can submit proposals.
    5.  The business reviews proposals and hires the best fit.

#### **GENIUS Career Platform**
-   **Description:** An end-to-end AI career coach.
-   **Features:**
    -   **CV Enhancer:** Powered by **Hira (AI Agent)**. A user uploads their CV. Hira first analyzes it for ATS (Applicant Tracking System) compatibility and provides a detailed improvement report. The user then provides a target job title, and Hira generates a completely new, optimized CV and cover letter in Markdown format.
    -   **AI Interview Coach:** Powered by **Coach (AI Agent)**. A user enters a job title, and Coach generates a list of 10-15 relevant behavioral, technical, and situational interview questions. Users can practice their answers and submit them to get constructive feedback on their structure and content.

#### **Voxi Translator**
-   **Description:** An AI-powered tool for high-fidelity translation of official documents.
-   **Workflow:**
    1.  A user uploads a document (PDF, image, etc.).
    2.  The **Voxi (AI Agent)**, a multimodal Gemini model, reads and understands the document's content and structure.
    3.  It performs a context-aware translation, using legal or medical terminology as appropriate based on the specified document type.
    4.  It returns two outputs: one preserving the original formatting (including tables and lists) and a clean text version. It also generates a formal "Statement of Translation Accuracy."

#### **RAAHA Platform**
-   **Description:** A white-label SaaS platform for domestic workforce agencies.
-   **Workflow:**
    1.  An agency's client describes their needs in natural language (e.g., "I need a nanny who can cook and speaks English").
    2.  An AI agent analyzes the text, identifies key requirements (skills, language), and converts them into a structured query.
    3.  The agent matches this query against the agency's private database of worker profiles and returns a ranked list of the best candidates with a justification for each match.

### 4.2. Detailed AI Agent Roster

This is the complete digital workforce of INNOVATIVE ENTERPRISES.

#### **AI Business & Operations Agents**
-   **Aida (Admin & Legal Assistant):** Manages the FAQ chatbot, books meetings, and drafts initial legal agreements (NDAs, Service Agreements).
-   **Lexi (AI Legal Agent):** Analyzes legal documents (from URLs or text) for risks, ambiguities, and unfavorable clauses in the context of Omani law.
-   **Finley (Product Manager, Finley CFO):** The AI engine for the CFO Dashboard. Analyzes financial statements, extracts key metrics, and summarizes a company's financial health.
-   **Hira (Product Manager, GENIUS):** Powers the GENIUS platform for CV analysis and enhancement.
-   **TenderPro (Tender Response Assistant):** Consumes tender documents (RFPs) and user-provided company information to generate a comprehensive draft tender response.
-   **Talia (Talent & Competition Agent):** Analyzes and posts new work orders and competitions to the `opportunities` board.
-   **Waleed (WhatsApp Comms Agent):** Manages all WhatsApp Business API interactions, including sending OTPs for the "Ameen" login system.
-   **Coach (AI Interview Coach):** Generates role-specific interview questions and provides feedback on user answers.
-   **Sami (Sales Agent):** Generates tailored Letters of Interest to potential investors and helps manage sales leads.
-   **Mira (Marketing & Content Agent):** Generates a suite of social media posts for multiple platforms from a single topic, along with blog articles and ad copy.
-   **Remi (CRM Agent):** An internal agent that tracks customer inquiries, logs interactions, and sends automated follow-up emails.
-   **Hubert (Product Manager, Business Hub):** The AI guide for the Business Hub, helping users find services and partners.
-   **Fahim (Product Manager, Sanad Hub):** The AI specialist for the Sanad Hub, analyzing government service requests to determine document requirements.

#### **AI Technical & Creative Agents**
-   **Tariq Tech (IT Support Agent):** An internal agent for automating IT support processes and troubleshooting.
-   **A.S.A (Product Manager, InfraRent):** The AI Solutions Architect for the asset rental service, designing custom IT and equipment rental packages.
-   **Dana (Data Analyst Agent):** An internal agent that connects to Firestore to analyze data, generate dashboards, and monitor KPIs.
-   **Neo (AI Training Agent):** The "trainer of trainers." Processes new knowledge documents and Q&A pairs to fine-tune other AI agents.
-   **AutoNabil (Automation Agent):** A master workflow automator that connects disparate tools and services.
-   **Lina (Image Generation Agent):** Generates high-quality, original images from text prompts using text-to-image models.
-   **Voxi (Product Manager, Voxi Translator):** The core engine of the document translation service.
-   **Echo (Voice Synthesis Agent):** Converts text responses from other agents into natural-sounding speech.
-   **Vista (Product Manager, PANOSPACE):** Creates immersive 360° virtual tours from panoramic images and assists with advanced photo/video editing.
-   **Rami (Strategy & Research Agent):** A web research agent that can scrape a URL or perform a general search query and provide a structured summary.
-   **Sage (Business Strategist):** A high-level AI analyst that orchestrates other agents (like Rami) to conduct full feasibility studies on new business ideas.
-   **Navi (Innovation Agent):** Takes a raw business idea and generates a structured project plan, including a summary, target audience, MVP features, and risk analysis.
-   **Paz (Partnership Agent):** Identifies potential freelancers, subcontractors, and strategic partners from online sources to grow the network.

---
**End of Document**

