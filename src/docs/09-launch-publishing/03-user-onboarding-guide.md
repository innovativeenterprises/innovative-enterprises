# User Onboarding Guide

*This document outlines the initial experience for a new **Service Provider (Freelancer/Sanad Office)**, intended to guide them to their "Aha!" moment—receiving their first task—as quickly as possible.*

---

### Step 1: Sign-Up & Applicant Type Selection
- **Screen:** `partner/page.tsx`
- **Action:** User chooses their application type: "Individual/Freelancer" or "Company/Subcontractor".
- **Goal:** Immediately segment the user for the correct onboarding flow.

### Step 2: AI-Assisted Document Upload
- **Screen:** `partner/page.tsx` (Upload Section)
- **Action:** User uploads their core legal document (ID card for individuals, Commercial Record for companies). The AI-powered analysis is the "magic moment" here.
- **Goal:** Impress the user with technology and dramatically reduce manual data entry.

### Step 3: Review & Confirm
- **Screen:** `partner/page.tsx` (Review Section)
- **Action:** The form is pre-filled with the data extracted by the AI. The user's task is simply to *verify* the information and fill in any missing pieces (like a phone number not present on the CR).
- **Goal:** Build trust by showing the AI's work and giving the user final control.

### Step 4: Agreement Generation & Signing
- **Screen:** `partner/page.tsx` (Submitted Screen)
- **Action:** After submission, the user is immediately presented with their auto-generated NDA and Service Agreement, populated with their verified details.
- **Goal:** Provide instant gratification and a sense of official partnership. They can E-sign immediately.

### Step 5: The "Aha!" Moment & First Action
- **Screen:** E-Briefcase (`briefcase/page.tsx`)
- **Content:** The user lands in their personal, secure E-Briefcase. They can see their signed agreements and verified documents.
- **Next Steps:** A prominent call-to-action guides them to their next logical step: "View Open Opportunities" or "Complete Your Profile to Receive Tasks".
- **Goal:** The user should think, "Wow, I'm a verified partner with legal agreements in place, and I can start getting work *right now*."

---

### Onboarding Email Sequence
- **Email 1 (Immediately after sign-up):** "Welcome to the INNOVATIVE ENTERPRISES Partner Network!" - Confirms registration, includes a copy of their signed agreements, and provides a link to their E-Briefcase.
- **Email 2 (After 24 hours if profile not complete):** "Complete Your Profile to Start Receiving Job Offers" - A reminder to add more details (e.g., portfolio, detailed service list) to increase their chances of being selected for tasks.
- **Email 3 (After first task bid/assignment):** "You've Submitted Your First Bid!" - Congratulates the user on their first engagement and provides tips for winning projects.

    