
export type Application = {
    id: string;
    name: string;
    program: string;
    readinessScore: number;
    status: string;
};

export const initialApplications: Application[] = [
    { id: 'APP-12345678', name: 'Nasser Al-Busaidi', program: 'B.Sc. in Artificial Intelligence', readinessScore: 92, status: 'Interview' },
    { id: 'APP-87654321', name: 'Fatima Al-Hinai', program: 'M.Sc. in Data Science', readinessScore: 85, status: 'Conditional Offer' },
    { id: 'APP-23456789', name: 'John Smith', program: 'B.Eng. in Robotics', readinessScore: 78, status: 'Interview' },
    { id: 'APP-98765432', name: 'Aisha Al-Riyami', program: 'B.Sc. in Artificial Intelligence', readinessScore: 65, status: 'Further Review' },
    { id: 'APP-34567890', name: 'Mohammed Al-Farsi', program: 'Ph.D. in Machine Learning', readinessScore: 45, status: 'Reject' },
];
