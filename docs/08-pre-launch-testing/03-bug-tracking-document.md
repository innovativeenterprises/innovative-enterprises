
# Bug Tracking Document

## Project: Innovative Enterprises Platform (MVP Beta)

| ID  | Bug Title / Summary                               | Reporter      | Date Found | Steps to Reproduce                                        | Expected Result                     | Actual Result                      | Priority | Status      | Notes / Assigned To |
| :-- | :------------------------------------------------ | :------------ | :--------- | :-------------------------------------------------------- | :---------------------------------- | :--------------------------------- | :------- | :---------- | :------------------ |
| B-001 | User cannot log in with Google OAuth              | Beta Tester A | 2024-08-16 | 1. Go to login page. 2. Click "Sign in with Google".    | User is logged in.                  | Popup closes, user is not logged in. | High     | `Done`      | Anwar (Fixed in commit #abcd) |
| B-002 | AI analysis of CR document fails for PDFs with Arabic text in images | Beta Tester B | 2024-08-17 | 1. Onboard as company. 2. Upload a scanned CR with image-based Arabic text. 3. Click Analyze. | AI extracts company name and CRN. | AI returns an error or empty fields. | High     | `In Progress` | Anwar (Needs prompt enhancement) |
| B-003 | Typo on Sanad Hub form ("Submitt Task")        | Internal QA   | 2024-08-18 | 1. Navigate to /sanad-hub.                                | Button should say "Submit Task". | Button says "Submitt Task".        | Low      | `To Do`     | Frontend Team       |
| B-004 | Mobile view: E-Briefcase tabs are misaligned on Safari on iOS | Beta Tester C | 2024-08-19 | 1. Log in as a partner on an iPhone. 2. Go to E-Briefcase. | Tabs should be in a single row. | Tabs wrap incorrectly and overlap. | Medium   | `To Do`     | Frontend Team       |
| B-005 | Bid amount on Sanad Hub accepts negative numbers. | Internal QA   | 2024-08-20 | 1. As a Sanad office, open a task. 2. Enter "-10" in the bid amount field. | Form should show a validation error. | Form accepts the negative value. | High     | `Done`      | Frontend Team (Fixed in #efgh) |


