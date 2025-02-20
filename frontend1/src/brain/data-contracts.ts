/** AnalysisRequest */
export interface AnalysisRequest {
  /** Image */
  image: string;
}

/** AnalysisResponse */
export interface AnalysisResponse {
  analysis: StoolAnalysis;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** HealthMetric */
export interface HealthMetric {
  /** Name */
  name: string;
  /** Value */
  value: string;
  /** Severity */
  severity: string;
  /** Description */
  description: string;
  /** Category */
  category: string;
}

/** HealthResponse */
export interface HealthResponse {
  /** Status */
  status: string;
}

/** HistoryEntry */
export interface HistoryEntry {
  /** Id */
  id: string;
  /** Date */
  date: string;
  /** Metrics */
  metrics: HealthMetric[];
  /** Recommendations */
  recommendations: string[];
}

/** HistoryResponse */
export interface HistoryResponse {
  /** Entries */
  entries: HistoryEntry[];
}

/** StoolAnalysis */
export interface StoolAnalysis {
  /**
   * Color
   * Color of the stool
   */
  color: string;
  /**
   * Consistency
   * Consistency of the stool (e.g., soft, hard, loose)
   */
  consistency: string;
  /**
   * Shape
   * Shape of the stool according to Bristol Stool Scale
   */
  shape: string;
  /**
   * Health Score
   * Overall health score from 1-10
   */
  health_score: number;
  /**
   * Concerns
   * List of potential health concerns identified
   */
  concerns: string[];
  /**
   * Recommendations
   * List of recommendations for improvement
   */
  recommendations: string[];
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

export type CheckHealthData = HealthResponse;

export type AnalyzeStoolData = AnalysisResponse;

export type AnalyzeStoolError = HTTPValidationError;

export interface GetHistoryParams {
  /**
   * Start Date
   * Start date in ISO format
   */
  start_date?: string | null;
  /**
   * End Date
   * End date in ISO format
   */
  end_date?: string | null;
}

export type GetHistoryData = HistoryResponse;

export type GetHistoryError = HTTPValidationError;
