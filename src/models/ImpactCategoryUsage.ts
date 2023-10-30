import { ProjectCategory } from './ProjectCategory.js';

import { ImpactProjectUsage } from './ImpactProjectUsage.js';

export interface ImpactCategoryUsage {
    category: ProjectCategory;
    offset_kgs: number;
    projects: ImpactProjectUsage[];
}
