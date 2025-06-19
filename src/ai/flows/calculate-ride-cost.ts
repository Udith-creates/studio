'use server';

/**
 * @fileOverview Calculates a fair ride cost based on distance and current fuel prices.
 *
 * - calculateRideCost - A function that calculates the ride cost.
 * - CalculateRideCostInput - The input type for the calculateRideCost function.
 * - CalculateRideCostOutput - The return type for the calculateRideCost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateRideCostInputSchema = z.object({
  distanceMiles: z.number().describe('The distance of the ride in miles.'),
});

export type CalculateRideCostInput = z.infer<typeof CalculateRideCostInputSchema>;

const CalculateRideCostOutputSchema = z.object({
  fairCost: z.number().describe('The estimated fair cost for the ride.'),
  breakdown: z.string().describe('A breakdown of the cost calculation.'),
});

export type CalculateRideCostOutput = z.infer<typeof CalculateRideCostOutputSchema>;

export async function calculateRideCost(input: CalculateRideCostInput): Promise<CalculateRideCostOutput> {
  return calculateRideCostFlow(input);
}

const calculateRideCostPrompt = ai.definePrompt({
  name: 'calculateRideCostPrompt',
  input: {schema: CalculateRideCostInputSchema},
  output: {schema: CalculateRideCostOutputSchema},
  prompt: `You are a ride cost estimator. You will be provided the distance of the ride in miles. Using this information, calculate a fair cost for the ride, taking into account current average fuel prices and standard vehicle MPG.

Distance: {{distanceMiles}} miles

Output the estimated fair cost for the ride, as well as a detailed breakdown of the calculation.
Make sure to only output the number value of the fair cost.`, 
});

const calculateRideCostFlow = ai.defineFlow(
  {
    name: 'calculateRideCostFlow',
    inputSchema: CalculateRideCostInputSchema,
    outputSchema: CalculateRideCostOutputSchema,
  },
  async input => {
    const {output} = await calculateRideCostPrompt(input);
    return output!;
  }
);
