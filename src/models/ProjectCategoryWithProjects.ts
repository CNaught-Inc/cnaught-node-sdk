import type { ProjectCategory } from './ProjectCategory.js';
import type { Project } from './Project.js';

export interface ProjectCategoryWithProjects extends ProjectCategory {
    projects: Project[];
}
