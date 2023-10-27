import { Project } from './Project';

export interface ImpactProjectUsage {
    project: Project;
    offset_kgs: number;
    vintages: string;
}
