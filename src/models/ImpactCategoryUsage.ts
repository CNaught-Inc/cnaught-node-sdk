import { ProjectCategory } from './ProjectCategory';

import { ImpactProjectUsage } from './ImpactProjectUsage';

export interface ImpactCategoryUsage {
    category: ProjectCategory;
    offset_kgs: number;
    projects: ImpactProjectUsage[];
}