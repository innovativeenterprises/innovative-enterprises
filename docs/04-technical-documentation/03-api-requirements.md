
# API Requirements & Integration Notes

## Project: [Project Name]

---

### Internal APIs (Genkit Flows)
*This section details the APIs our frontend will consume from our own backend (Genkit flows).*

**Base URL:** `/api/flows/`

| Flow Name                 | HTTP Method | Endpoint                       | Request Body (Input Schema)                               | Response Body (Output Schema)                                | Description                                       |
| :------------------------ | :---------- | :----------------------------- | :-------------------------------------------------------- | :----------------------------------------------------------- | :------------------------------------------------ |
| `generateProjectPlan`     | `POST`      | `/api/flows/projectInception`  | `{ "idea": "string" }`                                    | `ProjectInceptionOutput`                                     | Generates a project plan from an idea.            |
| `answerQuestion`          | `POST`      | `/api/flows/aiPoweredFaq`      | `{ "question": "string" }`                                | `AnswerQuestionOutput`                                       | Answers questions about the company.              |
| `[FlowName]`              | `POST`      | `/api/flows/[flow-name]`       | `[InputType]`                                             | `[OutputType]`                                               | [Description of the flow's purpose.]              |

---

### External API Integrations
*This section details third-party APIs we need to integrate with.*

#### 1. Google Maps API
- **Purpose:** To display maps and handle location-based features.
- **API Key Required:** Yes
- **Endpoints to Use:**
  - `Geocoding API`: To convert addresses to coordinates.
  - `Places API`: For location search and details.
- **Integration Notes:** Usage will be primarily on the client-side. Key must be restricted to our domain.

#### 2. Stripe API
- **Purpose:** To process payments for services.
- **API Key Required:** Yes (Publishable and Secret keys)
- **Endpoints to Use:**
  - `PaymentIntents API`: For creating and confirming payments.
  - `Customers API`: To manage customer payment information.
- **Integration Notes:** All sensitive operations will be handled server-side in a secure Cloud Function. The frontend will use Stripe.js and the publishable key.
