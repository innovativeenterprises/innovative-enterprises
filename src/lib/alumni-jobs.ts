
export interface JobPosting {
    id: string;
    title: string;
    company: string;
    location: string;
    type: 'Full-time' | 'Part-time' | 'Internship';
}

export const initialAlumniJobs: JobPosting[] = [
    { id: 'job_01', title: 'Software Engineer', company: 'Petroleum Development Oman', location: 'Muscat, Oman', type: 'Full-time' },
    { id: 'job_02', title: 'Marketing Intern', company: 'Ooredoo Oman', location: 'Muscat, Oman', type: 'Internship' },
    { id: 'job_03', title: 'Data Analyst', company: 'Bank Muscat', location: 'Muscat, Oman', type: 'Full-time' },
];

    
