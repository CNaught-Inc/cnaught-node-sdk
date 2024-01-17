import type { ProjectCategoryWithProjects } from './ProjectCategoryWithProjects.js';

export interface PortfolioCategoryAllocation {
    allocated_fraction: number;
    category: ProjectCategoryWithProjects;
}
