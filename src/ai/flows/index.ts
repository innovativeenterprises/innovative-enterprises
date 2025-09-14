
'use server';
import {answerQuestion as answerFaqQuestion} from './ai-powered-faq';
import {analyzeApplication} from './admissions-agent';
import {analyzeCrDocument} from './cr-analysis';
import {analyzeCv, generateEnhancedCv} from './cv-enhancement';
import {analyzeFloorPlan} from './floor-plan-analysis';
import {analyzeIdentity} from './identity-analysis';
import {analyzeKnowledgeDocument} from './knowledge-document-analysis';
import {analyzeMeeting} from './meeting-analysis';
import {analyzeProTask} from './pro-task-analysis';
import {analyzeSanadTask} from './sanad-task-analysis';
import {analyzeWorkOrder} from './work-order-analysis';
import {answerHubQuery} from './business-hub-agent';
import {answerEcommerceQuery} from './ecommerce-agent';
import {controlSmartLock} from './ameen-smart-lock';
import {evaluateProperty} from './property-valuation';
import {generateAgreement} from './generate-agreement';
import {generateLetterOfInterest} from './letter-of-interest';
import {generateSocialMediaPost} from './social-media-post-generator';
import {generateTenderResponse} from './tender-response-assistant';
import {generateImage} from './image-generator';
import {generateVideo} from './video-generator';
import {generateProjectPlan} from './project-inception';
import {generateIctProposal} from './cctv-quotation';
import {generateAssetRentalProposal} from './asset-rental-agent';
import {generateInterviewQuestions} from './interview-coach';
import {getInterviewFeedback} from './interview-feedback';
import {generateAdaptiveLesson} from './adaptive-learning-tutor';
import {generateLearningPath} from './learning-path-generator';
import {generateQuiz} from './quiz-generator';
import {generateTimetable} from './timetable-generator';
import {generateElectionMaterials} from './community-elections-agent';
import {fillPdfForm} from './pdf-form-filler';
import { findScholarships } from './guardian-ai/scholarship-agent';
import { generateScholarshipEssay } from './guardian-ai/scholarship-essay-assistant';
import { wellbeingCheckin } from './guardian-ai/wellbeing-checkin';
import { analyzeSeo } from './seo-analyzer';

// This file is a public API for the AI flows.
// It is used by the client-side components to call the AI flows.
// It should not contain any confidential information.

export {
  answerEcommerceQuery,
  answerFaqQuestion,
  answerHubQuery,
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
  findScholarships,
  generateAgreement,
  generateEnhancedCv,
  generateIctProposal,
  generateImage,
  generateVideo,
  generateLetterOfInterest,
  generateProjectPlan,
  generateSocialMediaPost,
  generateTenderResponse,
  generateAssetRentalProposal,
  generateInterviewQuestions,
  getInterviewFeedback,
  generateAdaptiveLesson,
  generateLearningPath,
  generateQuiz,
  generateTimetable,
  generateElectionMaterials,
  fillPdfForm,
  generateScholarshipEssay,
  wellbeingCheckin,
  analyzeSeo,
};

    