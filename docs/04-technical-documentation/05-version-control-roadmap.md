
# Version Control & Development Roadmap

## 1. Version Control Strategy
- **Provider:** GitHub
- **Main Branch:** `main`
  - The `main` branch is the source of truth and represents the production-ready code.
  - Direct pushes to `main` are prohibited. All changes must come through Pull Requests.
- **Development Branch:** `develop`
  - All feature branches are merged into `develop`.
  - This branch is used for staging and pre-production testing.
- **Feature Branches:** `feature/[feature-name]` (e.g., `feature/user-auth`)
  - Each new feature or bug fix must be developed in its own branch, created from `develop`.
- **Pull Request (PR) Policy:**
  - All PRs must be reviewed by at least one other team member.
  - All automated checks (linting, tests) must pass.
  - PRs from feature branches are merged into `develop`.
- **Release Strategy:**
  - When `develop` is stable and ready for release, a PR is created from `develop` to `main`.
  - Once merged, a new version tag is created (e.g., `v1.1.0`).

## 2. High-Level Development Roadmap

### Version 1.0 (MVP) - [Target Date: YYYY-MM-DD]
*The core functionality required for initial launch.*

| Feature                     | Status      | Notes                               |
| :-------------------------- | :---------- | :---------------------------------- |
| User Authentication         | `To Do`     | Email/Password and Google OAuth.    |
| Project Creation & Kanban   | `To Do`     | AI-powered inception and board view.|
| Service Provider Onboarding | `To Do`     | Basic form and document upload.     |
| **Core Goal:** Launch a functional platform for project and partner management. |

### Version 1.1 - [Target Date: YYYY-MM-DD]
*First set of major enhancements post-launch.*

| Feature                     | Status      | Notes                               |
| :-------------------------- | :---------- | :---------------------------------- |
| Payment Integration (Stripe)| `Not Started` | For paid services and subscriptions. |
| E-Briefcase for Partners    | `Not Started` | Central hub for partner documents.  |
| **Core Goal:** Enable monetization and improve partner experience. |

### Version 1.2 - [Target Date: YYYY-MM-DD]
*Focus on expanding AI capabilities.*

| Feature                     | Status      | Notes                               |
| :-------------------------- | :---------- | :---------------------------------- |
| AI-Powered Document Analysis| `Not Started` | For CRs, IDs, and financial docs.   |
| Real-time Chat Agent        | `Not Started` | For customer support (FAQ bot).     |
| **Core Goal:** Automate key business processes using AI. |
