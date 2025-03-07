import type { ProjectDueDiligenceFigure } from './ProjectDueDiligenceFigure.js';
import type { ProjectLifetime } from './ProjectLifetime.js';
import type { ProjectNewsArticle } from './ProjectNewsArticle.js';
import type { ProjectNotableBuyer } from './ProjectNotableBuyer.js';

export interface Project {
    id: string;
    name: string;
    type: string;
    activity_types?: string[];
    developer?: string;
    registry_name?: string;
    registry_id?: string;
    registry_url?: string;
    summary?: string;
    description?: string;
    location_name?: string;
    location_latitude?: number;
    location_longitude?: number;
    primary_image_url?: string;
    un_sdg_goals: number[];
    methodology?: string;
    verifier?: string;
    permanence?: string;
    lifetime?: ProjectLifetime;
    impact_type?: string;
    due_diligence?: string;
    beyond_carbon?: string;
    risk_of_reversal?: string;
    third_party_labels?: string[];
    notable_buyers?: ProjectNotableBuyer[];
    due_diligence_figure?: ProjectDueDiligenceFigure;
    news_articles?: ProjectNewsArticle[];
}
