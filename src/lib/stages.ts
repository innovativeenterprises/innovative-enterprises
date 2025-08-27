
export interface ProjectStage {
    id: string;
    name: string;
    description: string;
}

export const initialStages: ProjectStage[] = [
    { id: 'stage_1', name: 'Idea Phase', description: 'Initial concept and high-level brainstorming.' },
    { id: 'stage_2', name: 'Research Phase', description: 'In-depth market research, competitive analysis, and feasibility studies.' },
    { id: 'stage_3', name: 'Planning Phase', description: 'Defining project scope, goals, requirements, timeline, and resource allocation.' },
    { id: 'stage_4', name: 'Validation Phase', description: 'Validating the core concept with target users through surveys, interviews, or prototypes.' },
    { id: 'stage_5', name: 'Design Phase', description: 'Creating wireframes, mockups, UI/UX designs, and system architecture.' },
    { id: 'stage_6', name: 'Development Phase', description: 'Writing code and building the actual product based on the design specifications.' },
    { id: 'stage_7', name: 'Testing Phase', description: 'Performing QA, bug fixing, and user acceptance testing (UAT).' },
    { id: 'stage_8', name: 'Launch Phase', description: 'Preparing for and executing the public release of the product.' },
    { id: 'stage_9', name: 'Post-Launch Phase', description: 'Monitoring performance, gathering feedback, and providing initial support.' },
    { id: 'stage_10', name: 'Live & Operating', description: 'The product is stable, live, and undergoing regular maintenance and updates.' },
];
