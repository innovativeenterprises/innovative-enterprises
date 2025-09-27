
'use client';

import { Badge } from '@/components/ui/badge';

export const getStatusBadge = (status: string) => {
    switch (status) {
        // Provider Statuses
        case "Vetted":
            return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Vetted</Badge>;
        case "Pending Review":
            return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Pending Review</Badge>;
        case "On Hold":
            return <Badge variant="destructive" className="bg-gray-500/20 text-gray-700 hover:bg-gray-500/30">On Hold</Badge>;
        
        // Opportunity Statuses
        case 'Open':
            return <Badge variant="default" className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30">Open</Badge>;
        case 'In Progress':
            return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">In Progress</Badge>;
        case 'Closed':
            return <Badge variant="outline">Closed</Badge>;

        // Payment/Transaction Statuses
        case 'Paid':
            return <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Paid</Badge>;
        case 'Pending':
            return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Pending</Badge>;
        case 'Overdue':
            return <Badge variant="destructive">Overdue</Badge>;

        // Stairspace Booking Statuses
        case 'Booked':
             return <Badge variant="default" className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30">Booked</Badge>;
        case 'Confirmed':
            return <Badge variant="default" className="bg-green-700 text-white">Confirmed</Badge>;
        
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
}
