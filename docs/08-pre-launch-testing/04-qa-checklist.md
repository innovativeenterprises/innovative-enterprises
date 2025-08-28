
# Quality Assurance (QA) Checklist

## Project: Innovative Enterprises Platform
**Test Cycle:** MVP Pre-Launch
**Build Version:** v0.9.5

---

### Functional Testing
- [x] **User Authentication (Ameen)**
  - [x] User can sign up with Email/Password.
  - [x] User can log in and log out.
  - [ ] User can sign in with Google. (B-001)
  - [x] Password reset flow works.
  - [x] Form validation errors are displayed correctly.
- [x] **Partner Onboarding**
  - [x] User can select 'Individual' or 'Company' type.
  - [x] Document upload works for ID, CR, etc.
  - [ ] AI Analysis (`analyzeCrDocument`, `analyzeIdentity`) is triggered and returns data. (B-002)
  - [x] Extracted data correctly pre-fills the confirmation form.
  - [x] Agreements (NDA, Service) are generated and viewable in E-Briefcase.
- [x] **Sanad Hub**
  - [x] Client can create and submit a new task.
  - [x] AI analysis (`analyzeSanadTask`) correctly shows required documents.
  - [x] Sanad office partner can see the new task in their dashboard.
  - [x] Sanad office can submit a bid. (B-005)
  - [ ] Client receives a notification (email/in-app) about the new bid.

---

### UI/UX Testing
- [x] **Responsiveness**
  - [x] Layout is functional on Desktop (1440px).
  - [x] Layout is functional on Tablet (768px).
  - [ ] Layout is functional on Mobile (375px). (B-004)
- [x] **Consistency**
  - [x] All pages use the correct brand colors and fonts (Inter).
  - [x] Spacing and alignment are consistent across components.
  - [x] All buttons and form elements have a consistent style (ShadCN).
- [ ] **Cross-Browser Compatibility**
  - [x] App functions correctly on Chrome.
  - [x] App functions correctly on Firefox.
  - [ ] App functions correctly on Safari. (B-004)

---

### Performance Testing
- [x] **Page Load Speed**
  - [x] Homepage loads in under 3 seconds on a 4G connection.
  - [x] Admin Dashboard loads in under 5 seconds.
- [ ] **AI Flow Performance**
  - [x] Document analysis flows return a result within 15 seconds.
  - [x] Other AI flows (e.g., `analyzeSanadTask`) respond in under 5 seconds.

---

### Accessibility (A11y) Testing
- [x] All images have appropriate `alt` text or a `data-ai-hint` attribute.
- [x] All form inputs have associated labels.
- [ ] The app is fully navigable using only the keyboard. (Needs full check)
- [x] Color contrast meets WCAG AA standards.
