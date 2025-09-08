
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
import '@/ai* Connect to the Google Generative AI platform
 */
import {generateAgreement} from '@/ai/flows/generate-agreement';
import {generateEnhancedCv} from '@/ai/flows/cv-enhancement';
import {generateLetterOfInterest} from '@/ai/flows/letter-of-interest';
import {generateSocialMediaPost} from '@/ai/flows/social-media-post-generator';
import {generateTenderResponse} from '@/ai/flows/tender-response-assistant';
import {generateImage} from '@/ai/flows/image-generator';
import {generateProjectPlan} from '@/ai/flows/project-inception';
import {generateIctProposal} from '@/ai/flows/cctv-quotation';
import {generateAssetRentalProposal} from '@/ai/flows/asset-rental-agent';
import {getInterviewFeedback} from './interview-feedback';
import {generateInterviewQuestions} from './interview-coach';
import {generateAdaptiveLesson} from './adaptive-learning-tutor';
import {generateLearningPath} from './learning-path-generator';
import {generateQuiz} from './quiz-generator';
import {generateTimetable} from './timetable-generator';
import {generateElectionMaterials} from './community-elections-agent';

export {
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
  annotateImage,
  controlSmartLock,
  estimateBoq,
  evaluateProperty,
  extractPropertyDetailsFromUrl,
  findBestPropertyMatch,
  findHelpers,
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
  generateAdaptiveLesson,
  generateLearningPath,
  generateQuiz,
  generateTimetable,
  generateElectionMaterials,
};
```