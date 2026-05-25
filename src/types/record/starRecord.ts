type Competency =
  | "DISCOVERY_ANALYSIS"
  | "PLANNING_EXECUTION"
  | "COLLABORATION"
  | "PROBLEM_SOLVING"
  | "REFLECTION_GROWTH";

interface StarImage {
  imageId?: number;
  imageUrl?: string;
  sortOrder?: number;
}

// GET /api/star-records/{starRecordId}
export interface StarDetailResponse {
  starRecordId?: number;
  projectTag?: string;
  freeText?: string;
  scrumContent?: string;
  primaryCategory?: Competency | string;
  detailTags?: string[];
  situationTask?: string;
  action?: string;
  result?: string;
  images?: StarImage[];
}
