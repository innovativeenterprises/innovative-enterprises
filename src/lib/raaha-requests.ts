
export interface HireRequest {
  id: string;
  workerId: string;
  workerName: string;
  clientName: string;
  clientContact: string;
  requestDate: string; // ISO date string
  status: 'Pending' | 'Contacted' | 'Interviewing' | 'Hired' | 'Closed';
}

export const initialRequests: HireRequest[] = [
    {
        id: 'req_01',
        workerId: 'worker_001',
        workerName: 'Maria Dela Cruz',
        clientName: 'Ahmed Al-Farsi',
        clientContact: '+968 99123456',
        requestDate: '2024-07-28T10:00:00Z',
        status: 'Pending'
    },
    {
        id: 'req_02',
        workerId: 'worker_002',
        workerName: 'Siti Nurhaliza',
        clientName: 'Fatima Al-Balushi',
        clientContact: 'fatima.b@example.com',
        requestDate: '2024-07-27T15:30:00Z',
        status: 'Contacted'
    },
    {
        id: 'req_03',
        workerId: 'worker_006',
        workerName: 'Kumari Perera',
        clientName: 'Expat Family Residences',
        clientContact: 'manager@expatres.com',
        requestDate: '2024-07-26T11:00:00Z',
        status: 'Interviewing'
    }
];
