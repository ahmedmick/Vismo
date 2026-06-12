import { Injectable, signal, computed } from '@angular/core';
import { VisualizationService } from '../../../../core/services/visualization.service';
import { VisualizationStep } from '../../../../shared/models/visualization-step.model';
import { CustomPointer } from '../../../../shared/models/custom-pointer.model';

export type LinkedListType = 'normal' | 'circular' | 'doubly' | 'doubly-circular';

@Injectable({ providedIn: 'root' })
export class LinkedListLayoutService {
  private nodeSpacing = 60;

  constructor(private visualizationService: VisualizationService) {}

  getNodeBodyWidth(displayArray: (number | string)[]): number {
    if (!displayArray || displayArray.length === 0) return 100;
    const maxLength = displayArray.reduce((max: number, val) => {
      const len = String(val).length;
      return len > max ? len : max;
    }, 0);
    return Math.max(80 + maxLength * 12, 100);
  }

  getNodeBodyHeight(_displayArray: (number | string)[]): number {
    return 50;
  }

  getNodeX(index: number, nodeBodyWidth: number): number {
    return 80 + index * (nodeBodyWidth + this.nodeSpacing);
  }

  getLinkedListWidth(displayArray: (number | string)[], nodeBodyWidth: number): number {
    if (!displayArray || displayArray.length === 0) return 200;
    const lastNodeX = this.getNodeX(displayArray.length - 1, nodeBodyWidth);
    return lastNodeX + nodeBodyWidth + 150;
  }

  getCurrentStep(): VisualizationStep | null {
    return (this.visualizationService as any).currentStepData();
  }

  private fallbackArray: (number | string)[] = [];

  setFallbackArray(arr: (number | string)[]): void {
    this.fallbackArray = arr;
  }

  getDisplayArray(): (number | string)[] {
    const stepData = (this.visualizationService as any).currentStepData();
    if (stepData?.currentArray && stepData.currentArray.length > 0) {
      return stepData.currentArray;
    }
    return this.fallbackArray;
  }

  getTempPointerIndex(): number | null {
    const stepData = (this.visualizationService as any).currentStepData();
    if (stepData?.tempPointerIndex !== undefined && stepData?.tempPointerIndex !== null) {
      if (stepData.tempPointerIndex < 0) return null;
      return stepData.tempPointerIndex;
    }
    const highlighted = stepData?.highlightedIndices || [];
    return highlighted.length > 0 ? highlighted[0] : null;
  }

  isHighlighted(index: number): boolean {
    const stepData = (this.visualizationService as any).currentStepData();
    const highlighted = stepData?.highlightedIndices || [];
    return highlighted.includes(index);
  }

  getFloatingNodeYOffset(step: VisualizationStep | null, operation: string): number {
    const isInsertHead = operation === 'insert-head';
    const isStep2Or3 = step?.stepNumber === 2 || step?.stepNumber === 3;
    return isInsertHead && isStep2Or3 ? 5 : 0;
  }

  headPointsToFloating(step: VisualizationStep | null): boolean {
    return (
      step?.customPointers?.some(
        (p: CustomPointer) => p.type === 'head' && p.fromId === 'head' && p.toId === 'floating',
      ) ?? false
    );
  }

  showFloatingNullArrow(step: VisualizationStep | null): boolean {
    if (step?.floatingNodeValue === undefined || step?.floatingNodeValue === null) {
      return false;
    }
    return !step.customPointers?.some(
      (p: CustomPointer) => p.fromId === 'floating' && p.type === 'next',
    );
  }

  hasPointerToFloating(index: number): boolean {
    const stepData = (this.visualizationService as any).currentStepData();
    if (!stepData?.customPointers) return false;
    return stepData.customPointers.some(
      (p: CustomPointer) => p.fromId === String(index) && p.toId === 'floating',
    );
  }

  hasCustomNextFrom(index: number): boolean {
    const stepData = (this.visualizationService as any).currentStepData();
    if (!stepData?.customPointers) return false;
    return stepData.customPointers.some(
      (p: CustomPointer) => p.fromId === String(index) && p.type === 'next',
    );
  }
}
