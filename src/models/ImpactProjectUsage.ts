import type { Project } from './Project.js';

export interface ImpactProjectUsage {
    project: Project;
    offset_kgs: number;
    vintages: string;
}
