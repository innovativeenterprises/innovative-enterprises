
export interface UserDocument {
    id: string;
    name: string;
    type: 'ID Card' | 'Passport' | 'Tenancy Contract' | 'Utility Bill' | 'Insurance Policy';
    uploadDate: string;
    expiryDate?: string;
}

export const initialUserDocuments: UserDocument[] = [
    {
        id: 'doc_1',
        name: 'Omani National ID',
        type: 'ID Card',
        uploadDate: '2023-01-15',
        expiryDate: '2028-05-20',
    },
    {
        id: 'doc_2',
        name: 'Apartment Tenancy Contract',
        type: 'Tenancy Contract',
        uploadDate: '2023-08-20',
        expiryDate: '2024-08-19',
    },
    {
        id: 'doc_3',
        name: 'Car Insurance Policy',
        type: 'Insurance Policy',
        uploadDate: '2024-01-01',
        expiryDate: '2024-12-31',
    },
    {
        id: 'doc_4',
        name: 'Electricity Bill - July 2024',
        type: 'Utility Bill',
        uploadDate: '2024-08-01',
    }
];
