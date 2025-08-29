export interface KnowledgeDocument {
  id: string;
  documentName: string;
  documentNumber?: string;
  institutionName?: string;
  version?: string;
  issueDate?: string;
  uploadDate: string;
  fileName: string;
  fileType: string;
  dataUri: string;
}

export const initialKnowledgeBase: KnowledgeDocument[] = [
  {
    id: 'kb_1',
    documentName: 'Oman Labour Law',
    documentNumber: 'Royal Decree 35/2003',
    institutionName: 'Ministry of Labour',
    version: '2.1',
    issueDate: '2003-04-06',
    uploadDate: '2024-07-15',
    fileName: 'Oman_Labour_Law_2003.pdf',
    fileType: 'application/pdf',
    dataUri: '',
  },
  {
    id: 'kb_2',
    documentName: 'Commercial Companies Law',
    documentNumber: 'Royal Decree 18/2019',
    institutionName: 'Ministry of Commerce, Industry & Investment Promotion',
    version: '1.0',
    issueDate: '2019-02-13',
    uploadDate: '2024-07-20',
    fileName: 'Oman_Commercial_Companies_Law.pdf',
    fileType: 'application/pdf',
    dataUri: '',
  },
];
