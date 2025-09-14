
export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
}

export const initialJobs: JobPosting[] = [
  { id: 'job_1', title: 'Senior Frontend Developer', company: 'Innovative Enterprises', location: 'Muscat, Oman', type: 'Full-time' },
  { id: 'job_2', title: 'Marketing Manager', company: 'Omantel', location: 'Muscat, Oman', type: 'Full-time' },
  { id: 'job_3', title: 'Data Analyst (Remote)', company: 'Tech Solutions Inc.', location: 'Remote', type: 'Contract' },
  { id: 'job_4', title: 'UX/UI Designer', company: 'Creative Agency', location: 'Dubai, UAE', type: 'Full-time' },
];
