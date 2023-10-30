import type { Project } from './Project.js';
import type { Retirement } from './Retirement.js';

export interface ProjectAllocation {
    project: Project;
    amount_kg: number;
    retirements: Retirement[];
}
