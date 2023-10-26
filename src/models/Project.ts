export interface Project {
    id: string;
    name: string;
    type: string;
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
}

export interface ProjectCategory {
    id: string;
    name: string;
}