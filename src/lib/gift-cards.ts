
import type { GiftCard } from './gift-cards.schema';

export const initialGiftCards: GiftCard[] = [
  {
    id: 'gc_1234',
    code: 'ABCD-EFGH-IJKL-MNOP',
    amount: 50,
    status: 'Active',
    issueDate: '2024-07-20T10:00:00Z',
    design: 'Generic',
    recipientName: 'John Doe',
    recipientEmail: 'john.doe@example.com',
    senderName: 'Jane Smith',
    message: 'Happy Birthday!',
  },
];
