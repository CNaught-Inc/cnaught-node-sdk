import type { Project } from './Project.js';

export interface ProjectCategory {
    id: string;
    name: string;
    description?: string;
    primary_image_url?: string;
    projects: Project[];
}
