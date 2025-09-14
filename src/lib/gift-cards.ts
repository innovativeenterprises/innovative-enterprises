
export interface GiftCard {
    id: string;
    code: string;
    design: 'Generic' | 'Birthday' | 'Thank You' | 'Holiday';
    amount: number;
    recipientName: string;
    recipientEmail: string;
    senderName: string;
    message: string;
    status: 'Active' | 'Redeemed' | 'Expired';
    issueDate: string; // ISO String
}

export const initialGiftCards: GiftCard[] = [];

    