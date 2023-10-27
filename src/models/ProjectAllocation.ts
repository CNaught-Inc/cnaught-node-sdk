import { Project } from './Project';
import { Retirement } from './Retirement';

export interface ProjectAllocation {
    project: Project;
    amount_kg: number;
    retirements: Retirement[];
}
