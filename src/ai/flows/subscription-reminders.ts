
'use server';

/**
 * @fileOverview An AI flow to send subscription renewal reminders.
 *
 * This flow is designed to be run on a schedule (e.g., daily cron job).
 * It finds providers whose subscriptions are expiring in 30, 15, 7, or 1 day(s)
 * and sends them a renewal notification via WhatsApp.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { initialProviders } from '@/lib/providers';
import { sendTemplateMessage } from './whatsapp-agent';

const CheckSubscriptionsInputSchema = z.object({
  // In a real scenario, you might pass the current date to allow for testing.
  // For this implementation, we'll use the server's current date.
});

const CheckSubscriptionsOutputSchema = z.object({
  notificationsSent: z.number().describe('The total number of notifications sent.'),
  details: z.array(z.object({
    providerName: z.string(),
    daysUntilExpiry: z.number(),
    phoneNumber: z.string().optional(),
  })).describe('Details of each notification sent.'),
});

export const checkSubscriptionsAndSendReminders = ai.defineFlow(
  {
    name: 'checkSubscriptionsAndSendReminders',
    inputSchema: CheckSubscriptionsInputSchema,
    outputSchema: CheckSubscriptionsOutputSchema,
  },
  async () => {
    console.log("Running daily subscription check...");
    const providers = initialProviders; // In a real app, this would query a database.
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to the start of the day

    const notificationsToSend = [];

    for (const provider of providers) {
      if (!provider.subscriptionExpiry || provider.subscriptionTier === 'None' || provider.subscriptionTier === 'Lifetime') {
        continue; // Skip providers with no expiry or non-expiring tiers
      }

      const expiryDate = new Date(provider.subscriptionExpiry);
      expiryDate.setHours(0, 0, 0, 0); // Normalize to the start of the day

      const timeDiff = expiryDate.getTime() - today.getTime();
      const daysUntilExpiry = Math.ceil(timeDiff / (1000 * 3600 * 24));

      const reminderIntervals = [30, 15, 7, 1];
      if (reminderIntervals.includes(daysUntilExpiry)) {
        notificationsToSend.push({
          providerName: provider.name,
          // We need a phone number to send WhatsApp messages.
          // In a real app, this would be on the provider object. We'll use a placeholder.
          phoneNumber: `+968...`, // Placeholder phone number
          daysUntilExpiry,
        });
      }
    }
    
    const details: z.infer<typeof CheckSubscriptionsOutputSchema>['details'] = [];

    for (const notification of notificationsToSend) {
        const { providerName, phoneNumber, daysUntilExpiry } = notification;
        
        // This assumes you have a WhatsApp template named 'subscription_reminder'
        // with variables for {1}: Provider Name and {2}: Days until expiry.
        try {
            if (phoneNumber) {
                // In a real app, you'd pull the real phone number.
                // For now, we just log it as we don't have real numbers.
                console.log(`Simulating WhatsApp message to ${providerName} (${phoneNumber}): Your subscription expires in ${daysUntilExpiry} days.`);
                
                // UNCOMMENT THE LINE BELOW IN A REAL SCENARIO WITH REAL PHONE NUMBERS
                // await sendTemplateMessage({ to: phoneNumber, templateName: 'subscription_reminder', variables: [providerName, String(daysUntilExpiry)] });

                details.push({ providerName, daysUntilExpiry, phoneNumber });
            }
        } catch (error) {
            console.error(`Failed to send notification to ${providerName}`, error);
        }

        // Email logic would go here as well, if an email service was configured.
        console.log(`Simulating Email to ${providerName}: Your subscription expires in ${daysUntilExpiry} days.`);
    }

    return {
        notificationsSent: details.length,
        details,
    };
  }
);
