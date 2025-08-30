# Version Control & Development Roadmap

## 1. Version Control Strategy
- **Provider:** GitHub
- **Main Branch:** `main`
  - The `main` branch represents the production-ready, deployable code.
  - Direct pushes to `main` are prohibited. All changes must come through Pull Requests from the `develop` branch.
- **Development Branch:** `develop`
  - This is the primary development branch. All feature branches are merged into `develop`.
  - This branch is deployed to a staging environment for testing.
- **Feature Branches:** `feature/[feature-name]` (e.g., `feature/sanad-hub-bidding`)
  - Each new feature or bug fix must be developed in its own branch, created from `develop`.
- **Pull Request (PR) Policy:**
  - All PRs must be reviewed by at least one other team member.
  - All automated checks (linting, tests) must pass.
  - PRs from feature branches are merged into `develop`.
- **Release Strategy:**
  - When `develop` is stable and ready for release, a PR is created from `develop` to `main`.
  - Once merged, a new version tag is created (e.g., `v1.0.0`) and a production deployment is triggered.

## 2. Long-Term Development Roadmap

### Version 1.0 (MVP) - [Target Date: 2024-09-15]
**Theme:** *Launch & Foundational Growth*
*The core functionality required for initial launch, focusing on the Sanad Hub and Partner Network.*

| Feature                     | Status      | Notes                               |
| :-------------------------- | :---------- | :---------------------------------- |
| Partner Onboarding (AI-Assisted) | `Done`      | For individuals and companies.      |
| E-Briefcase for Partners    | `Done`      | Secure document and agreement management. |
| Sanad Hub (Task Submission) | `Done`      | Clients can submit tasks to the network. |
| Admin Dashboard (Core)      | `In Progress` | User management and content tables. |
| **Core Goal:** Launch a functional platform for connecting clients with Sanad offices and other service providers. |

---

### Version 1.1 - [Target Date: 2024-11-30]
**Theme:** *Monetization & AI Tool Expansion*
*First set of major enhancements post-launch, focusing on revenue generation and expanding the suite of public AI tools.*

| Feature                     | Status      | Notes                               |
| :-------------------------- | :---------- | :---------------------------------- |
| Payment Integration (Stripe)| `Not Started` | For partner subscriptions and service fees. |
| Business Hub Marketplace    | `Not Started` | Expand beyond Sanad services to general B2B. |
| Voxi Document Translator    | `Done`      | Public-facing AI translation tool.  |
| GENIUS CV Enhancer          | `Not Started` | Initial version of the career platform. |
| **Core Goal:** Enable monetization and expand the suite of public-facing AI tools to attract more users. |

---

### Version 1.2 - [Target Date: 2025-01-31]
**Theme:** *Enterprise Readiness & Automation*
*Focus on features for larger business clients and deeper automation of internal and external processes.*

| Feature                     | Status      | Notes                               |
| :-------------------------- | :---------- | :---------------------------------- |
| Team Accounts for SMEs      | `Not Started` | Allow multiple users under a single company account. |
| Real-time Chat Agent (Aida) | `NotStarted`| Upgrade FAQ bot to a real-time support agent with history. |
| WhatsApp Notifications      | `Planned`   | Enable task notifications via WhatsApp for partners. |
| Advanced Financial Dashboard| `Not Started` | Deeper integrations and reporting in the CFO dashboard. |
| **Core Goal:** Enhance the platform for larger teams and provide deeper, more convenient automation. |

---

### Version 1.3 - [Target Date: 2025-04-30]
**Theme:** *Ecosystem Integration*
*Focus on connecting our platform with other tools and services to become a central hub for business operations.*

| Feature                     | Status      | Notes                               |
| :-------------------------- | :---------- | :---------------------------------- |
| Partner API (v1)            | `Planned`   | Allow third-party systems to integrate with our marketplaces. |
| Accounting Software Sync    | `Planned`   | Integrate with Zoho Books/QuickBooks for seamless financial data transfer. |
| Calendar Integration        | `Planned`   | Allow booking meetings with partners directly into Google/Outlook calendars. |
| Advanced Reporting Suite    | `Planned`   | Exportable reports for project progress, financial summaries, and partner performance. |
| **Core Goal:** Make our platform an indispensable and interconnected tool in our clients' software stack. |

---

### Version 1.4 - [Target Date: 2025-07-31]
**Theme:** *Platform Intelligence*
*Leverage our collected data and advanced AI to provide proactive, intelligent suggestions to our users.*

| Feature                     | Status      | Notes                               |
| :-------------------------- | :---------- | :---------------------------------- |
| "Navi" AI Project Manager   | `Planned`   | Proactive suggestions for project tasks, timelines, and risks. |
| Predictive Analytics        | `Planned`   | AI-powered forecasting for SME cash flow and project budgets. |
| Intelligent Partner Matching| `Planned`   | Automatically recommend the best service provider for a task based on past performance, price, and specialty. |
| Automated Weekly Summaries  | `Planned`   | Email users with a weekly digest of their platform activity and key business metrics. |
| **Core Goal:** Transition from a reactive tool to a proactive, intelligent business partner for our users. |

---

### Version 2.0 - [Target Date: 2025-12-31]
**Theme:** *Regional Expansion & Maturity*
*Focus on scaling the platform beyond Oman, enhancing the mobile experience, and achieving feature completeness.*

| Feature                     | Status      | Notes                               |
| :-------------------------- | :---------- | :---------------------------------- |
| Native Mobile App (iOS/Android) | `Planned` | Develop and launch a dedicated mobile application for a superior user experience. |
| Multi-language Support      | `Planned`   | Full platform localization for Arabic and other key languages. |
| GCC Market Expansion        | `Planned`   | Adapt platform features and service providers for UAE and KSA markets. |
| Full White-Label Solution   | `Planned`   | Launch a fully customizable version of our core platforms for enterprise clients. |
| **Core Goal:** Establish Innovative Enterprises as a leading digital transformation platform across the GCC. |
