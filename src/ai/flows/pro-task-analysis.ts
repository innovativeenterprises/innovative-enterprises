
'use server';

/**
 * @fileOverview An AI agent that determines required documents and estimates fees for a PRO task.
 */

import { ai } from '@/ai/genkit';
import {
    ProTaskAnalysisInput,
    ProTaskAnalysisInputSchema,
    ProTaskAnalysisOutput,
    ProTaskAnalysisOutputSchema,
    ProTaskAnalysis,
    ProTaskAnalysisSchema,
} from './pro-task-analysis.schema';

export async function analyzeProTask(input: ProTaskAnalysisInput): Promise<ProTaskAnalysisOutput> {
  return proTaskAnalysisFlow(input);
}

const singleTaskAnalysisPrompt = ai.definePrompt({
    name: 'singleProTaskAnalysisPrompt',
    inputSchema: z.object({ serviceName: z.string() }),
    outputSchema: ProTaskAnalysisSchema,
     prompt: `You are "Fahim," an expert AI agent specializing in Omani government regulations and Public Relations Officer (PRO) procedures. Your knowledge is extensive and up-to-date.

A user has selected the following service: **{{{serviceName}}}**

Your task is to analyze ONLY this single service:
1.  **Determine Required Documents:** Based on your knowledge of Omani government portals and common requirements, create a comprehensive list of all documents a person or company would need to provide to complete this specific transaction. Be precise (e.g., "Copy of CR," "Passport copy of all partners," "Tenancy agreement").
2.  **Estimate Government Fees:** Create a fee breakdown. This must ONLY include the **Official Government Fees** for the '{{{serviceName}}}' service. Do NOT include any allowances like fuel or snacks in this part.
3.  **Provide Important Notes:** If there are any critical prerequisites, common issues, or important pieces of information the user should know before starting, add them to the 'notes' field. For example, "Ensure the CR is active and has no violations before proceeding." or "The applicant must be physically present in Oman." If there are no special notes, leave this field blank.

Return the result for this single task in the specified structured JSON format.
`,
});

const proTaskAnalysisFlow = ai.defineFlow(
  {
    name: 'proTaskAnalysisFlow',
    inputSchema: ProTaskAnalysisInputSchema,
    outputSchema: ProTaskAnalysisOutputSchema,
  },
  async (input) => {
    // 1. Analyze each task in parallel
    const analysisPromises = input.serviceNames.map(serviceName => 
        singleTaskAnalysisPrompt({ serviceName })
    );
    const analysisResults = await Promise.all(analysisPromises);
    
    const tasks: ProTaskAnalysis[] = analysisResults.map(result => result.output!).filter(Boolean);

    // 2. Consolidate fees and calculate total
    const totalFees: { description: string; amount: number }[] = [];
    let grandTotal = 0;

    tasks.forEach(task => {
        task.fees.forEach(fee => {
            totalFees.push({ description: `${fee.description} (${task.serviceName})`, amount: fee.amount });
            grandTotal += fee.amount;
        });
    });

    // Add standard allowances ONCE
    const fuelAllowance = 3.000;
    const snacksAllowance = 2.000;
    
    totalFees.push({ description: 'Fuel Allowance', amount: fuelAllowance });
    totalFees.push({ description: 'Snacks & Refreshments Allowance', amount: snacksAllowance });
    grandTotal += fuelAllowance + snacksAllowance;


    return {
        tasks,
        totalFees,
        grandTotal,
    };
  }
);
