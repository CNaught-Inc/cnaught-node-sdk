import { Project, ProjectCategory } from './Project';

export interface ImpactData {
    name: string | null;
    logo_url: string | null;
    total_offset_kgs: number;
    equivalents: ImpactEquivalents;
    categories: ImpactCategoryUsage[];
    since_date: string;
}

export interface ImpactEquivalents {
    cars_off_the_road: number;
    trees_planted: number;
    homes_annual_energy_usage: number;
    flights_lax_to_nyc: number;
}

export interface ImpactCategoryUsage {
    category: ProjectCategory;
    offset_kgs: number;
    projects: ImpactProjectUsage[];
}

export interface ImpactProjectUsage {
    project: Project;
    offset_kgs: number;
    vintages: string;
}