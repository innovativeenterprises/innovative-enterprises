
import { z } from 'zod';

export const KnowledgeDocumentSchema = z.object({
  id: z.string(),
  documentName: z.string(),
  documentNumber: z.string().optional(),
  institutionName: z.string().optional(),
  version: z.string().optional(),
  issueDate: z.string().optional(),
  uploadDate: z.string(),
  fileName: z.string(),
  fileType: z.string(),
  dataUri: z.string().optional(),
  analysis: z.any().optional(),
});

export type KnowledgeDocument = z.infer<typeof KnowledgeDocumentSchema>;
