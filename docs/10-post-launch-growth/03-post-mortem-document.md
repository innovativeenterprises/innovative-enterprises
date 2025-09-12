
# Post-Mortem / Lessons Learned

## Project: MVP Launch
## Feature / Sprint: Sanad Hub & Partner Onboarding
**Date of Review:** 2024-09-30

---

### 1. Overview
*A brief summary of the project or sprint. What were the goals?*

**Goal:** To launch the MVP of the Innovative Enterprises platform by September 15, 2024, with a focus on the core user journeys: SME clients submitting tasks to the Sanad Hub, and new service providers onboarding successfully via the AI-assisted flow.
**Outcome:** The project was launched successfully on September 15th. User acquisition is on track, but we encountered several post-launch bugs related to document parsing.

---

### 2. What Went Well?
*Celebrate the successes. What did we do right?*
- **AI-Assisted Onboarding:** This was a huge win. Beta testers and early users were consistently "wowed" by the AI's ability to pre-fill their applications from their CR/ID documents. It's a key differentiator.
- **Team Collaboration:** The daily stand-ups between development and business leadership kept everyone aligned and allowed us to pivot quickly on small issues.
- **Core User Flow:** The primary flow of a client posting a task and a provider bidding on it works smoothly. The logic is sound.
- **Launch Day Execution:** The go-to-market plan was executed perfectly by the team, resulting in exceeding our Day 1 sign-up targets.

---

### 3. What Didn't Go Well?
*Be honest and blameless. Focus on process, not people.*
- **AI Model Robustness:** We underestimated the variety and quality of real-world CR and ID documents. Our AI flow (`analyzeCrDocument`) struggled with low-quality scans and documents in formats we hadn't anticipated, causing a spike in support tickets.
- **Mobile UI on Safari:** Several UI components, particularly in the E-Briefcase, were not thoroughly tested on Safari for iOS, leading to layout issues for a significant user segment.
- **Provider Expectations:** We didn't clearly communicate to our first Sanad office partners how the bidding process worked, leading to some initial confusion and support requests.

---

### 4. What Did We Learn?
*Analyze the root causes of the issues.*
- We learned that for AI features, our test data must include a much wider range of "messy" real-world examples, not just clean, ideal documents.
- We learned that our QA process must have a mandatory checklist item for testing on all three major browsers (Chrome, Firefox, Safari), including mobile versions.
- We learned that a feature isn't "done" until its accompanying user-facing documentation (e.g., a simple FAQ or tutorial) is also ready.

---

### 5. Action Items
*What specific, actionable steps will we take to improve next time?*

| Action Item                                            | Owner         | Due Date   |
| :------------------------------------------------------- | :------------ | :--------- |
| Create a "Chaos Set" of 50+ diverse, low-quality documents to use for regression testing AI analysis flows. | Anwar (CTO)   | 2024-10-15 |
| Update the formal QA checklist to require sign-off for Chrome, Firefox, and Safari (Desktop & Mobile) on all new features. | Abduljabbar (PM) | 2024-10-05 |
| Create a "Partner Welcome Kit" (a short PDF guide and video) explaining how to bid on tasks and manage their profile. | Huda (PRO) | 2024-10-10 |
|                                                          |               |            |

    