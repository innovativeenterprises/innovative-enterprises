
export interface AuditSubmission {
    id: string;
    submissionDate: string; // ISO Date String
    companyName: string;
    fiscalYear: string;
    analysisType: 'Full Audit' | 'Compliance Check' | 'Internal Review' | 'Forensic Analysis';
    assignedOffice: string;
    status: 'Submitted' | 'In Review' | 'Completed' | 'Action Required';
}

export const initialAuditSubmissions: AuditSubmission[] = [
    {
        id: 'audit_1',
        submissionDate: '2024-07-28T10:00:00Z',
        companyName: 'Innovative Enterprises',
        fiscalYear: '2023',
        analysisType: 'Full Audit',
        assignedOffice: 'Deloitte & Touche (M.E.) - Oman',
        status: 'In Review',
    },
    {
        id: 'audit_2',
        submissionDate: '2024-06-15T14:30:00Z',
        companyName: 'PANOSPACE',
        fiscalYear: '2023',
        analysisType: 'Compliance Check',
        assignedOffice: 'KPMG Lower Gulf Limited - Oman',
        status: 'Completed',
    },
     {
        id: 'audit_3',
        submissionDate: '2024-05-20T09:00:00Z',
        companyName: 'Nova Commerce Division',
        fiscalYear: '2022',
        analysisType: 'Internal Review',
        assignedOffice: 'Ernst & Young (EY) - Oman',
        status: 'Completed',
    }
];
