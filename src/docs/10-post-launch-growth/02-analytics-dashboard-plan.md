# Analytics & Metrics Dashboard Plan

*This document outlines the key metrics we need to track to measure the health and success of the platform. This will be built out in the **Admin Dashboard** using `recharts` and data from Firestore.*

---

### 1. Acquisition Metrics (The "A" in AARRR)
*How are users discovering our platform?*
- **Metric:** New User Sign-ups (per day/week/month)
  - **Breakdown:** by type (SME Client vs. Service Provider).
- **Metric:** Traffic Sources (Source: Google Analytics)
  - Organic Search, Paid, Social (LinkedIn), Direct, Referral.
- **Metric:** Partner Onboarding Funnel Conversion Rate
  - % of users who start the onboarding flow and successfully complete it.

### 2. Activation Metrics (The "A" in AARRR)
*Are users experiencing the "Aha!" moment?*
- **Metric:** Activation Rate (% of new users who complete a core action within 7 days).
  - **For Clients:** Submitting their first task.
  - **For Providers:** Submitting their first bid.
- **Metric:** AI Tool Adoption Rate (% of users who have used at least one AI tool like Voxi or Mira).
- **Metric:** Time to First Task (How long it takes a new client to post their first job).

### 3. Retention Metrics (The "R" in AARRR)
*Are users coming back?*
- **Metric:** Weekly Active Users (WAU) & Monthly Active Users (MAU).
- **Metric:** User Retention Cohorts (What % of users who signed up in Week 1 are still active in Week 2, 3, 4?).
- **Metric:** Provider Churn Rate (% of service providers who cancel their subscription or become inactive).

### 4. Revenue Metrics (The "R" in AARRR)
*Are we building a sustainable business?*
- **Metric:** Monthly Recurring Revenue (MRR) from subscriptions.
- **Metric:** Platform Revenue (Commissions from marketplace transactions).
- **Metric:** Customer Lifetime Value (CLV).
- **Metric:** Conversion Rate from free/trial to paid subscription tiers.

### 5. Referral Metrics (The "R" in AARRR)
*Are users telling others?*
- **Metric:** Net Promoter Score (NPS) from user surveys.
- **Metric:** Number of invites sent via a future referral program.

---

### Dashboard Mockup (Admin Homepage)

| **Key Metric**        | **Value (Last 30d)** | **Trend** |
| :-------------------- | :-------------------- | :-------- |
| New Users (Total)     | 215                   | +15%      |
| Tasks Posted (Sanad Hub) | 450                | +22%      |
| MRR                   | OMR 1,250             | +30%      |
| Active Providers      | 85                    | +10%      |

**Charts:**
1.  **Bar Chart:** User Growth (Clients vs. Providers) over the last 6 months.
2.  **Line Chart:** MRR Growth over the last 12 months.
3.  **Funnel Chart:** Partner Onboarding funnel (Page View > Start Upload > Analysis Success > Submitted).
