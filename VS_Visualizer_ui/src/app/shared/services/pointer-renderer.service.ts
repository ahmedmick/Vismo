import { Injectable } from '@angular/core';
import { PointerConfig } from '../models/pointer-config.model';

@Injectable({ providedIn: 'root' })
export class PointerRendererService {

  computePath(config: PointerConfig): string {
    const { startX, startY, endX, endY, pathType, controlPoints } = config;
    if (pathType === 'routed' && controlPoints && controlPoints.length > 0) {
      let path = `M ${startX} ${startY}`;
      for (const cp of controlPoints) {
        path += ` L ${cp.x} ${cp.y}`;
      }
      return path + ` L ${endX} ${endY}`;
    }
    return `M ${startX} ${startY} L ${endX} ${endY}`;
  }

  resolveColor(cssVarOrHex: string): string {
    if (cssVarOrHex.startsWith('var(')) return cssVarOrHex;
    if (cssVarOrHex.startsWith('--')) return `var(${cssVarOrHex})`;
    return cssVarOrHex;
  }

  buildStrokeDasharray(config: PointerConfig): string {
    if (config.dashPattern) return config.dashPattern;
    switch (config.strokeStyle) {
      case 'dashed': return '6,4';
      case 'dotted': return '2,3';
      default: return '';
    }
  }

  getMarkerKey(config: PointerConfig): string {
    const color = config.headColor.replace(/var\(|--|\)/g, '');
    const style = config.headStyle ?? 'triangle';
    return `marker-${color}-${style}`;
  }
}
