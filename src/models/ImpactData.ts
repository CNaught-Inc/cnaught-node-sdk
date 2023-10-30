import { ImpactEquivalents } from './ImpactEquivalents.js';
import { ImpactCategoryUsage } from './ImpactCategoryUsage.js';

export interface ImpactData {
    name: string | null;
    logo_url: string | null;
    total_offset_kgs: number;
    equivalents: ImpactEquivalents;
    categories: ImpactCategoryUsage[];
    since_date: string;
}
