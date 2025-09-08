
'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/tender-response-assistant';
import '@/ai/flows/ai-powered-faq';
import '@/ai/flows/social-media-post-generator';
import '@/ai/flows/legal-agent';
import '@/ai/flows/cv-enhancement';
import '@/ai/flows/letter-of-interest';
import '@/ai/flows/work-order-analysis';
import '@/ai/flows/train-agent';
import '@/ai/flows/image-generator';
import '@/ai/flows/partnership-inquiry';
import '@/ai/flows/document-translation';
import '@/ai/flows/cr-analysis';
import '@/ai/flows/identity-analysis';
import '@/ai/flows/meeting-analysis';
import '@/ai/flows/generate-agreement';
import '@/ai/flows/interview-coach';
import '@/ai/flows/interview-feedback';
import '@/ai/flows/whatsapp-agent';
import '@/ai/flows/project-inception';
import '@/ai/flows/cctv-quotation';
import '@/ai/flows/floor-plan-analysis';
import '@/ai/flows/asset-rental-agent';
import '@/ai/flows/sanad-task-analysis';
import '@/ai/flows/sanad-office-registration';
import '@/ai/flows/business-hub-agent';
import '@/ai/flows/text-to-speech';
import '@/ai/flows/ecommerce-agent';
import '@/ai/flows/pro-task-analysis';
import '@/ai/flows/subscription-reminders';
import '@/ai/flows/web-scraper-agent';
import '@/ai/flows/feasibility-study';
import '@/ai/flows/ameen-smart-lock';
import '@/ai/flows/video-generator';
import '@/ai/flows/admissions-agent';
import '@/ai/flows/boq-generator';
import '@/ai/flows/it-rental-agent';
import '@/ai/flows/property-valuation';

// Make sure all flows are loaded into the development server.
import {
  answerEcommerceQuery,
  answerHubQuery,
  answerQuestion,
  analyzeApplication,
  analyzeCrDocument,
  analyzeCv,
  analyzeFloorPlan,
  analyzeIdentity,
  analyzeKnowledgeDocument,
  analyzeMeeting,
  analyzeProTask,
  analyzeSanadTask,
  analyzeWorkOrder,
  controlSmartLock,
  evaluateProperty,
  generateAgreement,
  generateEnhancedCv,
  generateLetterOfInterest,
  generateSocialMediaPost,
  generateTenderResponse,
  generateImage,
  generateProjectPlan,
  generateIctProposal,
  generateAssetRentalProposal,
  getInterviewFeedback,
  generateInterviewQuestions,
} from './flows';

// Export all flows for discoverability.
export {
  answerEcommerceQuery,
  answerHubQuery,
  answerQuestion,
  analyzeApplication,
  analyzeCrDocument,
  analyzeCv,
  analyzeFloorPlan,
  analyzeIdentity,
  analyzeKnowledgeDocument,
  analyzeMeeting,
  analyzeProTask,
  analyzeSanadTask,
  analyzeWorkOrder,
  controlSmartLock,
  evaluateProperty,
  generateAgreement,
  generateEnhancedCv,
  generateLetterOfInterest,
  generateSocialMediaPost,
  generateTenderResponse,
  generateImage,
  generateProjectPlan,
  generateIctProposal,
  generateAssetRentalProposal,
  getInterviewFeedback,
  generateInterviewQuestions,
};
