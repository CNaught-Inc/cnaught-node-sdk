import type { ProjectCategory } from './ProjectCategory.js';

import type { ImpactProjectUsage } from './ImpactProjectUsage.js';

export interface ImpactCategoryUsage {
    category: ProjectCategory;
    offset_kgs: number;
    projects: ImpactProjectUsage[];
}
