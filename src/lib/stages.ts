
export interface ProjectStage {
  id: number;
  name: "Idea Phase" | "Planning Phase" | "Development Phase" | "Testing Phase" | "Launch Phase" | "Live & Operating" | "On Hold" | "Research Phase" | "Validation Phase";
}

export const initialStages: ProjectStage[] = [
    { id: 1, name: "Idea Phase" },
    { id: 2, name: "Research Phase" },
    { id: 3, name: "Planning Phase" },
    { id: 4, name: "Design Phase" },
    { id: 5, name: "Development Phase" },
    { id: 6, name: "Testing Phase" },
    { id: 7, name: "Launch Phase" },
    { id: 8, name: "Live & Operating" },
];
