
import type { KnowledgeDocument } from './knowledge.schema';

export const initialKnowledgeBase: KnowledgeDocument[] = [
  {
    id: 'kb_1',
    documentName: 'Oman Labour Law',
    documentNumber: 'Royal Decree 35/2003',
    institutionName: 'Ministry of Labour',
    issueDate: '2003-01-01',
    uploadDate: '2024-07-30',
    fileName: 'Oman_Labour_Law.pdf',
    fileType: 'pdf',
  },
  {
    id: 'kb_2',
    documentName: 'Commercial Companies Law',
    documentNumber: 'Royal Decree 18/2019',
    institutionName: 'MOCIIP',
    issueDate: '2019-01-01',
    uploadDate: '2024-07-30',
    fileName: 'Oman_Companies_Law.pdf',
    fileType: 'pdf',
  },
];
