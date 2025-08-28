
# API Requirements & Integration Notes

## Project: Innovative Enterprises - AI Business Platform

---

### Internal APIs (Genkit Flows)
*This section details the primary server-side functions (Genkit flows) that our Next.js frontend consumes. These are typically called as Server Actions.*

| Flow Name                 | File Path                       | Request Type (Input Schema)                               | Response Type (Output Schema)                                | Description                                       |
| :------------------------ | :------------------------------ | :-------------------------------------------------------- | :----------------------------------------------------------- | :------------------------------------------------ |
| `analyzeCrDocument`       | `cr-analysis.ts`                | `CrAnalysisInput`                                         | `CrAnalysisOutput`                                           | Extracts structured data from a CR document.      |
| `analyzeIdentity`         | `identity-analysis.ts`          | `IdentityAnalysisInput`                                   | `IdentityAnalysisOutput`                                     | Extracts data from ID cards and passports.        |
| `generateAgreement`       | `generate-agreement.ts`         | `AgreementGenerationInput`                                | `AgreementGenerationOutput`                                  | Generates NDA and Service Agreement drafts.       |
| `analyzeSanadTask`        | `sanad-task-analysis.ts`        | `SanadTaskAnalysisInput`                                  | `SanadTaskAnalysisOutput`                                    | Determines required documents for a Sanad task.   |
| `translateDocument`       | `document-translation.ts`       | `DocumentTranslationInput`                                | `DocumentTranslationOutput`                                  | Translates an uploaded document.                  |
| `generateEnhancedCv`      | `cv-enhancement.ts`             | `CvGenerationInput`                                       | `CvGenerationOutput`                                         | Rewrites a CV and generates a cover letter.       |
| `generateSocialMediaPost` | `social-media-post-generator.ts`| `GenerateSocialMediaPostInput`                            | `GenerateSocialMediaPostOutput`                              | Creates social media content for multiple platforms.|
| `answerQuestion`          | `ai-powered-faq.ts`             | `AnswerQuestionInput`                                     | `AnswerQuestionOutput`                                       | Powers the main FAQ chatbot (Aida).               |

---

### External API Integrations
*This section details third-party APIs we plan to integrate with or are already using.*

#### 1. Google AI API
- **Purpose:** The core of our AI capabilities. Used for all generative text, vision, and image generation models.
- **Provider:** `@genkit-ai/googleai` plugin.
- **API Key Required:** Yes (`GEMINI_API_KEY`).
- **Integration Notes:** The Genkit framework abstracts the direct API calls. All interactions are handled server-side within our Genkit flows.

#### 2. Meta (WhatsApp Business API)
- **Purpose:** To send and receive WhatsApp messages for notifications and the "Ameen" OTP login.
- **API Key Required:** Yes (`WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`).
- **Endpoints Used:**
  - `POST /v18.0/{PHONE_NUMBER_ID}/messages`: To send messages.
- **Integration Notes:** All API calls are wrapped in the `whatsapp-agent.ts` flow. A webhook must be configured in the Meta for Developers portal to receive incoming messages.

#### 3. Stripe API (Future)
- **Purpose:** To process payments for subscriptions and services.
- **API Key Required:** Yes (Publishable and Secret keys).
- **Endpoints to Use:**
  - `PaymentIntents API`: For creating and confirming payments.
  - `Customers API`: To manage customer payment information.
- **Integration Notes:** All sensitive operations will be handled server-side in a secure Cloud Function. The frontend will use Stripe.js and the publishable key to tokenize card information.
