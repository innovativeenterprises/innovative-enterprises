
import type { Student } from './students.schema';

export const initialStudents: Student[] = [
    { id: 'SQU202101', name: 'Fatima Al-Hinai', major: 'Computer Science', year: 3, status: 'On Track', photo: 'https://i.pravatar.cc/100?img=5', tuitionBilled: 12000, scholarshipAmount: 2000, amountPaid: 10000 },
    { id: 'GU202205', name: 'John Smith', major: 'Mechanical Engineering', year: 2, status: 'Needs Attention', photo: 'https://i.pravatar.cc/100?img=8', tuitionBilled: 15000, scholarshipAmount: 0, amountPaid: 7000 },
];
