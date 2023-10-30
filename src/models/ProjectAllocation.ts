import { Project } from './Project.js';
import { Retirement } from './Retirement.js';

export interface ProjectAllocation {
    project: Project;
    amount_kg: number;
    retirements: Retirement[];
}
