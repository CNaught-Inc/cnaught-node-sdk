import type { ImpactProjectUsage } from './ImpactProjectUsage.js';
import type { ImpactCategory } from './ImpactCategory.js';

export interface ImpactCategoryUsage {
    category: ImpactCategory;
    offset_kgs: number;
    projects: ImpactProjectUsage[];
}
