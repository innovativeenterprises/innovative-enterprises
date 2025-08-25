
'use server';

/**
 * @fileOverview An AI agent that manages WhatsApp Business API communications.
 *
 * This file contains the server-side logic for a complete WhatsApp integration,
 * including sending template messages, handling OTP logins, and processing
 * incoming messages via a webhook.
 *
 * - sendWhatsAppMessage: Sends a free-text message.
 * - sendTemplateMessage: Sends a pre-approved template message.
 * - sendOtpViaWhatsApp: Generates and sends a one-time password via a WhatsApp template.
 * - verifyOtp: Verifies a user-submitted OTP and returns a custom Firebase Auth token.
 * - whatsappWebhook: An HTTP endpoint to receive incoming messages and events from Meta.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import axios from 'axios';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();

// IMPORTANT: These should be stored securely, e.g., in environment variables or a secret manager.
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || 'YOUR_META_ACCESS_TOKEN';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || 'YOUR_PHONE_NUMBER_ID';
const WEBHOOK_VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'ameen_verify_token';


// Schemas for input validation
const SendMessageSchema = z.object({
  to: z.string().describe("Recipient's phone number in international format."),
  message: z.string().describe("The text message content."),
});

const SendTemplateMessageSchema = z.object({
  to: z.string(),
  templateName: z.string(),
  variables: z.array(z.string()),
});

const OtpPhoneSchema = z.object({
  phone: z.string().describe("User's WhatsApp number for OTP."),
});

const VerifyOtpSchema = z.object({
  phone: z.string(),
  otp: z.string(),
});

/**
 * Sends a regular text message. Can only be used within 24 hours of a user's last message.
 */
export const sendWhatsAppMessage = ai.defineFlow(
  {
    name: 'sendWhatsAppMessage',
    inputSchema: SendMessageSchema,
    outputSchema: z.object({ success: z.boolean(), data: z.any().optional(), error: z.any().optional() }),
  },
  async ({ to, message }) => {
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: message }
        },
        { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
      );
      await db.collection("ameen_whatsapp_messages").add({
        to,
        message,
        direction: "outgoing",
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        response: response.data
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("WhatsApp Error:", error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  }
);

/**
 * Sends a pre-approved template message. Required for notifications outside the 24-hour window.
 */
export const sendTemplateMessage = ai.defineFlow({
    name: 'sendTemplateMessage',
    inputSchema: SendTemplateMessageSchema,
    outputSchema: z.any(),
}, async ({ to, templateName, variables }) => {
     try {
        const response = await axios.post(
            `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: to,
                type: "template",
                template: {
                    name: templateName,
                    language: { code: "en" },
                    components: [{
                        type: "body",
                        parameters: variables.map(v => ({ type: "text", text: v }))
                    }]
                }
            },
            { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );
        return { success: true, data: response.data };
    } catch (err: any) {
        console.error("Error sending template:", err.response?.data || err);
        throw new Error("Failed to send template message");
    }
});


/**
 * Generates a 6-digit OTP, saves it to Firestore with a 5-minute expiry,
 * and sends it to the user via a pre-approved WhatsApp template.
 */
export const sendOtpViaWhatsApp = ai.defineFlow({
    name: 'sendOtpViaWhatsApp',
    inputSchema: OtpPhoneSchema,
    outputSchema: z.any(),
}, async ({ phone }) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpRef = db.collection("ameen_otps").doc(phone);
    const existing = await otpRef.get();

    if (existing.exists && Date.now() < existing.data()!.expiresAt) {
        throw new Error("OTP already sent. Please wait 5 minutes.");
    }

    await otpRef.set({
        otp,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: Date.now() + 5 * 60 * 1000,
    });

    return sendTemplateMessage({ to: phone, templateName: 'otp_login', variables: [otp] });
});

/**
 * Verifies a user-submitted OTP against the one stored in Firestore.
 * If valid, it creates a Firebase Auth user (if one doesn't exist) and
 * returns a custom auth token for login.
 */
export const verifyOtp = ai.defineFlow({
    name: 'verifyOtp',
    inputSchema: VerifyOtpSchema,
    outputSchema: z.any(),
}, async ({ phone, otp }) => {
    const otpRef = db.collection("ameen_otps").doc(phone);
    const doc = await otpRef.get();

    if (!doc.exists) throw new Error("OTP not found or already used.");
    
    const otpData = doc.data()!;
    if (Date.now() > otpData.expiresAt) {
        await otpRef.delete();
        throw new Error("OTP expired. Please request a new one.");
    }
    if (otpData.otp !== otp) {
        throw new Error("Invalid OTP.");
    }

    let uid;
    try {
        const user = await admin.auth().getUserByPhoneNumber("+" + phone);
        uid = user.uid;
    } catch (error) {
        const newUser = await admin.auth().createUser({ phoneNumber: "+" + phone });
        uid = newUser.uid;
    }

    await db.collection("ameen_users").doc(uid).set({
        phoneNumber: "+" + phone,
        lastLogin: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    const token = await admin.auth().createCustomToken(uid);
    await otpRef.delete();

    return { success: true, token };
});

/**
 * Webhook to receive messages from WhatsApp. This must be deployed as an
 * HTTP-triggered Cloud Function and the URL provided to Meta.
 */
export const whatsappWebhook = ai.defineFlow({
    name: "whatsappWebhook",
    inputSchema: z.any(),
    outputSchema: z.any(),
    middleware: ['express'],
}, async (req, res) => {
    if (req.method === "GET") {
        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];

        if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
            console.log("Webhook verified");
            res.status(200).send(challenge);
        } else {
            console.warn("Webhook verification failed");
            res.sendStatus(403);
        }
        return;
    }

    if (req.method === "POST") {
        const body = req.body;
        console.log("Incoming WhatsApp message:", JSON.stringify(body, null, 2));

        try {
            const entry = body.entry?.[0];
            const changes = entry?.changes?.[0];
            const value = changes?.value;
            const messages = value?.messages;

            if (messages && messages.length > 0) {
                const msg = messages[0];
                const from = msg.from;
                const text = msg.text?.body || "";

                await db.collection("ameen_whatsapp_messages").add({
                    from,
                    message: text,
                    direction: "incoming",
                    timestamp: admin.firestore.FieldValue.serverTimestamp()
                });
                
                // Auto-reply
                await axios.post(
                    `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
                    {
                        messaging_product: "whatsapp",
                        to: from,
                        type: "text",
                        text: { body: "Hello! Thank you for messaging Ameen. We will respond shortly." }
                    },
                    { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` } }
                );
            }
            res.sendStatus(200);
        } catch (err) {
            console.error("Webhook Error:", err);
            res.sendStatus(500);
        }
        return;
    }

    res.sendStatus(404);
});
