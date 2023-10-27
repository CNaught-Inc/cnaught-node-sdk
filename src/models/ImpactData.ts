import { ImpactEquivalents } from './ImpactEquivalents';
import { ImpactCategoryUsage } from './ImpactCategoryUsage';

export interface ImpactData {
    name: string | null;
    logo_url: string | null;
    total_offset_kgs: number;
    equivalents: ImpactEquivalents;
    categories: ImpactCategoryUsage[];
    since_date: string;
}

