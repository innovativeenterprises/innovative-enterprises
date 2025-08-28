
# Technical Architecture Document

## Project: Innovative Enterprises - AI Business Platform
**Version:** 1.0
**Date:** 2024-08-01

---

### 1. System Overview
*A high-level diagram and description of the system's components and their interactions.*

The platform is a monolithic Next.js application built with the App Router. It serves both the user-facing frontend and the backend API endpoints. The backend logic, particularly for AI-powered features, is handled by Genkit flows, which are exposed as API routes and deployed as serverless Cloud Functions on Firebase. Firebase provides the core backend-as-a-service (BaaS) functionality, including authentication, database, and hosting.

![System Architecture Diagram](https://placehold.co/800x400?text=Next.js+<->+Firebase+Functions+(Genkit)+<->+Firestore/Auth)

### 2. Frontend Architecture
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **UI Components:** ShadCN UI (a collection of Radix UI and custom components).
- **Styling:** Tailwind CSS.
- **State Management:** A simple global store (`src/lib/global-store.ts`) is used for managing shared state (e.g., services, products, cart) across the application for the prototype. React Context and hooks (`useState`, `useEffect`) for local component state.
- **Deployment:** Firebase App Hosting.

### 3. Backend Architecture
- **Framework:** Genkit (running on Cloud Functions for Firebase). All flows are defined in `src/ai/flows/`.
- **Language:** TypeScript.
- **Primary Database:** Firestore (NoSQL).
  - **Key Collections:**
    - `users`: Stores user profile information, linking to Firebase Auth UID.
    - `sanad_offices`: Profiles of registered Sanad Centre partners.
    - `providers`: Profiles for freelancers and other service providers.
    - `opportunities`: Publicly posted tasks and projects.
    - `products`: Data for the e-commerce store.
    - `services`: Configuration for services shown on the homepage.
- **Authentication:** Firebase Authentication (Email/Password, Google OAuth, and a custom WhatsApp OTP flow via "Ameen").

### 4. AI / Generative AI Integration
- **Platform:** Genkit
- **Model Provider:** Google AI (`@genkit-ai/googleai`).
- **Key Models:**
  - **Text Generation & Reasoning:** `gemini-2.0-flash`
  - **Image Analysis & OCR:** `gemini-2.0-flash` (used with image inputs).
  - **Image Generation:** `gemini-2.0-flash-preview-image-generation`
  - **Video Generation:** `veo-2.0-generate-001`
- **Flows:**
  - `analyzeSanadTask`: Analyzes a government service to determine required documents.
  - `generateAgreement`: Drafts legal documents (NDA, Service Agreement).
  - `analyzeCrDocument`: Extracts structured data from Commercial Record PDFs.
  - `analyzeIdentity`: Extracts structured data from ID cards and passports.
  - ...and many more, located in `src/ai/flows/`.

### 5. Data Flow
*Example data flow for a new Partner Onboarding:*
1.  User selects "Become a Partner" and chooses their applicant type (Individual/Company).
2.  The Next.js frontend presents the user with the form in `src/app/partner/page.tsx`.
3.  User uploads a CR document. The file is converted to a Data URI on the client.
4.  The form calls the `analyzeCrDocument` flow via a server action.
5.  The Genkit flow, running in a Cloud Function, receives the request, sends the document to the Gemini API, and receives structured JSON data back.
6.  The structured data is returned to the frontend, which pre-fills the partnership application form.
7.  User verifies the data and submits, which calls the `handlePartnershipInquiry` flow to save the partner to the `providers` collection in Firestore.

### 6. Scalability & Performance Considerations
- **Firestore:** Scales automatically. Security rules must be carefully crafted to ensure data integrity and prevent unauthorized access.
- **Next.js:** Server Components are used extensively to reduce client-side JavaScript. Image optimization is handled by `next/image`.
- **Genkit Flows:** Cloud Functions scale automatically based on demand. Timeouts are configured in `apphosting.yaml` to handle long-running AI operations like video generation.

### 7. Security
- **Authentication:** Managed by Firebase Authentication, providing robust and secure user login. Custom tokens are used for the WhatsApp OTP flow.
- **Database:** Firestore Security Rules will be implemented to restrict data access (e.g., users can only read/write their own data).
- **API Keys:** All secret keys (e.g., `GEMINI_API_KEY`, `WHATSAPP_TOKEN`) are stored in environment variables (`.env`) and are only accessed on the server-side, never exposed to the client.
