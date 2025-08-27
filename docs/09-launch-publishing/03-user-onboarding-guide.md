
# User Onboarding Guide

*This document outlines the initial experience for a new user, intended to guide them to their "Aha!" moment as quickly as possible.*

---

### Step 1: Sign-Up
- **Screen:** Simple sign-up form.
- **Fields:** Name, Email, Password.
- **Social Login:** Prominent "Sign up with Google" button for one-click registration.
- **Goal:** Minimize friction to create an account.

### Step 2: Welcome Screen
- **Screen:** A clean, welcoming screen after the first login.
- **Content:**
  - "Welcome, [User Name]!"
  - A one-sentence summary of what they can do with the app. (e.g., "Let's automate your first task.")
- **Primary CTA:** A single, clear button that starts the main action. (e.g., "Create Your First Project")

### Step 3: The "Empty State" / First Action
- **Screen:** The main dashboard, but it's currently empty.
- **Content:**
  - This is a critical step. Don't just show a blank screen.
  - Provide guidance. Use helper text, arrows, or a short interactive tutorial.
  - **Example:** A large "Create New Project" button in the center of the screen with text below it explaining what it does.
- **Goal:** Guide the user to perform the primary action that delivers the core value of the product.

### Step 4: First Core Action Walkthrough
- **Interaction:**
  - As the user interacts with the core feature for the first time, use tooltips or a guided tour (e.g., using a library like Shepherd.js) to explain key UI elements.
  - **Tooltip 1:** "Start by giving your project a title."
  - **Tooltip 2:** "Now, describe your goal, and our AI will help you with the next steps."
- **Goal:** Ensure the user successfully completes the first value-delivering action without confusion.

### Step 5: The "Aha!" Moment
- **Screen:** The result of their first action.
- **Content:**
  - Display the valuable output clearly (e.g., the AI-generated project plan, the translated document).
  - Use visual cues like celebratory animations or a "Success!" message.
- **Next Steps:** Immediately suggest the next logical action. (e.g., "Now, invite your team members" or "Download your document").
- **Goal:** The user should think, "Wow, that was easy and useful!"

---

### Onboarding Email Sequence
- **Email 1 (Immediately after sign-up):** "Welcome to [Project Name]!" - Confirms registration and provides a link back to the app.
- **Email 2 (After 24 hours if core action not taken):** "Need help getting started?" - Offers a link to a tutorial or support.
- **Email 3 (After first core action):** "You're on your way!" - Congratulates the user and suggests a more advanced feature to try next.
