

'use server';

/**
 * @fileOverview AI-powered tool to generate draft responses to government tenders.
 *
 * - generateTenderResponse - A function that handles the generation of tender responses.
 */

import {ai} from '@/ai/genkit';
import {
    GenerateTenderResponseInput,
    GenerateTenderResponseInputSchema,
    GenerateTenderResponseOutput,
    GenerateTenderResponseOutputSchema,
} from './tender-response-assistant.schema';


export async function generateTenderResponse(
  input: GenerateTenderResponseInput
): Promise<GenerateTenderResponseOutput> {
  return generateTenderResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTenderResponsePrompt',
  input: {schema: GenerateTenderResponseInputSchema},
  output: {schema: GenerateTenderResponseOutputSchema},
  prompt: `You are an expert proposal writer for government and corporate tenders. Your task is to generate a professional and comprehensive draft tender response based on the provided documents and information.

**Tender Documents Analysis:**
{{#each tenderDocuments}}
- Document: {{media url=this}}
{{/each}}

**Key Project Requirements Summary:** 
{{{projectRequirements}}}

**User-Provided Information (fill in placeholders with this data):**
- **Company Name:** {{#if companyName}}{{{companyName}}}{{else}}[Your Company Name]{{/if}}
- **Project Name:** {{#if projectName}}{{{projectName}}}{{else}}[Project Name]{{/if}}
- **Tendering Authority:** {{#if tenderingAuthority}}{{{tenderingAuthority}}}{{else}}[Tendering Authority Name]{{/if}}
- **Company Overview:** {{#if companyOverview}}{{{companyOverview}}}{{else}}[Briefly describe your company, e.g., a reputable construction company with a proven track record...]{{/if}}
- **Relevant Experience:** {{#if relevantExperience}}{{{relevantExperience}}}{{else}}[Mention 1-2 relevant past projects and describe them briefly.]{{/if}}
- **Project Team:** {{#if projectTeam}}{{{projectTeam}}}{{else}}[Introduce key members of your project team, highlighting their qualifications and experience.]{{/if}}
- **Estimated Cost:** {{#if estimatedCost}}OMR {{estimatedCost}}{{else}}[Total Estimated Cost in OMR]{{/if}}
- **Price Validity:** {{#if priceValidityDays}}{{{priceValidityDays}}} days{{else}}[Number] days{{/if}}
- **Estimated Schedule:** {{#if estimatedSchedule}}{{{estimatedSchedule}}}{{else}}[Number] weeks/months{{/if}}
- **Contact Info:** {{#if contactInfo}}{{{contactInfo}}}{{else}}[Your Name]\n[Your Title]\n[Your Company Name]\n[Contact Information]{{/if}}


**Instructions:**
Use the template below to structure the entire response. Analyze the provided tender documents and the user's summary to understand the project's scope (e.g., Earthwork, Concrete Works, Software Development, IT Support). Fill in the template placeholders using the **User-Provided Information** above. If a piece of user information is missing, use the corresponding placeholder text (e.g., "[Project Name]"). For the "Specific Experience" and other descriptive sections, you must use the analyzed tender documents and project requirements to generate relevant, detailed, and professional content.

---
**Template Starts Here**
---

## Tender Response: {{#if companyName}}{{{companyName}}}{{else}}[Your Company Name]{{/if}} - {{#if projectName}}{{{projectName}}}{{else}}[Project Name]{{/if}}

**To:** {{#if tenderingAuthority}}{{{tenderingAuthority}}}{{else}}[Tendering Authority Name]{{/if}}

**Subject:** Tender for {{#if projectName}}{{{projectName}}}{{else}}[Project Name]{{/if}} - Proposal from {{#if companyName}}{{{companyName}}}{{else}}[Your Company Name]{{/if}}

**1. Introduction**

{{#if companyName}}{{{companyName}}}{{else}}[Your Company Name]{{/if}} is pleased to submit this tender in response to your invitation for the {{#if projectName}}{{{projectName}}}{{else}}[Project Name]{{/if}} project. We have carefully reviewed the tender documents and believe our company possesses the expertise, resources, and commitment to successfully deliver this project to your complete satisfaction. {{#if estimatedCost}}Our estimated cost for the project is **OMR {{estimatedCost}}**.{{/if}}

**2. Company Overview**

{{#if companyOverview}}{{{companyOverview}}}{{else}}[Briefly describe your company - e.g., a reputable construction company] with a proven track record of delivering high-quality construction projects across Oman. We have [mention number] years of experience and a dedicated team of qualified engineers, supervisors, and skilled laborers. We pride ourselves on our commitment to safety, quality, and timely project completion. [mention certifications, if any].{{/if}}

**3. Understanding of the Project Requirements**

We understand that the {{#if projectName}}{{{projectName}}}{{else}}[Project Name]{{/if}} project primarily involves: *[Based on your analysis of the tender documents, list the key work categories, e.g., Earthwork, Concrete Works, Software Development, IT Support].* We have extensive experience in all these areas, as demonstrated by our successful completion of similar projects, including: {{#if relevantExperience}}{{{relevantExperience}}}{{else}}[mention 1-2 relevant past projects].{{/if}}

**4. Proposed Methodology & Approach**

Our approach to the {{#if projectName}}{{{projectName}}}{{else}}[Project Name]{{/if}} project will be based on the following key principles:

*   **Detailed Planning:** We will develop a comprehensive project plan, including a detailed schedule, resource allocation, and quality control procedures.
*   **Efficient Execution:** We will utilize our experienced team and proven techniques to ensure efficient and timely project execution.
*   **Quality Assurance:** We are committed to maintaining the highest standards of quality throughout the project.
*   **Safety Management:** Safety is our top priority. We will implement a comprehensive safety management plan.
*   **Communication:** We will maintain open and transparent communication with your team throughout the project lifecycle.

**5. Specific Experience in Key Categories**

*[Here, you must generate detailed paragraphs for each key work category identified in section 3. For each category, describe relevant experience and capabilities. For example, if it's 'Concrete Works', detail your expertise, materials used, and quality control methods. Use the content of the tender documents to make this section highly relevant.]*

**6. Project Team**

{{#if projectTeam}}Our proposed team includes: {{{projectTeam}}}{{else}}[Introduce key members of your project team, highlighting their qualifications and experience. Include roles like Project Manager, Site Engineer, Foreman.]..{{/if}}

**7. Financial Proposal**

Our total estimated cost for the {{#if projectName}}{{{projectName}}}{{else}}[Project Name]{{/if}} project is **{{#if estimatedCost}}OMR {{estimatedCost}}{{else}}[Total Estimated Cost in OMR]{{/if}}**. This cost includes all labor, materials, equipment, and overheads necessary to complete the project in accordance with the tender requirements. This price is valid for **{{#if priceValidityDays}}{{{priceValidityDays}}}{{else}}[Number]{{/if}} days**.

**8. Quality Assurance & Control**

[Describe your quality control procedures, mentioning relevant standards and certifications. Example: "We have a comprehensive quality control program that includes regular inspections, material testing, and documentation. We are committed to adhering to ISO 9001 standards."]

**9. Health & Safety**

[Describe your health and safety policies and procedures. Example: "We have a comprehensive health and safety plan that is regularly updated to comply with the latest regulations. All our workers receive regular safety training, and we conduct daily safety inspections."]

**10. Environmental Considerations**

[Describe how you will minimize the environmental impact of the project. Example: "We are committed to minimizing the environmental impact of our construction activities. We will implement measures to reduce waste, conserve resources, and prevent pollution."]

**11. Schedule**

We estimate that the {{#if projectName}}{{{projectName}}}{{else}}[Project Name]{{/if}} project can be completed within **{{#if estimatedSchedule}}{{{estimatedSchedule}}}{{else}}[Number] weeks/months{{/if}}** from the date of commencement. A detailed project schedule will be provided upon contract award.

**12. Conclusion**

{{#if companyName}}{{{companyName}}}{{else}}[Your Company Name]{{/if}} is confident that we can successfully deliver this project to your complete satisfaction. We have the experience, resources, and commitment to provide high-quality workmanship and on-time project completion. We look forward to the opportunity to discuss our proposal further.

Thank you for your consideration.

Sincerely,

{{#if contactInfo}}{{{contactInfo}}}{{else}}
[Your Name]
[Your Title]
[Your Company Name]
[Contact Information]
{{/if}}
`,
});

const generateTenderResponseFlow = ai.defineFlow(
  {
    name: 'generateTenderResponseFlow',
    inputSchema: GenerateTenderResponseInputSchema,
    outputSchema: GenerateTenderResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

