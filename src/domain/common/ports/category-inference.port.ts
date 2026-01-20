import type { ListType } from '../../list';

/**
 * Confidence level for category inference
 */
export type InferenceConfidence = 'high' | 'medium' | 'low';

/**
 * Result of category inference
 */
export interface InferenceResult {
  /** Inferred list type */
  listType: ListType;

  /** Confidence level of the inference */
  confidence: InferenceConfidence;
}

/**
 * Category inference service interface
 */
export interface CategoryInference {
  /**
   * Infer list type from text
   *
   * @param text - Text to analyze
   * @returns Inference result with list type and confidence
   */
  infer(text: string): InferenceResult;
}
