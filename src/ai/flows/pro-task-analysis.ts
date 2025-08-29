
'use server';

/**
 * @fileOverview An AI agent that determines required documents and estimates fees for a PRO task.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
    ProTaskAnalysisInput,
    ProTaskAnalysisInputSchema,
    ProTaskAnalysisOutput,
    ProTaskAnalysisOutputSchema,
    getTravelPlanTool,
    getRequiredInstitutions,
} from './pro-task-analysis.schema';
import { sanadServiceGroups } from '@/lib/sanad-services';

const FUEL_RATE_PER_KM = 0.400; // OMR per KM. This can be moved to admin settings later.
const SNACKS_ALLOWANCE = 2.000;

export async function analyzeProTask(input: ProTaskAnalysisInput): Promise<ProTaskAnalysisOutput> {
    return proTaskAnalysisFlow(input);
}

const proTaskAnalysisFlow = ai.defineFlow(
  {
    name: 'proTaskAnalysisFlow',
    inputSchema: ProTaskAnalysisInputSchema,
    outputSchema: ProTaskAnalysisOutputSchema,
  },
  async (input) => {

    // 1. Determine which ministries to visit based on the service name
    const requiredInstitutionsResult = await getRequiredInstitutions({ serviceName: input.serviceName });
    const ministriesToVisit = requiredInstitutionsResult.requiredInstitutions;
    
    // 2. Get travel plan and calculate fuel allowance
    const travelPlan = await getTravelPlanTool({ 
        ministriesToVisit: ministriesToVisit,
        governorate: input.governorate,
        startLocationName: input.startLocationName,
        startLocationCoords: input.startLocationCoords
    });
    
    let tripDescription = travelPlan.tripDescription;
    let fuelAllowance = 0;

    if (travelPlan.totalDistanceKm > 0) {
        fuelAllowance = travelPlan.totalDistanceKm * FUEL_RATE_PER_KM;
    }
    
    // 3. Consolidate allowances and calculate total
    const allowances: { description: string; amount: number }[] = [];
    let grandTotal = 0;

    if (fuelAllowance > 0) {
        allowances.push({ description: `Fuel Allowance (${travelPlan.totalDistanceKm.toFixed(1)} km)`, amount: fuelAllowance });
        grandTotal += fuelAllowance;
    }
    
    allowances.push({ description: 'Snacks & Refreshments Allowance', amount: SNACKS_ALLOWANCE });
    grandTotal += SNACKS_ALLOWANCE;


    return {
        tripDescription,
        allowances,
        grandTotal,
        unmappedLocations: travelPlan.unmappedLocations.length > 0 ? travelPlan.unmappedLocations : undefined,
    };
  }
);
