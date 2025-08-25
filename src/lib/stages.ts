
export interface ProjectStage {
    id: string;
    name: string;
    description: string;
}

export const initialStages: ProjectStage[] = [
    { id: 'stage_1', name: 'Idea', description: 'Identify the problem or opportunity.' },
    { id: 'stage_2', name: 'Planning', description: 'Define goals, scope, budget, and timeline.' },
    { id: 'stage_3', name: 'Validation', description: 'Test the idea with users or market research.' },
    { id: 'stage_4', name: 'Design', description: 'Create UX/UI and system architecture.' },
    { id: 'stage_5', name: 'Development', description: 'Build the product.' },
    { id: 'stage_6', name: 'Testing', description: 'Check for bugs and ensure quality.' },
    { id: 'stage_7', name: 'Launch', description: 'Release the product to users.' },
    { id: 'stage_8', name: 'Post-Launch', description: 'Monitor, update, and improve.' },
    { id: 'stage_9', name: 'Ready', description: 'The product is live and on the market.' },
    { id: 'stage_10', name: 'Research Phase', description: 'Initial exploration and research of a new concept.' },
];
