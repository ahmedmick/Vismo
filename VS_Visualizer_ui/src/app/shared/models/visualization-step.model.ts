import { CustomPointer } from './custom-pointer.model';

export interface VisualizationStep {
  stepNumber: number;
  description: string;
  highlightedIndices: number[];
  swappedIndices: number[];
  currentArray: number[];
  highlightType?: 'comparison' | 'swap' | 'visited' | 'sorted';
  codeLineNumber?: number;
  tempPointerIndex?: number;
  floatingNodeValue?: number;
  floatingNodeLabel?: string;
  customPointers?: CustomPointer[];
}
