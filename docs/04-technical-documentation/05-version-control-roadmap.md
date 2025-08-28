
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

## 2. High-Level Development Roadmap

### Version 1.0 (MVP) - [Target Date: 2024-09-15]
*The core functionality required for initial launch, focusing on the Sanad Hub and Partner Network.*

| Feature                     | Status      | Notes                               |
| :-------------------------- | :---------- | :---------------------------------- |
| Partner Onboarding (AI-Assisted) | `Done`      | For individuals and companies.      |
| E-Briefcase for Partners    | `Done`      | Secure document and agreement management. |
| Sanad Hub (Task Submission) | `Done`      | Clients can submit tasks to the network. |
| Admin Dashboard (Core)      | `In Progress` | User management and content tables. |
| **Core Goal:** Launch a functional platform for connecting clients with Sanad offices and other service providers. |

### Version 1.1 - [Target Date: 2024-11-30]
*First set of major enhancements post-launch, focusing on monetization and expanding AI tools.*

| Feature                     | Status      | Notes                               |
| :-------------------------- | :---------- | :---------------------------------- |
| Payment Integration (Stripe)| `Not Started` | For partner subscriptions and service fees. |
| Business Hub Marketplace    | `Not Started` | Expand beyond Sanad services to general B2B. |
| Voxi Document Translator    | `Done`      | Public-facing AI translation tool.  |
| GENIUS CV Enhancer          | `Not Started` | Initial version of the career platform. |
| **Core Goal:** Enable monetization and expand the suite of public-facing AI tools. |

### Version 1.2 - [Target Date: 2025-01-31]
*Focus on enterprise features and advanced automation.*

| Feature                     | Status      | Notes                               |
| :-------------------------- | :---------- | :---------------------------------- |
| Team Accounts for SMEs      | `Not Started` | Allow multiple users under a single company account. |
| Real-time Chat Agent (Aida) | `Not Started` | Upgrade FAQ bot to a real-time support agent. |
| Advanced Financial Dashboard | `Not Started` | Deeper integrations and reporting in the CFO dashboard. |
| **Core Goal:** Enhance the platform for larger teams and deeper automation. |
