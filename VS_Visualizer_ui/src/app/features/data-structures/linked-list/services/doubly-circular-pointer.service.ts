import { Injectable } from '@angular/core';
import { PointerItem, PointerGeoContext, Point } from './shared-pointer-types';
import { SharedPointerUtils } from './shared-pointer-utils';
import { VisualizationStep } from '../../../../shared/models/visualization-step.model';

@Injectable({ providedIn: 'root' })
export class DoublyCircularPointerService {
  getPointersForStep(operation: string, step: VisualizationStep | null, geo: PointerGeoContext): PointerItem[] {
    if (!step) return this.noStepItems(geo);
    switch (operation) {
      case 'insert-head':    return this.handleInsertHead(step, geo);
      case 'insert-tail':    return this.handleInsertTail(step, geo);
      case 'insert-position': return this.handleInsertPosition(step, geo);
      case 'delete-head':    return this.handleDeleteHead(step, geo);
      case 'delete-tail':    return this.handleDeleteTail(step, geo);
      case 'delete-position': return this.handleDeletePosition(step, geo);
      case 'access':         return this.handleAccess(step, geo);
      case 'update':         return this.handleUpdate(step, geo);
      case 'search':         return this.handleSearch(step, geo);
      case 'traverse':       return this.handleTraverse(step, geo);
      default:               return this.noStepItems(geo);
    }
  }

  private noStepItems(geo: PointerGeoContext): PointerItem[] {
    const items: PointerItem[] = [];
    const nodeCenterY = 40 + geo.nodeBodyHeight / 2;
    const n = geo.displayArray.length;

    for (let i = 0; i < n - 1; i++) {
      const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth) + geo.nodeBodyWidth;
      const toX = SharedPointerUtils.getNodeX(i + 1, geo.nodeBodyWidth) - 5;
      items.push(SharedPointerUtils.makeArrow({ x: fromX, y: nodeCenterY }, { x: toX, y: nodeCenterY }, undefined, '--node-section-primary', 2));
    }
    for (let i = 1; i < n; i++) {
      const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth);
      const toX = SharedPointerUtils.getNodeX(i - 1, geo.nodeBodyWidth) + geo.nodeBodyWidth + 5;
      items.push(SharedPointerUtils.makeArrow({ x: fromX, y: 75 }, { x: toX, y: 75 }, undefined, '--node-section-secondary', 2));
    }

    items.push(SharedPointerUtils.makeLabel(-2, 70, 'head', 'start', 'head-label'));
    if (n > 0) items.push(SharedPointerUtils.makeArrow({ x: 45, y: 65 }, { x: 78, y: 65 }, undefined, '--accent-success', 2));

    if (n > 0) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const lx = lastX + geo.nodeBodyWidth + 30;
      const tx = lastX + geo.nodeBodyWidth + 5;
      items.push(SharedPointerUtils.makeLabel(lx, 70, 'TAIL', 'start', 'tail-label'));
      items.push(SharedPointerUtils.makeArrow({ x: lastX + geo.nodeBodyWidth + 25, y: 65 }, { x: tx - 2, y: 65 }, undefined, '--accent-secondary', 2));
    }

    if (n >= 2) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const firstX = SharedPointerUtils.getNodeX(0, geo.nodeBodyWidth);
      const sx = lastX + geo.nodeBodyWidth * 0.9;
      const ex = firstX + geo.nodeBodyWidth * 0.1;
      items.push(SharedPointerUtils.makeArrow({ x: sx, y: 40 }, { x: ex, y: 38 }, [{ x: sx, y: 0 }, { x: ex, y: 0 }], '--node-section-primary', 2));
      items.push(SharedPointerUtils.makeArrow({ x: ex, y: 95 }, { x: sx, y: 95 }, [{ x: ex, y: 130 }, { x: sx, y: 130 }], '--node-section-secondary', 2));
    }

    return items;
  }

  private handleInsertHead(step: VisualizationStep, geo: PointerGeoContext): PointerItem[] {
    const items: PointerItem[] = [];
    const nodeCenterY = 40 + geo.nodeBodyHeight / 2;
    const n = geo.displayArray.length;

    for (let i = 0; i < n - 1; i++) {
      if (step.customPointers?.some(p => p.fromId === String(i) && p.type === 'next')) continue;
      const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth) + geo.nodeBodyWidth;
      const toX = SharedPointerUtils.getNodeX(i + 1, geo.nodeBodyWidth) - 5;
      items.push(SharedPointerUtils.makeArrow({ x: fromX, y: nodeCenterY }, { x: toX, y: nodeCenterY }, undefined, '--node-section-primary', 2));
    }
    for (let i = 1; i < n; i++) {
      if (step.customPointers?.some(p => p.fromId === String(i) && p.type === 'prev')) continue;
      const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth);
      const toX = SharedPointerUtils.getNodeX(i - 1, geo.nodeBodyWidth) + geo.nodeBodyWidth + 5;
      items.push(SharedPointerUtils.makeArrow({ x: fromX, y: 75 }, { x: toX, y: 75 }, undefined, '--node-section-secondary', 2));
    }

    items.push(SharedPointerUtils.makeLabel(-2, 70, 'head', 'start', 'head-label'));
    const hasCustomHead = step.customPointers?.some(p => p.type === 'head' && p.fromId === 'head' && p.toId === 'floating');
    if (!hasCustomHead && n > 0) items.push(SharedPointerUtils.makeArrow({ x: 45, y: 65 }, { x: 78, y: 65 }, undefined, '--accent-success', 2));

    if (n > 0) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const lx = lastX + geo.nodeBodyWidth + 30;
      const tx = lastX + geo.nodeBodyWidth + 5;
      items.push(SharedPointerUtils.makeLabel(lx, 70, 'TAIL', 'start', 'tail-label'));
      items.push(SharedPointerUtils.makeArrow({ x: lastX + geo.nodeBodyWidth + 25, y: 65 }, { x: tx - 2, y: 65 }, undefined, '--accent-secondary', 2));
    }

    if (n >= 2) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const firstX = SharedPointerUtils.getNodeX(0, geo.nodeBodyWidth);
      const sx = lastX + geo.nodeBodyWidth * 0.9;
      const ex = firstX + geo.nodeBodyWidth * 0.1;
      items.push(SharedPointerUtils.makeArrow({ x: sx, y: 40 }, { x: ex, y: 38 }, [{ x: sx, y: 0 }, { x: ex, y: 0 }], '--node-section-primary', 2));
      items.push(SharedPointerUtils.makeArrow({ x: ex, y: 95 }, { x: sx, y: 95 }, [{ x: ex, y: 130 }, { x: sx, y: 130 }], '--node-section-secondary', 2));
    }

    if (step.customPointers) {
      for (const cp of step.customPointers) {
        const nodeTopY = 40;
        const nodeCenterY = nodeTopY + geo.nodeBodyHeight / 2;
        const hasFloating = cp.fromId === 'floating' || cp.toId === 'floating';
        const getAnchor = (id: string, isFrom: boolean): Point => {
          if (id === 'floating') {
            const fx = geo.getFloatingNodeX();
            if (cp.type === 'next') {
              if (isFrom) return { x: fx + geo.nodeBodyWidth, y: geo.floatingNodeCenterY };
              return { x: fx + geo.nodeBodyWidth * 0.3, y: geo.floatingNodeCenterY };
            }
            const x = isFrom ? fx + geo.nodeBodyWidth * 0.15 : fx + geo.nodeBodyWidth * 0.85;
            return { x, y: geo.floatingNodeTopY };
          }
          let idx: number;
          if (id === 'head') idx = 0;
          else if (id === 'tail') idx = geo.displayArray.length - 1;
          else idx = parseInt(id, 10);
          if (isNaN(idx)) return { x: 0, y: 0 };
          const nodeX = SharedPointerUtils.getNodeX(idx, geo.nodeBodyWidth);
          if (cp.type === 'next') {
            if (!isFrom) return { x: nodeX + geo.nodeBodyWidth * 0.5, y: nodeCenterY };
            return { x: nodeX + geo.nodeBodyWidth * 0.85, y: nodeCenterY };
          }
          const x = isFrom ? nodeX + geo.nodeBodyWidth * 0.15 : nodeX + geo.nodeBodyWidth * 0.85;
          return { x, y: nodeTopY };
        };
        let from = getAnchor(cp.fromId, true);
        let to = getAnchor(cp.toId, false);
        if (cp.fromId === 'floating' && cp.type === 'next') {
          to = { x: to.x - 40, y: 40 + geo.nodeBodyHeight };
        }
        let controlPoints: Point[] | undefined;
        if (cp.type === 'head' && cp.fromId === 'head' && cp.toId === 'floating') {
          from = { x: 45, y: nodeCenterY };
          controlPoints = [{ x: from.x, y: nodeCenterY + 90 }];
        } else if (cp.type === 'deprecated-head' && cp.fromId === 'head' && cp.toId === '0') {
          controlPoints = [];
        } else if (cp.fromId === 'floating' && cp.type === 'next') {
          const routeY = geo.floatingNodeTopY - 12;
          controlPoints = [
            { x: from.x + 25, y: from.y },
            { x: from.x + 25, y: routeY },
            { x: to.x, y: routeY },
          ];
        } else if (cp.toId === 'floating' && cp.type === 'next') {
          const routeY = geo.floatingNodeTopY - 12;
          const midX = (from.x + to.x) / 2;
          controlPoints = [
            { x: from.x, y: routeY },
            { x: midX, y: routeY },
            { x: midX, y: geo.floatingNodeTopY + 10 },
          ];
        } else {
          let routeY: number;
          if (hasFloating) {
            routeY = geo.floatingNodeTopY - 12;
          } else if (cp.type === 'next') {
            routeY = geo.nodeBodyHeight + 45;
          } else if (cp.type === 'prev') {
            routeY = 25;
          } else {
            routeY = 25;
          }
          controlPoints = [{ x: from.x, y: routeY }, { x: to.x, y: routeY }];
        }
        const isSuccess = cp.type === 'head';
        const isDeprecated = cp.type === 'deprecated-head';
        const headColor = isSuccess ? '--accent-success' : '--accent-warning';
        const bodyWidth = isSuccess ? 2.5 : (isDeprecated ? 1.5 : (cp.isHighlighted ? 2.5 : 1.5));
        const dashPattern = isDeprecated ? '5,4' : (cp.isHighlighted ? '6,4' : undefined);
        items.push(SharedPointerUtils.makeArrow(from, to, controlPoints, headColor, bodyWidth, dashPattern, cp.isHighlighted));
      }
    }

    let tempIdx: number | null = null;
    if (step.tempPointerIndex != null && step.tempPointerIndex >= 0) tempIdx = step.tempPointerIndex;
    else if (step.highlightedIndices?.length > 0) tempIdx = step.highlightedIndices[0];
    if (tempIdx !== null) {
      const cx = SharedPointerUtils.getNodeX(tempIdx, geo.nodeBodyWidth) + geo.nodeBodyWidth / 2;
      items.push(SharedPointerUtils.makeLabel(cx, -8, 'temp', 'middle', 'temp-label'));
      items.push(SharedPointerUtils.makeArrow({ x: cx, y: -5 }, { x: cx, y: 25 }, undefined, '--accent-warning', 2));
    }

    if (step.floatingNodeLabel) {
      const fx = geo.getFloatingNodeX();
      items.push(SharedPointerUtils.makeLabel(fx - 45, geo.floatingNodeCenterY + 3, step.floatingNodeLabel, 'end', 'floating-node-label'));
      items.push(SharedPointerUtils.makeArrow({ x: fx - 40, y: geo.floatingNodeCenterY }, { x: fx - 3, y: geo.floatingNodeCenterY }, undefined, '--accent-warning', 2));
      const hasFloatingNext = step.customPointers?.some(p => p.fromId === 'floating' && p.type === 'next');
      if (!hasFloatingNext) {
        items.push(SharedPointerUtils.makeArrow({ x: fx + geo.nodeBodyWidth, y: geo.floatingNodeCenterY }, { x: fx + geo.nodeBodyWidth + 45, y: geo.floatingNodeCenterY }, undefined, '--accent-warning', 2));
        items.push(SharedPointerUtils.makeLabel(fx + geo.nodeBodyWidth + 55, geo.floatingNodeCenterY + 7.5, 'Null', 'start', 'null-label'));
      }
    }

    return items;
  }

  private handleInsertTail(step: VisualizationStep, geo: PointerGeoContext): PointerItem[] {
    const items: PointerItem[] = [];
    const nodeCenterY = 40 + geo.nodeBodyHeight / 2;
    const n = geo.displayArray.length;

    for (let i = 0; i < n - 1; i++) {
      if (step.customPointers?.some(p => p.fromId === String(i) && p.type === 'next')) continue;
      const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth) + geo.nodeBodyWidth;
      const toX = SharedPointerUtils.getNodeX(i + 1, geo.nodeBodyWidth) - 5;
      items.push(SharedPointerUtils.makeArrow({ x: fromX, y: nodeCenterY }, { x: toX, y: nodeCenterY }, undefined, '--node-section-primary', 2));
    }
    for (let i = 1; i < n; i++) {
      if (step.customPointers?.some(p => p.fromId === String(i) && p.type === 'prev')) continue;
      const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth);
      const toX = SharedPointerUtils.getNodeX(i - 1, geo.nodeBodyWidth) + geo.nodeBodyWidth + 5;
      items.push(SharedPointerUtils.makeArrow({ x: fromX, y: 75 }, { x: toX, y: 75 }, undefined, '--node-section-secondary', 2));
    }

    items.push(SharedPointerUtils.makeLabel(-2, 70, 'head', 'start', 'head-label'));
    const hasCustomHead = step.customPointers?.some(p => p.type === 'head' && p.fromId === 'head' && p.toId === 'floating');
    if (!hasCustomHead && n > 0) items.push(SharedPointerUtils.makeArrow({ x: 45, y: 65 }, { x: 78, y: 65 }, undefined, '--accent-success', 2));

    if (n > 0) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const lx = lastX + geo.nodeBodyWidth + 30;
      const tx = lastX + geo.nodeBodyWidth + 5;
      items.push(SharedPointerUtils.makeLabel(lx, 70, 'TAIL', 'start', 'tail-label'));
      items.push(SharedPointerUtils.makeArrow({ x: lastX + geo.nodeBodyWidth + 25, y: 65 }, { x: tx - 2, y: 65 }, undefined, '--accent-secondary', 2));
    }

    if (n >= 2) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const firstX = SharedPointerUtils.getNodeX(0, geo.nodeBodyWidth);
      const sx = lastX + geo.nodeBodyWidth * 0.9;
      const ex = firstX + geo.nodeBodyWidth * 0.1;
      items.push(SharedPointerUtils.makeArrow({ x: sx, y: 40 }, { x: ex, y: 38 }, [{ x: sx, y: 0 }, { x: ex, y: 0 }], '--node-section-primary', 2));
      items.push(SharedPointerUtils.makeArrow({ x: ex, y: 95 }, { x: sx, y: 95 }, [{ x: ex, y: 130 }, { x: sx, y: 130 }], '--node-section-secondary', 2));
    }

    if (step.customPointers) {
      for (const cp of step.customPointers) {
        const nodeTopY = 40;
        const nodeCenterY = nodeTopY + geo.nodeBodyHeight / 2;
        const hasFloating = cp.fromId === 'floating' || cp.toId === 'floating';
        const getAnchor = (id: string, isFrom: boolean): Point => {
          if (id === 'floating') {
            const fx = geo.getFloatingNodeX();
            if (cp.type === 'next') {
              if (isFrom) return { x: fx + geo.nodeBodyWidth, y: geo.floatingNodeCenterY };
              return { x: fx + geo.nodeBodyWidth * 0.3, y: geo.floatingNodeCenterY };
            }
            const x = isFrom ? fx + geo.nodeBodyWidth * 0.15 : fx + geo.nodeBodyWidth * 0.85;
            return { x, y: geo.floatingNodeTopY };
          }
          let idx: number;
          if (id === 'head') idx = 0;
          else if (id === 'tail') idx = geo.displayArray.length - 1;
          else idx = parseInt(id, 10);
          if (isNaN(idx)) return { x: 0, y: 0 };
          const nodeX = SharedPointerUtils.getNodeX(idx, geo.nodeBodyWidth);
          if (cp.type === 'next') {
            if (!isFrom) return { x: nodeX + geo.nodeBodyWidth * 0.5, y: nodeCenterY };
            return { x: nodeX + geo.nodeBodyWidth * 0.85, y: nodeCenterY };
          }
          const x = isFrom ? nodeX + geo.nodeBodyWidth * 0.15 : nodeX + geo.nodeBodyWidth * 0.85;
          return { x, y: nodeTopY };
        };
        let from = getAnchor(cp.fromId, true);
        let to = getAnchor(cp.toId, false);
        if (cp.fromId === 'floating' && cp.type === 'next') {
          to = { x: to.x - 40, y: 40 + geo.nodeBodyHeight };
        }
        let controlPoints: Point[] | undefined;
        if (cp.type === 'head' && cp.fromId === 'head' && cp.toId === 'floating') {
          from = { x: 45, y: nodeCenterY };
          controlPoints = [{ x: from.x, y: nodeCenterY + 90 }];
        } else if (cp.type === 'deprecated-head' && cp.fromId === 'head' && cp.toId === '0') {
          controlPoints = [];
        } else if (cp.fromId === 'floating' && cp.type === 'next') {
          const routeY = geo.floatingNodeTopY - 12;
          controlPoints = [
            { x: from.x + 25, y: from.y },
            { x: from.x + 25, y: routeY },
            { x: to.x, y: routeY },
          ];
        } else if (cp.toId === 'floating' && cp.type === 'next') {
          const routeY = geo.floatingNodeTopY - 12;
          const midX = (from.x + to.x) / 2;
          controlPoints = [
            { x: from.x, y: routeY },
            { x: midX, y: routeY },
            { x: midX, y: geo.floatingNodeTopY + 10 },
          ];
        } else {
          let routeY: number;
          if (hasFloating) {
            routeY = geo.floatingNodeTopY - 12;
          } else if (cp.type === 'next') {
            routeY = geo.nodeBodyHeight + 45;
          } else if (cp.type === 'prev') {
            routeY = 25;
          } else {
            routeY = 25;
          }
          controlPoints = [{ x: from.x, y: routeY }, { x: to.x, y: routeY }];
        }
        const isSuccess = cp.type === 'head';
        const isDeprecated = cp.type === 'deprecated-head';
        const headColor = isSuccess ? '--accent-success' : '--accent-warning';
        const bodyWidth = isSuccess ? 2.5 : (isDeprecated ? 1.5 : (cp.isHighlighted ? 2.5 : 1.5));
        const dashPattern = isDeprecated ? '5,4' : (cp.isHighlighted ? '6,4' : undefined);
        items.push(SharedPointerUtils.makeArrow(from, to, controlPoints, headColor, bodyWidth, dashPattern, cp.isHighlighted));
      }
    }

    let tempIdx: number | null = null;
    if (step.tempPointerIndex != null && step.tempPointerIndex >= 0) tempIdx = step.tempPointerIndex;
    else if (step.highlightedIndices?.length > 0) tempIdx = step.highlightedIndices[0];
    if (tempIdx !== null) {
      const cx = SharedPointerUtils.getNodeX(tempIdx, geo.nodeBodyWidth) + geo.nodeBodyWidth / 2;
      items.push(SharedPointerUtils.makeLabel(cx, -8, 'temp', 'middle', 'temp-label'));
      items.push(SharedPointerUtils.makeArrow({ x: cx, y: -5 }, { x: cx, y: 25 }, undefined, '--accent-warning', 2));
    }

    if (step.floatingNodeLabel) {
      const fx = geo.getFloatingNodeX();
      items.push(SharedPointerUtils.makeLabel(fx - 45, geo.floatingNodeCenterY + 3, step.floatingNodeLabel, 'end', 'floating-node-label'));
      items.push(SharedPointerUtils.makeArrow({ x: fx - 40, y: geo.floatingNodeCenterY }, { x: fx - 3, y: geo.floatingNodeCenterY }, undefined, '--accent-warning', 2));
      const hasFloatingNext = step.customPointers?.some(p => p.fromId === 'floating' && p.type === 'next');
      if (!hasFloatingNext) {
        items.push(SharedPointerUtils.makeArrow({ x: fx + geo.nodeBodyWidth, y: geo.floatingNodeCenterY }, { x: fx + geo.nodeBodyWidth + 45, y: geo.floatingNodeCenterY }, undefined, '--accent-warning', 2));
        items.push(SharedPointerUtils.makeLabel(fx + geo.nodeBodyWidth + 55, geo.floatingNodeCenterY + 7.5, 'Null', 'start', 'null-label'));
      }
    }

    return items;
  }

  private handleInsertPosition(step: VisualizationStep, geo: PointerGeoContext): PointerItem[] {
    const items: PointerItem[] = [];
    const nodeCenterY = 40 + geo.nodeBodyHeight / 2;
    const n = geo.displayArray.length;

    for (let i = 0; i < n - 1; i++) {
      if (step.customPointers?.some(p => p.fromId === String(i) && p.type === 'next')) continue;
      const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth) + geo.nodeBodyWidth;
      const toX = SharedPointerUtils.getNodeX(i + 1, geo.nodeBodyWidth) - 5;
      items.push(SharedPointerUtils.makeArrow({ x: fromX, y: nodeCenterY }, { x: toX, y: nodeCenterY }, undefined, '--node-section-primary', 2));
    }
    for (let i = 1; i < n; i++) {
      if (step.customPointers?.some(p => p.fromId === String(i) && p.type === 'prev')) continue;
      const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth);
      const toX = SharedPointerUtils.getNodeX(i - 1, geo.nodeBodyWidth) + geo.nodeBodyWidth + 5;
      items.push(SharedPointerUtils.makeArrow({ x: fromX, y: 75 }, { x: toX, y: 75 }, undefined, '--node-section-secondary', 2));
    }

    items.push(SharedPointerUtils.makeLabel(-2, 70, 'head', 'start', 'head-label'));
    const hasCustomHead = step.customPointers?.some(p => p.type === 'head' && p.fromId === 'head' && p.toId === 'floating');
    if (!hasCustomHead && n > 0) items.push(SharedPointerUtils.makeArrow({ x: 45, y: 65 }, { x: 78, y: 65 }, undefined, '--accent-success', 2));

    if (n > 0) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const lx = lastX + geo.nodeBodyWidth + 30;
      const tx = lastX + geo.nodeBodyWidth + 5;
      items.push(SharedPointerUtils.makeLabel(lx, 70, 'TAIL', 'start', 'tail-label'));
      items.push(SharedPointerUtils.makeArrow({ x: lastX + geo.nodeBodyWidth + 25, y: 65 }, { x: tx - 2, y: 65 }, undefined, '--accent-secondary', 2));
    }

    if (n >= 2) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const firstX = SharedPointerUtils.getNodeX(0, geo.nodeBodyWidth);
      const sx = lastX + geo.nodeBodyWidth * 0.9;
      const ex = firstX + geo.nodeBodyWidth * 0.1;
      items.push(SharedPointerUtils.makeArrow({ x: sx, y: 40 }, { x: ex, y: 38 }, [{ x: sx, y: 0 }, { x: ex, y: 0 }], '--node-section-primary', 2));
      items.push(SharedPointerUtils.makeArrow({ x: ex, y: 95 }, { x: sx, y: 95 }, [{ x: ex, y: 130 }, { x: sx, y: 130 }], '--node-section-secondary', 2));
    }

    if (step.customPointers) {
      for (const cp of step.customPointers) {
        const nodeTopY = 40;
        const nodeCenterY = nodeTopY + geo.nodeBodyHeight / 2;
        const hasFloating = cp.fromId === 'floating' || cp.toId === 'floating';
        const getAnchor = (id: string, isFrom: boolean): Point => {
          if (id === 'floating') {
            const fx = geo.getFloatingNodeX();
            if (cp.type === 'next') {
              if (isFrom) return { x: fx + geo.nodeBodyWidth, y: geo.floatingNodeCenterY };
              return { x: fx + geo.nodeBodyWidth * 0.3, y: geo.floatingNodeCenterY };
            }
            const x = isFrom ? fx + geo.nodeBodyWidth * 0.15 : fx + geo.nodeBodyWidth * 0.85;
            return { x, y: geo.floatingNodeTopY };
          }
          let idx: number;
          if (id === 'head') idx = 0;
          else if (id === 'tail') idx = geo.displayArray.length - 1;
          else idx = parseInt(id, 10);
          if (isNaN(idx)) return { x: 0, y: 0 };
          const nodeX = SharedPointerUtils.getNodeX(idx, geo.nodeBodyWidth);
          if (cp.type === 'next') {
            if (!isFrom) return { x: nodeX + geo.nodeBodyWidth * 0.5, y: nodeCenterY };
            return { x: nodeX + geo.nodeBodyWidth * 0.85, y: nodeCenterY };
          }
          const x = isFrom ? nodeX + geo.nodeBodyWidth * 0.15 : nodeX + geo.nodeBodyWidth * 0.85;
          return { x, y: nodeTopY };
        };
        let from = getAnchor(cp.fromId, true);
        let to = getAnchor(cp.toId, false);
        if (cp.fromId === 'floating' && cp.type === 'next') {
          to = { x: to.x - 40, y: 40 + geo.nodeBodyHeight };
        }
        let controlPoints: Point[] | undefined;
        if (cp.type === 'head' && cp.fromId === 'head' && cp.toId === 'floating') {
          from = { x: 45, y: nodeCenterY };
          controlPoints = [{ x: from.x, y: nodeCenterY + 90 }];
        } else if (cp.type === 'deprecated-head' && cp.fromId === 'head' && cp.toId === '0') {
          controlPoints = [];
        } else if (cp.fromId === 'floating' && cp.type === 'next') {
          const routeY = geo.floatingNodeTopY - 12;
          controlPoints = [
            { x: from.x + 25, y: from.y },
            { x: from.x + 25, y: routeY },
            { x: to.x, y: routeY },
          ];
        } else if (cp.toId === 'floating' && cp.type === 'next') {
          const routeY = geo.floatingNodeTopY - 12;
          const midX = (from.x + to.x) / 2;
          controlPoints = [
            { x: from.x, y: routeY },
            { x: midX, y: routeY },
            { x: midX, y: geo.floatingNodeTopY + 10 },
          ];
        } else {
          let routeY: number;
          if (hasFloating) {
            routeY = geo.floatingNodeTopY - 12;
          } else if (cp.type === 'next') {
            routeY = geo.nodeBodyHeight + 45;
          } else if (cp.type === 'prev') {
            routeY = 25;
          } else {
            routeY = 25;
          }
          controlPoints = [{ x: from.x, y: routeY }, { x: to.x, y: routeY }];
        }
        const isSuccess = cp.type === 'head';
        const isDeprecated = cp.type === 'deprecated-head';
        const headColor = isSuccess ? '--accent-success' : '--accent-warning';
        const bodyWidth = isSuccess ? 2.5 : (isDeprecated ? 1.5 : (cp.isHighlighted ? 2.5 : 1.5));
        const dashPattern = isDeprecated ? '5,4' : (cp.isHighlighted ? '6,4' : undefined);
        items.push(SharedPointerUtils.makeArrow(from, to, controlPoints, headColor, bodyWidth, dashPattern, cp.isHighlighted));
      }
    }

    let tempIdx: number | null = null;
    if (step.tempPointerIndex != null && step.tempPointerIndex >= 0) tempIdx = step.tempPointerIndex;
    else if (step.highlightedIndices?.length > 0) tempIdx = step.highlightedIndices[0];
    if (tempIdx !== null) {
      const cx = SharedPointerUtils.getNodeX(tempIdx, geo.nodeBodyWidth) + geo.nodeBodyWidth / 2;
      items.push(SharedPointerUtils.makeLabel(cx, -8, 'temp', 'middle', 'temp-label'));
      items.push(SharedPointerUtils.makeArrow({ x: cx, y: -5 }, { x: cx, y: 25 }, undefined, '--accent-warning', 2));
    }

    if (step.floatingNodeLabel) {
      const fx = geo.getFloatingNodeX();
      items.push(SharedPointerUtils.makeLabel(fx - 45, geo.floatingNodeCenterY + 3, step.floatingNodeLabel, 'end', 'floating-node-label'));
      items.push(SharedPointerUtils.makeArrow({ x: fx - 40, y: geo.floatingNodeCenterY }, { x: fx - 3, y: geo.floatingNodeCenterY }, undefined, '--accent-warning', 2));
      const hasFloatingNext = step.customPointers?.some(p => p.fromId === 'floating' && p.type === 'next');
      if (!hasFloatingNext) {
        items.push(SharedPointerUtils.makeArrow({ x: fx + geo.nodeBodyWidth, y: geo.floatingNodeCenterY }, { x: fx + geo.nodeBodyWidth + 45, y: geo.floatingNodeCenterY }, undefined, '--accent-warning', 2));
        items.push(SharedPointerUtils.makeLabel(fx + geo.nodeBodyWidth + 55, geo.floatingNodeCenterY + 7.5, 'Null', 'start', 'null-label'));
      }
    }

    return items;
  }

  private handleDeleteHead(step: VisualizationStep, geo: PointerGeoContext): PointerItem[] {
    const items: PointerItem[] = [];
    const nodeCenterY = 40 + geo.nodeBodyHeight / 2;
    const n = geo.displayArray.length;

    for (let i = 0; i < n - 1; i++) {
      if (step.customPointers?.some(p => p.fromId === String(i) && p.type === 'next')) continue;
      const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth) + geo.nodeBodyWidth;
      const toX = SharedPointerUtils.getNodeX(i + 1, geo.nodeBodyWidth) - 5;
      items.push(SharedPointerUtils.makeArrow({ x: fromX, y: nodeCenterY }, { x: toX, y: nodeCenterY }, undefined, '--node-section-primary', 2));
    }
    for (let i = 1; i < n; i++) {
      if (step.customPointers?.some(p => p.fromId === String(i) && p.type === 'prev')) continue;
      const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth);
      const toX = SharedPointerUtils.getNodeX(i - 1, geo.nodeBodyWidth) + geo.nodeBodyWidth + 5;
      items.push(SharedPointerUtils.makeArrow({ x: fromX, y: 75 }, { x: toX, y: 75 }, undefined, '--node-section-secondary', 2));
    }

    items.push(SharedPointerUtils.makeLabel(-2, 70, 'head', 'start', 'head-label'));
    const hasCustomHead = step.customPointers?.some(p => p.type === 'head' && p.fromId === 'head' && p.toId === 'floating');
    if (!hasCustomHead && n > 0) items.push(SharedPointerUtils.makeArrow({ x: 45, y: 65 }, { x: 78, y: 65 }, undefined, '--accent-success', 2));

    if (n > 0) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const lx = lastX + geo.nodeBodyWidth + 30;
      const tx = lastX + geo.nodeBodyWidth + 5;
      items.push(SharedPointerUtils.makeLabel(lx, 70, 'TAIL', 'start', 'tail-label'));
      items.push(SharedPointerUtils.makeArrow({ x: lastX + geo.nodeBodyWidth + 25, y: 65 }, { x: tx - 2, y: 65 }, undefined, '--accent-secondary', 2));
    }

    if (n >= 2) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const firstX = SharedPointerUtils.getNodeX(0, geo.nodeBodyWidth);
      const sx = lastX + geo.nodeBodyWidth * 0.9;
      const ex = firstX + geo.nodeBodyWidth * 0.1;
      items.push(SharedPointerUtils.makeArrow({ x: sx, y: 40 }, { x: ex, y: 38 }, [{ x: sx, y: 0 }, { x: ex, y: 0 }], '--node-section-primary', 2));
      items.push(SharedPointerUtils.makeArrow({ x: ex, y: 95 }, { x: sx, y: 95 }, [{ x: ex, y: 130 }, { x: sx, y: 130 }], '--node-section-secondary', 2));
    }

    if (step.customPointers) {
      for (const cp of step.customPointers) {
        const nodeTopY = 40;
        const nodeCenterY = nodeTopY + geo.nodeBodyHeight / 2;
        const hasFloating = cp.fromId === 'floating' || cp.toId === 'floating';
        const getAnchor = (id: string, isFrom: boolean): Point => {
          if (id === 'floating') {
            const fx = geo.getFloatingNodeX();
            if (cp.type === 'next') {
              if (isFrom) return { x: fx + geo.nodeBodyWidth, y: geo.floatingNodeCenterY };
              return { x: fx + geo.nodeBodyWidth * 0.3, y: geo.floatingNodeCenterY };
            }
            const x = isFrom ? fx + geo.nodeBodyWidth * 0.15 : fx + geo.nodeBodyWidth * 0.85;
            return { x, y: geo.floatingNodeTopY };
          }
          let idx: number;
          if (id === 'head') idx = 0;
          else if (id === 'tail') idx = geo.displayArray.length - 1;
          else idx = parseInt(id, 10);
          if (isNaN(idx)) return { x: 0, y: 0 };
          const nodeX = SharedPointerUtils.getNodeX(idx, geo.nodeBodyWidth);
          if (cp.type === 'next') {
            if (!isFrom) return { x: nodeX + geo.nodeBodyWidth * 0.5, y: nodeCenterY };
            return { x: nodeX + geo.nodeBodyWidth * 0.85, y: nodeCenterY };
          }
          const x = isFrom ? nodeX + geo.nodeBodyWidth * 0.15 : nodeX + geo.nodeBodyWidth * 0.85;
          return { x, y: nodeTopY };
        };
        let from = getAnchor(cp.fromId, true);
        let to = getAnchor(cp.toId, false);
        if (cp.fromId === 'floating' && cp.type === 'next') {
          to = { x: to.x - 40, y: 40 + geo.nodeBodyHeight };
        }
        let controlPoints: Point[] | undefined;
        if (cp.type === 'head' && cp.fromId === 'head' && cp.toId === 'floating') {
          from = { x: 45, y: nodeCenterY };
          controlPoints = [{ x: from.x, y: nodeCenterY + 90 }];
        } else if (cp.type === 'deprecated-head' && cp.fromId === 'head' && cp.toId === '0') {
          controlPoints = [];
        } else if (cp.fromId === 'floating' && cp.type === 'next') {
          const routeY = geo.floatingNodeTopY - 12;
          controlPoints = [
            { x: from.x + 25, y: from.y },
            { x: from.x + 25, y: routeY },
            { x: to.x, y: routeY },
          ];
        } else if (cp.toId === 'floating' && cp.type === 'next') {
          const routeY = geo.floatingNodeTopY - 12;
          const midX = (from.x + to.x) / 2;
          controlPoints = [
            { x: from.x, y: routeY },
            { x: midX, y: routeY },
            { x: midX, y: geo.floatingNodeTopY + 10 },
          ];
        } else {
          let routeY: number;
          if (hasFloating) {
            routeY = geo.floatingNodeTopY - 12;
          } else if (cp.type === 'next') {
            routeY = geo.nodeBodyHeight + 45;
          } else if (cp.type === 'prev') {
            routeY = 25;
          } else {
            routeY = 25;
          }
          controlPoints = [{ x: from.x, y: routeY }, { x: to.x, y: routeY }];
        }
        const isSuccess = cp.type === 'head';
        const isDeprecated = cp.type === 'deprecated-head';
        const headColor = isSuccess ? '--accent-success' : '--accent-warning';
        const bodyWidth = isSuccess ? 2.5 : (isDeprecated ? 1.5 : (cp.isHighlighted ? 2.5 : 1.5));
        const dashPattern = isDeprecated ? '5,4' : (cp.isHighlighted ? '6,4' : undefined);
        items.push(SharedPointerUtils.makeArrow(from, to, controlPoints, headColor, bodyWidth, dashPattern, cp.isHighlighted));
      }
    }

    let tempIdx: number | null = null;
    if (step.tempPointerIndex != null && step.tempPointerIndex >= 0) tempIdx = step.tempPointerIndex;
    else if (step.highlightedIndices?.length > 0) tempIdx = step.highlightedIndices[0];
    if (tempIdx !== null) {
      const cx = SharedPointerUtils.getNodeX(tempIdx, geo.nodeBodyWidth) + geo.nodeBodyWidth / 2;
      items.push(SharedPointerUtils.makeLabel(cx, -8, 'temp', 'middle', 'temp-label'));
      items.push(SharedPointerUtils.makeArrow({ x: cx, y: -5 }, { x: cx, y: 25 }, undefined, '--accent-warning', 2));
    }

    if (step.floatingNodeLabel) {
      const fx = geo.getFloatingNodeX();
      items.push(SharedPointerUtils.makeLabel(fx - 45, geo.floatingNodeCenterY + 3, step.floatingNodeLabel, 'end', 'floating-node-label'));
      items.push(SharedPointerUtils.makeArrow({ x: fx - 40, y: geo.floatingNodeCenterY }, { x: fx - 3, y: geo.floatingNodeCenterY }, undefined, '--accent-warning', 2));
      const hasFloatingNext = step.customPointers?.some(p => p.fromId === 'floating' && p.type === 'next');
      if (!hasFloatingNext) {
        items.push(SharedPointerUtils.makeArrow({ x: fx + geo.nodeBodyWidth, y: geo.floatingNodeCenterY }, { x: fx + geo.nodeBodyWidth + 45, y: geo.floatingNodeCenterY }, undefined, '--accent-warning', 2));
        items.push(SharedPointerUtils.makeLabel(fx + geo.nodeBodyWidth + 55, geo.floatingNodeCenterY + 7.5, 'Null', 'start', 'null-label'));
      }
    }

    return items;
  }

  private handleDeleteTail(step: VisualizationStep, geo: PointerGeoContext): PointerItem[] {
    const items: PointerItem[] = [];
    const nodeCenterY = 40 + geo.nodeBodyHeight / 2;
    const n = geo.displayArray.length;

    for (let i = 0; i < n - 1; i++) {
      if (step.customPointers?.some(p => p.fromId === String(i) && p.type === 'next')) continue;
      const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth) + geo.nodeBodyWidth;
      const toX = SharedPointerUtils.getNodeX(i + 1, geo.nodeBodyWidth) - 5;
      items.push(SharedPointerUtils.makeArrow({ x: fromX, y: nodeCenterY }, { x: toX, y: nodeCenterY }, undefined, '--node-section-primary', 2));
    }
    for (let i = 1; i < n; i++) {
      if (step.customPointers?.some(p => p.fromId === String(i) && p.type === 'prev')) continue;
      const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth);
      const toX = SharedPointerUtils.getNodeX(i - 1, geo.nodeBodyWidth) + geo.nodeBodyWidth + 5;
      items.push(SharedPointerUtils.makeArrow({ x: fromX, y: 75 }, { x: toX, y: 75 }, undefined, '--node-section-secondary', 2));
    }

    items.push(SharedPointerUtils.makeLabel(-2, 70, 'head', 'start', 'head-label'));
    const hasCustomHead = step.customPointers?.some(p => p.type === 'head' && p.fromId === 'head' && p.toId === 'floating');
    if (!hasCustomHead && n > 0) items.push(SharedPointerUtils.makeArrow({ x: 45, y: 65 }, { x: 78, y: 65 }, undefined, '--accent-success', 2));

    if (n > 0) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const lx = lastX + geo.nodeBodyWidth + 30;
      const tx = lastX + geo.nodeBodyWidth + 5;
      items.push(SharedPointerUtils.makeLabel(lx, 70, 'TAIL', 'start', 'tail-label'));
      items.push(SharedPointerUtils.makeArrow({ x: lastX + geo.nodeBodyWidth + 25, y: 65 }, { x: tx - 2, y: 65 }, undefined, '--accent-secondary', 2));
    }

    if (n >= 2) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const firstX = SharedPointerUtils.getNodeX(0, geo.nodeBodyWidth);
      const sx = lastX + geo.nodeBodyWidth * 0.9;
      const ex = firstX + geo.nodeBodyWidth * 0.1;
      items.push(SharedPointerUtils.makeArrow({ x: sx, y: 40 }, { x: ex, y: 38 }, [{ x: sx, y: 0 }, { x: ex, y: 0 }], '--node-section-primary', 2));
      items.push(SharedPointerUtils.makeArrow({ x: ex, y: 95 }, { x: sx, y: 95 }, [{ x: ex, y: 130 }, { x: sx, y: 130 }], '--node-section-secondary', 2));
    }

    if (step.customPointers) {
      for (const cp of step.customPointers) {
        const nodeTopY = 40;
        const nodeCenterY = nodeTopY + geo.nodeBodyHeight / 2;
        const hasFloating = cp.fromId === 'floating' || cp.toId === 'floating';
        const getAnchor = (id: string, isFrom: boolean): Point => {
          if (id === 'floating') {
            const fx = geo.getFloatingNodeX();
            if (cp.type === 'next') {
              if (isFrom) return { x: fx + geo.nodeBodyWidth, y: geo.floatingNodeCenterY };
              return { x: fx + geo.nodeBodyWidth * 0.3, y: geo.floatingNodeCenterY };
            }
            const x = isFrom ? fx + geo.nodeBodyWidth * 0.15 : fx + geo.nodeBodyWidth * 0.85;
            return { x, y: geo.floatingNodeTopY };
          }
          let idx: number;
          if (id === 'head') idx = 0;
          else if (id === 'tail') idx = geo.displayArray.length - 1;
          else idx = parseInt(id, 10);
          if (isNaN(idx)) return { x: 0, y: 0 };
          const nodeX = SharedPointerUtils.getNodeX(idx, geo.nodeBodyWidth);
          if (cp.type === 'next') {
            if (!isFrom) return { x: nodeX + geo.nodeBodyWidth * 0.5, y: nodeCenterY };
            return { x: nodeX + geo.nodeBodyWidth * 0.85, y: nodeCenterY };
          }
          const x = isFrom ? nodeX + geo.nodeBodyWidth * 0.15 : nodeX + geo.nodeBodyWidth * 0.85;
          return { x, y: nodeTopY };
        };
        let from = getAnchor(cp.fromId, true);
        let to = getAnchor(cp.toId, false);
        if (cp.fromId === 'floating' && cp.type === 'next') {
          to = { x: to.x - 40, y: 40 + geo.nodeBodyHeight };
        }
        let controlPoints: Point[] | undefined;
        if (cp.type === 'head' && cp.fromId === 'head' && cp.toId === 'floating') {
          from = { x: 45, y: nodeCenterY };
          controlPoints = [{ x: from.x, y: nodeCenterY + 90 }];
        } else if (cp.type === 'deprecated-head' && cp.fromId === 'head' && cp.toId === '0') {
          controlPoints = [];
        } else if (cp.fromId === 'floating' && cp.type === 'next') {
          const routeY = geo.floatingNodeTopY - 12;
          controlPoints = [
            { x: from.x + 25, y: from.y },
            { x: from.x + 25, y: routeY },
            { x: to.x, y: routeY },
          ];
        } else if (cp.toId === 'floating' && cp.type === 'next') {
          const routeY = geo.floatingNodeTopY - 12;
          const midX = (from.x + to.x) / 2;
          controlPoints = [
            { x: from.x, y: routeY },
            { x: midX, y: routeY },
            { x: midX, y: geo.floatingNodeTopY + 10 },
          ];
        } else {
          let routeY: number;
          if (hasFloating) {
            routeY = geo.floatingNodeTopY - 12;
          } else if (cp.type === 'next') {
            routeY = geo.nodeBodyHeight + 45;
          } else if (cp.type === 'prev') {
            routeY = 25;
          } else {
            routeY = 25;
          }
          controlPoints = [{ x: from.x, y: routeY }, { x: to.x, y: routeY }];
        }
        const isSuccess = cp.type === 'head';
        const isDeprecated = cp.type === 'deprecated-head';
        const headColor = isSuccess ? '--accent-success' : '--accent-warning';
        const bodyWidth = isSuccess ? 2.5 : (isDeprecated ? 1.5 : (cp.isHighlighted ? 2.5 : 1.5));
        const dashPattern = isDeprecated ? '5,4' : (cp.isHighlighted ? '6,4' : undefined);
        items.push(SharedPointerUtils.makeArrow(from, to, controlPoints, headColor, bodyWidth, dashPattern, cp.isHighlighted));
      }
    }

    let tempIdx: number | null = null;
    if (step.tempPointerIndex != null && step.tempPointerIndex >= 0) tempIdx = step.tempPointerIndex;
    else if (step.highlightedIndices?.length > 0) tempIdx = step.highlightedIndices[0];
    if (tempIdx !== null) {
      const cx = SharedPointerUtils.getNodeX(tempIdx, geo.nodeBodyWidth) + geo.nodeBodyWidth / 2;
      items.push(SharedPointerUtils.makeLabel(cx, -8, 'temp', 'middle', 'temp-label'));
      items.push(SharedPointerUtils.makeArrow({ x: cx, y: -5 }, { x: cx, y: 25 }, undefined, '--accent-warning', 2));
    }

    if (step.floatingNodeLabel) {
      const fx = geo.getFloatingNodeX();
      items.push(SharedPointerUtils.makeLabel(fx - 45, geo.floatingNodeCenterY + 3, step.floatingNodeLabel, 'end', 'floating-node-label'));
      items.push(SharedPointerUtils.makeArrow({ x: fx - 40, y: geo.floatingNodeCenterY }, { x: fx - 3, y: geo.floatingNodeCenterY }, undefined, '--accent-warning', 2));
      const hasFloatingNext = step.customPointers?.some(p => p.fromId === 'floating' && p.type === 'next');
      if (!hasFloatingNext) {
        items.push(SharedPointerUtils.makeArrow({ x: fx + geo.nodeBodyWidth, y: geo.floatingNodeCenterY }, { x: fx + geo.nodeBodyWidth + 45, y: geo.floatingNodeCenterY }, undefined, '--accent-warning', 2));
        items.push(SharedPointerUtils.makeLabel(fx + geo.nodeBodyWidth + 55, geo.floatingNodeCenterY + 7.5, 'Null', 'start', 'null-label'));
      }
    }

    return items;
  }

  private handleDeletePosition(step: VisualizationStep, geo: PointerGeoContext): PointerItem[] {
    const items: PointerItem[] = [];
    const nodeCenterY = 40 + geo.nodeBodyHeight / 2;
    const n = geo.displayArray.length;

    for (let i = 0; i < n - 1; i++) {
      if (step.customPointers?.some(p => p.fromId === String(i) && p.type === 'next')) continue;
      const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth) + geo.nodeBodyWidth;
      const toX = SharedPointerUtils.getNodeX(i + 1, geo.nodeBodyWidth) - 5;
      items.push(SharedPointerUtils.makeArrow({ x: fromX, y: nodeCenterY }, { x: toX, y: nodeCenterY }, undefined, '--node-section-primary', 2));
    }
    for (let i = 1; i < n; i++) {
      if (step.customPointers?.some(p => p.fromId === String(i) && p.type === 'prev')) continue;
      const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth);
      const toX = SharedPointerUtils.getNodeX(i - 1, geo.nodeBodyWidth) + geo.nodeBodyWidth + 5;
      items.push(SharedPointerUtils.makeArrow({ x: fromX, y: 75 }, { x: toX, y: 75 }, undefined, '--node-section-secondary', 2));
    }

    items.push(SharedPointerUtils.makeLabel(-2, 70, 'head', 'start', 'head-label'));
    const hasCustomHead = step.customPointers?.some(p => p.type === 'head' && p.fromId === 'head' && p.toId === 'floating');
    if (!hasCustomHead && n > 0) items.push(SharedPointerUtils.makeArrow({ x: 45, y: 65 }, { x: 78, y: 65 }, undefined, '--accent-success', 2));

    if (n > 0) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const lx = lastX + geo.nodeBodyWidth + 30;
      const tx = lastX + geo.nodeBodyWidth + 5;
      items.push(SharedPointerUtils.makeLabel(lx, 70, 'TAIL', 'start', 'tail-label'));
      items.push(SharedPointerUtils.makeArrow({ x: lastX + geo.nodeBodyWidth + 25, y: 65 }, { x: tx - 2, y: 65 }, undefined, '--accent-secondary', 2));
    }

    if (n >= 2) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const firstX = SharedPointerUtils.getNodeX(0, geo.nodeBodyWidth);
      const sx = lastX + geo.nodeBodyWidth * 0.9;
      const ex = firstX + geo.nodeBodyWidth * 0.1;
      items.push(SharedPointerUtils.makeArrow({ x: sx, y: 40 }, { x: ex, y: 38 }, [{ x: sx, y: 0 }, { x: ex, y: 0 }], '--node-section-primary', 2));
      items.push(SharedPointerUtils.makeArrow({ x: ex, y: 95 }, { x: sx, y: 95 }, [{ x: ex, y: 130 }, { x: sx, y: 130 }], '--node-section-secondary', 2));
    }

    if (step.customPointers) {
      for (const cp of step.customPointers) {
        const nodeTopY = 40;
        const nodeCenterY = nodeTopY + geo.nodeBodyHeight / 2;
        const hasFloating = cp.fromId === 'floating' || cp.toId === 'floating';
        const getAnchor = (id: string, isFrom: boolean): Point => {
          if (id === 'floating') {
            const fx = geo.getFloatingNodeX();
            if (cp.type === 'next') {
              if (isFrom) return { x: fx + geo.nodeBodyWidth, y: geo.floatingNodeCenterY };
              return { x: fx + geo.nodeBodyWidth * 0.3, y: geo.floatingNodeCenterY };
            }
            const x = isFrom ? fx + geo.nodeBodyWidth * 0.15 : fx + geo.nodeBodyWidth * 0.85;
            return { x, y: geo.floatingNodeTopY };
          }
          let idx: number;
          if (id === 'head') idx = 0;
          else if (id === 'tail') idx = geo.displayArray.length - 1;
          else idx = parseInt(id, 10);
          if (isNaN(idx)) return { x: 0, y: 0 };
          const nodeX = SharedPointerUtils.getNodeX(idx, geo.nodeBodyWidth);
          if (cp.type === 'next') {
            if (!isFrom) return { x: nodeX + geo.nodeBodyWidth * 0.5, y: nodeCenterY };
            return { x: nodeX + geo.nodeBodyWidth * 0.85, y: nodeCenterY };
          }
          const x = isFrom ? nodeX + geo.nodeBodyWidth * 0.15 : nodeX + geo.nodeBodyWidth * 0.85;
          return { x, y: nodeTopY };
        };
        let from = getAnchor(cp.fromId, true);
        let to = getAnchor(cp.toId, false);
        if (cp.fromId === 'floating' && cp.type === 'next') {
          to = { x: to.x - 40, y: 40 + geo.nodeBodyHeight };
        }
        let controlPoints: Point[] | undefined;
        if (cp.type === 'head' && cp.fromId === 'head' && cp.toId === 'floating') {
          from = { x: 45, y: nodeCenterY };
          controlPoints = [{ x: from.x, y: nodeCenterY + 90 }];
        } else if (cp.type === 'deprecated-head' && cp.fromId === 'head' && cp.toId === '0') {
          controlPoints = [];
        } else if (cp.fromId === 'floating' && cp.type === 'next') {
          const routeY = geo.floatingNodeTopY - 12;
          controlPoints = [
            { x: from.x + 25, y: from.y },
            { x: from.x + 25, y: routeY },
            { x: to.x, y: routeY },
          ];
        } else if (cp.toId === 'floating' && cp.type === 'next') {
          const routeY = geo.floatingNodeTopY - 12;
          const midX = (from.x + to.x) / 2;
          controlPoints = [
            { x: from.x, y: routeY },
            { x: midX, y: routeY },
            { x: midX, y: geo.floatingNodeTopY + 10 },
          ];
        } else {
          let routeY: number;
          if (hasFloating) {
            routeY = geo.floatingNodeTopY - 12;
          } else if (cp.type === 'next') {
            routeY = geo.nodeBodyHeight + 45;
          } else if (cp.type === 'prev') {
            routeY = 25;
          } else {
            routeY = 25;
          }
          controlPoints = [{ x: from.x, y: routeY }, { x: to.x, y: routeY }];
        }
        const isSuccess = cp.type === 'head';
        const isDeprecated = cp.type === 'deprecated-head';
        const headColor = isSuccess ? '--accent-success' : '--accent-warning';
        const bodyWidth = isSuccess ? 2.5 : (isDeprecated ? 1.5 : (cp.isHighlighted ? 2.5 : 1.5));
        const dashPattern = isDeprecated ? '5,4' : (cp.isHighlighted ? '6,4' : undefined);
        items.push(SharedPointerUtils.makeArrow(from, to, controlPoints, headColor, bodyWidth, dashPattern, cp.isHighlighted));
      }
    }

    let tempIdx: number | null = null;
    if (step.tempPointerIndex != null && step.tempPointerIndex >= 0) tempIdx = step.tempPointerIndex;
    else if (step.highlightedIndices?.length > 0) tempIdx = step.highlightedIndices[0];
    if (tempIdx !== null) {
      const cx = SharedPointerUtils.getNodeX(tempIdx, geo.nodeBodyWidth) + geo.nodeBodyWidth / 2;
      items.push(SharedPointerUtils.makeLabel(cx, -8, 'temp', 'middle', 'temp-label'));
      items.push(SharedPointerUtils.makeArrow({ x: cx, y: -5 }, { x: cx, y: 25 }, undefined, '--accent-warning', 2));
    }

    if (step.floatingNodeLabel) {
      const fx = geo.getFloatingNodeX();
      items.push(SharedPointerUtils.makeLabel(fx - 45, geo.floatingNodeCenterY + 3, step.floatingNodeLabel, 'end', 'floating-node-label'));
      items.push(SharedPointerUtils.makeArrow({ x: fx - 40, y: geo.floatingNodeCenterY }, { x: fx - 3, y: geo.floatingNodeCenterY }, undefined, '--accent-warning', 2));
      const hasFloatingNext = step.customPointers?.some(p => p.fromId === 'floating' && p.type === 'next');
      if (!hasFloatingNext) {
        items.push(SharedPointerUtils.makeArrow({ x: fx + geo.nodeBodyWidth, y: geo.floatingNodeCenterY }, { x: fx + geo.nodeBodyWidth + 45, y: geo.floatingNodeCenterY }, undefined, '--accent-warning', 2));
        items.push(SharedPointerUtils.makeLabel(fx + geo.nodeBodyWidth + 55, geo.floatingNodeCenterY + 7.5, 'Null', 'start', 'null-label'));
      }
    }

    return items;
  }

  private handleAccess(step: VisualizationStep, geo: PointerGeoContext): PointerItem[] {
    const items: PointerItem[] = [];
    const nodeCenterY = 40 + geo.nodeBodyHeight / 2;
    const n = geo.displayArray.length;

    for (let i = 0; i < n - 1; i++) {
      if (step.customPointers?.some(p => p.fromId === String(i) && p.type === 'next')) continue;
      const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth) + geo.nodeBodyWidth;
      const toX = SharedPointerUtils.getNodeX(i + 1, geo.nodeBodyWidth) - 5;
      items.push(SharedPointerUtils.makeArrow({ x: fromX, y: nodeCenterY }, { x: toX, y: nodeCenterY }, undefined, '--node-section-primary', 2));
    }
    for (let i = 1; i < n; i++) {
      if (step.customPointers?.some(p => p.fromId === String(i) && p.type === 'prev')) continue;
      const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth);
      const toX = SharedPointerUtils.getNodeX(i - 1, geo.nodeBodyWidth) + geo.nodeBodyWidth + 5;
      items.push(SharedPointerUtils.makeArrow({ x: fromX, y: 75 }, { x: toX, y: 75 }, undefined, '--node-section-secondary', 2));
    }

    items.push(SharedPointerUtils.makeLabel(-2, 70, 'head', 'start', 'head-label'));
    const hasCustomHead = step.customPointers?.some(p => p.type === 'head' && p.fromId === 'head' && p.toId === 'floating');
    if (!hasCustomHead && n > 0) items.push(SharedPointerUtils.makeArrow({ x: 45, y: 65 }, { x: 78, y: 65 }, undefined, '--accent-success', 2));

    if (n > 0) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const lx = lastX + geo.nodeBodyWidth + 30;
      const tx = lastX + geo.nodeBodyWidth + 5;
      items.push(SharedPointerUtils.makeLabel(lx, 70, 'TAIL', 'start', 'tail-label'));
      items.push(SharedPointerUtils.makeArrow({ x: lastX + geo.nodeBodyWidth + 25, y: 65 }, { x: tx - 2, y: 65 }, undefined, '--accent-secondary', 2));
    }

    if (n >= 2) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const firstX = SharedPointerUtils.getNodeX(0, geo.nodeBodyWidth);
      const sx = lastX + geo.nodeBodyWidth * 0.9;
      const ex = firstX + geo.nodeBodyWidth * 0.1;
      items.push(SharedPointerUtils.makeArrow({ x: sx, y: 40 }, { x: ex, y: 38 }, [{ x: sx, y: 0 }, { x: ex, y: 0 }], '--node-section-primary', 2));
      items.push(SharedPointerUtils.makeArrow({ x: ex, y: 95 }, { x: sx, y: 95 }, [{ x: ex, y: 130 }, { x: sx, y: 130 }], '--node-section-secondary', 2));
    }

    if (step.customPointers) {
      for (const cp of step.customPointers) {
        const nodeTopY = 40;
        const nodeCenterY = nodeTopY + geo.nodeBodyHeight / 2;
        const hasFloating = cp.fromId === 'floating' || cp.toId === 'floating';
        const getAnchor = (id: string, isFrom: boolean): Point => {
          if (id === 'floating') {
            const fx = geo.getFloatingNodeX();
            if (cp.type === 'next') {
              if (isFrom) return { x: fx + geo.nodeBodyWidth, y: geo.floatingNodeCenterY };
              return { x: fx + geo.nodeBodyWidth * 0.3, y: geo.floatingNodeCenterY };
            }
            const x = isFrom ? fx + geo.nodeBodyWidth * 0.15 : fx + geo.nodeBodyWidth * 0.85;
            return { x, y: geo.floatingNodeTopY };
          }
          let idx: number;
          if (id === 'head') idx = 0;
          else if (id === 'tail') idx = geo.displayArray.length - 1;
          else idx = parseInt(id, 10);
          if (isNaN(idx)) return { x: 0, y: 0 };
          const nodeX = SharedPointerUtils.getNodeX(idx, geo.nodeBodyWidth);
          if (cp.type === 'next') {
            if (!isFrom) return { x: nodeX + geo.nodeBodyWidth * 0.5, y: nodeCenterY };
            return { x: nodeX + geo.nodeBodyWidth * 0.85, y: nodeCenterY };
          }
          const x = isFrom ? nodeX + geo.nodeBodyWidth * 0.15 : nodeX + geo.nodeBodyWidth * 0.85;
          return { x, y: nodeTopY };
        };
        let from = getAnchor(cp.fromId, true);
        let to = getAnchor(cp.toId, false);
        if (cp.fromId === 'floating' && cp.type === 'next') {
          to = { x: to.x - 40, y: 40 + geo.nodeBodyHeight };
        }
        let controlPoints: Point[] | undefined;
        if (cp.type === 'head' && cp.fromId === 'head' && cp.toId === 'floating') {
          from = { x: 45, y: nodeCenterY };
          controlPoints = [{ x: from.x, y: nodeCenterY + 90 }];
        } else if (cp.type === 'deprecated-head' && cp.fromId === 'head' && cp.toId === '0') {
          controlPoints = [];
        } else if (cp.fromId === 'floating' && cp.type === 'next') {
          const routeY = geo.floatingNodeTopY - 12;
          controlPoints = [
            { x: from.x + 25, y: from.y },
            { x: from.x + 25, y: routeY },
            { x: to.x, y: routeY },
          ];
        } else if (cp.toId === 'floating' && cp.type === 'next') {
          const routeY = geo.floatingNodeTopY - 12;
          const midX = (from.x + to.x) / 2;
          controlPoints = [
            { x: from.x, y: routeY },
            { x: midX, y: routeY },
            { x: midX, y: geo.floatingNodeTopY + 10 },
          ];
        } else {
          let routeY: number;
          if (hasFloating) {
            routeY = geo.floatingNodeTopY - 12;
          } else if (cp.type === 'next') {
            routeY = geo.nodeBodyHeight + 45;
          } else if (cp.type === 'prev') {
            routeY = 25;
          } else {
            routeY = 25;
          }
          controlPoints = [{ x: from.x, y: routeY }, { x: to.x, y: routeY }];
        }
        const isSuccess = cp.type === 'head';
        const isDeprecated = cp.type === 'deprecated-head';
        const headColor = isSuccess ? '--accent-success' : '--accent-warning';
        const bodyWidth = isSuccess ? 2.5 : (isDeprecated ? 1.5 : (cp.isHighlighted ? 2.5 : 1.5));
        const dashPattern = isDeprecated ? '5,4' : (cp.isHighlighted ? '6,4' : undefined);
        items.push(SharedPointerUtils.makeArrow(from, to, controlPoints, headColor, bodyWidth, dashPattern, cp.isHighlighted));
      }
    }

    let tempIdx: number | null = null;
    if (step.tempPointerIndex != null && step.tempPointerIndex >= 0) tempIdx = step.tempPointerIndex;
    else if (step.highlightedIndices?.length > 0) tempIdx = step.highlightedIndices[0];
    if (tempIdx !== null) {
      const cx = SharedPointerUtils.getNodeX(tempIdx, geo.nodeBodyWidth) + geo.nodeBodyWidth / 2;
      items.push(SharedPointerUtils.makeLabel(cx, -8, 'temp', 'middle', 'temp-label'));
      items.push(SharedPointerUtils.makeArrow({ x: cx, y: -5 }, { x: cx, y: 25 }, undefined, '--accent-warning', 2));
    }

    if (step.floatingNodeLabel) {
      const fx = geo.getFloatingNodeX();
      items.push(SharedPointerUtils.makeLabel(fx - 45, geo.floatingNodeCenterY + 3, step.floatingNodeLabel, 'end', 'floating-node-label'));
      items.push(SharedPointerUtils.makeArrow({ x: fx - 40, y: geo.floatingNodeCenterY }, { x: fx - 3, y: geo.floatingNodeCenterY }, undefined, '--accent-warning', 2));
      const hasFloatingNext = step.customPointers?.some(p => p.fromId === 'floating' && p.type === 'next');
      if (!hasFloatingNext) {
        items.push(SharedPointerUtils.makeArrow({ x: fx + geo.nodeBodyWidth, y: geo.floatingNodeCenterY }, { x: fx + geo.nodeBodyWidth + 45, y: geo.floatingNodeCenterY }, undefined, '--accent-warning', 2));
        items.push(SharedPointerUtils.makeLabel(fx + geo.nodeBodyWidth + 55, geo.floatingNodeCenterY + 7.5, 'Null', 'start', 'null-label'));
      }
    }

    return items;
  }

  private handleUpdate(step: VisualizationStep, geo: PointerGeoContext): PointerItem[] {
    const items: PointerItem[] = [];
    const nodeCenterY = 40 + geo.nodeBodyHeight / 2;
    const n = geo.displayArray.length;

    for (let i = 0; i < n - 1; i++) {
      if (step.customPointers?.some(p => p.fromId === String(i) && p.type === 'next')) continue;
      const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth) + geo.nodeBodyWidth;
      const toX = SharedPointerUtils.getNodeX(i + 1, geo.nodeBodyWidth) - 5;
      items.push(SharedPointerUtils.makeArrow({ x: fromX, y: nodeCenterY }, { x: toX, y: nodeCenterY }, undefined, '--node-section-primary', 2));
    }
    for (let i = 1; i < n; i++) {
      if (step.customPointers?.some(p => p.fromId === String(i) && p.type === 'prev')) continue;
      const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth);
      const toX = SharedPointerUtils.getNodeX(i - 1, geo.nodeBodyWidth) + geo.nodeBodyWidth + 5;
      items.push(SharedPointerUtils.makeArrow({ x: fromX, y: 75 }, { x: toX, y: 75 }, undefined, '--node-section-secondary', 2));
    }

    items.push(SharedPointerUtils.makeLabel(-2, 70, 'head', 'start', 'head-label'));
    const hasCustomHead = step.customPointers?.some(p => p.type === 'head' && p.fromId === 'head' && p.toId === 'floating');
    if (!hasCustomHead && n > 0) items.push(SharedPointerUtils.makeArrow({ x: 45, y: 65 }, { x: 78, y: 65 }, undefined, '--accent-success', 2));

    if (n > 0) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const lx = lastX + geo.nodeBodyWidth + 30;
      const tx = lastX + geo.nodeBodyWidth + 5;
      items.push(SharedPointerUtils.makeLabel(lx, 70, 'TAIL', 'start', 'tail-label'));
      items.push(SharedPointerUtils.makeArrow({ x: lastX + geo.nodeBodyWidth + 25, y: 65 }, { x: tx - 2, y: 65 }, undefined, '--accent-secondary', 2));
    }

    if (n >= 2) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const firstX = SharedPointerUtils.getNodeX(0, geo.nodeBodyWidth);
      const sx = lastX + geo.nodeBodyWidth * 0.9;
      const ex = firstX + geo.nodeBodyWidth * 0.1;
      items.push(SharedPointerUtils.makeArrow({ x: sx, y: 40 }, { x: ex, y: 38 }, [{ x: sx, y: 0 }, { x: ex, y: 0 }], '--node-section-primary', 2));
      items.push(SharedPointerUtils.makeArrow({ x: ex, y: 95 }, { x: sx, y: 95 }, [{ x: ex, y: 130 }, { x: sx, y: 130 }], '--node-section-secondary', 2));
    }

    if (step.customPointers) {
      for (const cp of step.customPointers) {
        const nodeTopY = 40;
        const nodeCenterY = nodeTopY + geo.nodeBodyHeight / 2;
        const hasFloating = cp.fromId === 'floating' || cp.toId === 'floating';
        const getAnchor = (id: string, isFrom: boolean): Point => {
          if (id === 'floating') {
            const fx = geo.getFloatingNodeX();
            if (cp.type === 'next') {
              if (isFrom) return { x: fx + geo.nodeBodyWidth, y: geo.floatingNodeCenterY };
              return { x: fx + geo.nodeBodyWidth * 0.3, y: geo.floatingNodeCenterY };
            }
            const x = isFrom ? fx + geo.nodeBodyWidth * 0.15 : fx + geo.nodeBodyWidth * 0.85;
            return { x, y: geo.floatingNodeTopY };
          }
          let idx: number;
          if (id === 'head') idx = 0;
          else if (id === 'tail') idx = geo.displayArray.length - 1;
          else idx = parseInt(id, 10);
          if (isNaN(idx)) return { x: 0, y: 0 };
          const nodeX = SharedPointerUtils.getNodeX(idx, geo.nodeBodyWidth);
          if (cp.type === 'next') {
            if (!isFrom) return { x: nodeX + geo.nodeBodyWidth * 0.5, y: nodeCenterY };
            return { x: nodeX + geo.nodeBodyWidth * 0.85, y: nodeCenterY };
          }
          const x = isFrom ? nodeX + geo.nodeBodyWidth * 0.15 : nodeX + geo.nodeBodyWidth * 0.85;
          return { x, y: nodeTopY };
        };
        let from = getAnchor(cp.fromId, true);
        let to = getAnchor(cp.toId, false);
        if (cp.fromId === 'floating' && cp.type === 'next') {
          to = { x: to.x - 40, y: 40 + geo.nodeBodyHeight };
        }
        let controlPoints: Point[] | undefined;
        if (cp.type === 'head' && cp.fromId === 'head' && cp.toId === 'floating') {
          from = { x: 45, y: nodeCenterY };
          controlPoints = [{ x: from.x, y: nodeCenterY + 90 }];
        } else if (cp.type === 'deprecated-head' && cp.fromId === 'head' && cp.toId === '0') {
          controlPoints = [];
        } else if (cp.fromId === 'floating' && cp.type === 'next') {
          const routeY = geo.floatingNodeTopY - 12;
          controlPoints = [
            { x: from.x + 25, y: from.y },
            { x: from.x + 25, y: routeY },
            { x: to.x, y: routeY },
          ];
        } else if (cp.toId === 'floating' && cp.type === 'next') {
          const routeY = geo.floatingNodeTopY - 12;
          const midX = (from.x + to.x) / 2;
          controlPoints = [
            { x: from.x, y: routeY },
            { x: midX, y: routeY },
            { x: midX, y: geo.floatingNodeTopY + 10 },
          ];
        } else {
          let routeY: number;
          if (hasFloating) {
            routeY = geo.floatingNodeTopY - 12;
          } else if (cp.type === 'next') {
            routeY = geo.nodeBodyHeight + 45;
          } else if (cp.type === 'prev') {
            routeY = 25;
          } else {
            routeY = 25;
          }
          controlPoints = [{ x: from.x, y: routeY }, { x: to.x, y: routeY }];
        }
        const isSuccess = cp.type === 'head';
        const isDeprecated = cp.type === 'deprecated-head';
        const headColor = isSuccess ? '--accent-success' : '--accent-warning';
        const bodyWidth = isSuccess ? 2.5 : (isDeprecated ? 1.5 : (cp.isHighlighted ? 2.5 : 1.5));
        const dashPattern = isDeprecated ? '5,4' : (cp.isHighlighted ? '6,4' : undefined);
        items.push(SharedPointerUtils.makeArrow(from, to, controlPoints, headColor, bodyWidth, dashPattern, cp.isHighlighted));
      }
    }

    let tempIdx: number | null = null;
    if (step.tempPointerIndex != null && step.tempPointerIndex >= 0) tempIdx = step.tempPointerIndex;
    else if (step.highlightedIndices?.length > 0) tempIdx = step.highlightedIndices[0];
    if (tempIdx !== null) {
      const cx = SharedPointerUtils.getNodeX(tempIdx, geo.nodeBodyWidth) + geo.nodeBodyWidth / 2;
      items.push(SharedPointerUtils.makeLabel(cx, -8, 'temp', 'middle', 'temp-label'));
      items.push(SharedPointerUtils.makeArrow({ x: cx, y: -5 }, { x: cx, y: 25 }, undefined, '--accent-warning', 2));
    }

    if (step.floatingNodeLabel) {
      const fx = geo.getFloatingNodeX();
      items.push(SharedPointerUtils.makeLabel(fx - 45, geo.floatingNodeCenterY + 3, step.floatingNodeLabel, 'end', 'floating-node-label'));
      items.push(SharedPointerUtils.makeArrow({ x: fx - 40, y: geo.floatingNodeCenterY }, { x: fx - 3, y: geo.floatingNodeCenterY }, undefined, '--accent-warning', 2));
      const hasFloatingNext = step.customPointers?.some(p => p.fromId === 'floating' && p.type === 'next');
      if (!hasFloatingNext) {
        items.push(SharedPointerUtils.makeArrow({ x: fx + geo.nodeBodyWidth, y: geo.floatingNodeCenterY }, { x: fx + geo.nodeBodyWidth + 45, y: geo.floatingNodeCenterY }, undefined, '--accent-warning', 2));
        items.push(SharedPointerUtils.makeLabel(fx + geo.nodeBodyWidth + 55, geo.floatingNodeCenterY + 7.5, 'Null', 'start', 'null-label'));
      }
    }

    return items;
  }

  private handleSearch(step: VisualizationStep, geo: PointerGeoContext): PointerItem[] {
    const items: PointerItem[] = [];
    const nodeCenterY = 40 + geo.nodeBodyHeight / 2;
    const n = geo.displayArray.length;

    for (let i = 0; i < n - 1; i++) {
      if (step.customPointers?.some(p => p.fromId === String(i) && p.type === 'next')) continue;
      const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth) + geo.nodeBodyWidth;
      const toX = SharedPointerUtils.getNodeX(i + 1, geo.nodeBodyWidth) - 5;
      items.push(SharedPointerUtils.makeArrow({ x: fromX, y: nodeCenterY }, { x: toX, y: nodeCenterY }, undefined, '--node-section-primary', 2));
    }
    for (let i = 1; i < n; i++) {
      if (step.customPointers?.some(p => p.fromId === String(i) && p.type === 'prev')) continue;
      const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth);
      const toX = SharedPointerUtils.getNodeX(i - 1, geo.nodeBodyWidth) + geo.nodeBodyWidth + 5;
      items.push(SharedPointerUtils.makeArrow({ x: fromX, y: 75 }, { x: toX, y: 75 }, undefined, '--node-section-secondary', 2));
    }

    items.push(SharedPointerUtils.makeLabel(-2, 70, 'head', 'start', 'head-label'));
    const hasCustomHead = step.customPointers?.some(p => p.type === 'head' && p.fromId === 'head' && p.toId === 'floating');
    if (!hasCustomHead && n > 0) items.push(SharedPointerUtils.makeArrow({ x: 45, y: 65 }, { x: 78, y: 65 }, undefined, '--accent-success', 2));

    if (n > 0) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const lx = lastX + geo.nodeBodyWidth + 30;
      const tx = lastX + geo.nodeBodyWidth + 5;
      items.push(SharedPointerUtils.makeLabel(lx, 70, 'TAIL', 'start', 'tail-label'));
      items.push(SharedPointerUtils.makeArrow({ x: lastX + geo.nodeBodyWidth + 25, y: 65 }, { x: tx - 2, y: 65 }, undefined, '--accent-secondary', 2));
    }

    if (n >= 2) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const firstX = SharedPointerUtils.getNodeX(0, geo.nodeBodyWidth);
      const sx = lastX + geo.nodeBodyWidth * 0.9;
      const ex = firstX + geo.nodeBodyWidth * 0.1;
      items.push(SharedPointerUtils.makeArrow({ x: sx, y: 40 }, { x: ex, y: 38 }, [{ x: sx, y: 0 }, { x: ex, y: 0 }], '--node-section-primary', 2));
      items.push(SharedPointerUtils.makeArrow({ x: ex, y: 95 }, { x: sx, y: 95 }, [{ x: ex, y: 130 }, { x: sx, y: 130 }], '--node-section-secondary', 2));
    }

    if (step.customPointers) {
      for (const cp of step.customPointers) {
        const nodeTopY = 40;
        const nodeCenterY = nodeTopY + geo.nodeBodyHeight / 2;
        const hasFloating = cp.fromId === 'floating' || cp.toId === 'floating';
        const getAnchor = (id: string, isFrom: boolean): Point => {
          if (id === 'floating') {
            const fx = geo.getFloatingNodeX();
            if (cp.type === 'next') {
              if (isFrom) return { x: fx + geo.nodeBodyWidth, y: geo.floatingNodeCenterY };
              return { x: fx + geo.nodeBodyWidth * 0.3, y: geo.floatingNodeCenterY };
            }
            const x = isFrom ? fx + geo.nodeBodyWidth * 0.15 : fx + geo.nodeBodyWidth * 0.85;
            return { x, y: geo.floatingNodeTopY };
          }
          let idx: number;
          if (id === 'head') idx = 0;
          else if (id === 'tail') idx = geo.displayArray.length - 1;
          else idx = parseInt(id, 10);
          if (isNaN(idx)) return { x: 0, y: 0 };
          const nodeX = SharedPointerUtils.getNodeX(idx, geo.nodeBodyWidth);
          if (cp.type === 'next') {
            if (!isFrom) return { x: nodeX + geo.nodeBodyWidth * 0.5, y: nodeCenterY };
            return { x: nodeX + geo.nodeBodyWidth * 0.85, y: nodeCenterY };
          }
          const x = isFrom ? nodeX + geo.nodeBodyWidth * 0.15 : nodeX + geo.nodeBodyWidth * 0.85;
          return { x, y: nodeTopY };
        };
        let from = getAnchor(cp.fromId, true);
        let to = getAnchor(cp.toId, false);
        if (cp.fromId === 'floating' && cp.type === 'next') {
          to = { x: to.x - 40, y: 40 + geo.nodeBodyHeight };
        }
        let controlPoints: Point[] | undefined;
        if (cp.type === 'head' && cp.fromId === 'head' && cp.toId === 'floating') {
          from = { x: 45, y: nodeCenterY };
          controlPoints = [{ x: from.x, y: nodeCenterY + 90 }];
        } else if (cp.type === 'deprecated-head' && cp.fromId === 'head' && cp.toId === '0') {
          controlPoints = [];
        } else if (cp.fromId === 'floating' && cp.type === 'next') {
          const routeY = geo.floatingNodeTopY - 12;
          controlPoints = [
            { x: from.x + 25, y: from.y },
            { x: from.x + 25, y: routeY },
            { x: to.x, y: routeY },
          ];
        } else if (cp.toId === 'floating' && cp.type === 'next') {
          const routeY = geo.floatingNodeTopY - 12;
          const midX = (from.x + to.x) / 2;
          controlPoints = [
            { x: from.x, y: routeY },
            { x: midX, y: routeY },
            { x: midX, y: geo.floatingNodeTopY + 10 },
          ];
        } else {
          let routeY: number;
          if (hasFloating) {
            routeY = geo.floatingNodeTopY - 12;
          } else if (cp.type === 'next') {
            routeY = geo.nodeBodyHeight + 45;
          } else if (cp.type === 'prev') {
            routeY = 25;
          } else {
            routeY = 25;
          }
          controlPoints = [{ x: from.x, y: routeY }, { x: to.x, y: routeY }];
        }
        const isSuccess = cp.type === 'head';
        const isDeprecated = cp.type === 'deprecated-head';
        const headColor = isSuccess ? '--accent-success' : '--accent-warning';
        const bodyWidth = isSuccess ? 2.5 : (isDeprecated ? 1.5 : (cp.isHighlighted ? 2.5 : 1.5));
        const dashPattern = isDeprecated ? '5,4' : (cp.isHighlighted ? '6,4' : undefined);
        items.push(SharedPointerUtils.makeArrow(from, to, controlPoints, headColor, bodyWidth, dashPattern, cp.isHighlighted));
      }
    }

    let tempIdx: number | null = null;
    if (step.tempPointerIndex != null && step.tempPointerIndex >= 0) tempIdx = step.tempPointerIndex;
    else if (step.highlightedIndices?.length > 0) tempIdx = step.highlightedIndices[0];
    if (tempIdx !== null) {
      const cx = SharedPointerUtils.getNodeX(tempIdx, geo.nodeBodyWidth) + geo.nodeBodyWidth / 2;
      items.push(SharedPointerUtils.makeLabel(cx, -8, 'temp', 'middle', 'temp-label'));
      items.push(SharedPointerUtils.makeArrow({ x: cx, y: -5 }, { x: cx, y: 25 }, undefined, '--accent-warning', 2));
    }

    if (step.floatingNodeLabel) {
      const fx = geo.getFloatingNodeX();
      items.push(SharedPointerUtils.makeLabel(fx - 45, geo.floatingNodeCenterY + 3, step.floatingNodeLabel, 'end', 'floating-node-label'));
      items.push(SharedPointerUtils.makeArrow({ x: fx - 40, y: geo.floatingNodeCenterY }, { x: fx - 3, y: geo.floatingNodeCenterY }, undefined, '--accent-warning', 2));
      const hasFloatingNext = step.customPointers?.some(p => p.fromId === 'floating' && p.type === 'next');
      if (!hasFloatingNext) {
        items.push(SharedPointerUtils.makeArrow({ x: fx + geo.nodeBodyWidth, y: geo.floatingNodeCenterY }, { x: fx + geo.nodeBodyWidth + 45, y: geo.floatingNodeCenterY }, undefined, '--accent-warning', 2));
        items.push(SharedPointerUtils.makeLabel(fx + geo.nodeBodyWidth + 55, geo.floatingNodeCenterY + 7.5, 'Null', 'start', 'null-label'));
      }
    }

    return items;
  }

  private handleTraverse(step: VisualizationStep, geo: PointerGeoContext): PointerItem[] {
    const items: PointerItem[] = [];
    const nodeCenterY = 40 + geo.nodeBodyHeight / 2;
    const n = geo.displayArray.length;

    for (let i = 0; i < n - 1; i++) {
      if (step.customPointers?.some(p => p.fromId === String(i) && p.type === 'next')) continue;
      const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth) + geo.nodeBodyWidth;
      const toX = SharedPointerUtils.getNodeX(i + 1, geo.nodeBodyWidth) - 5;
      items.push(SharedPointerUtils.makeArrow({ x: fromX, y: nodeCenterY }, { x: toX, y: nodeCenterY }, undefined, '--node-section-primary', 2));
    }
    for (let i = 1; i < n; i++) {
      if (step.customPointers?.some(p => p.fromId === String(i) && p.type === 'prev')) continue;
      const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth);
      const toX = SharedPointerUtils.getNodeX(i - 1, geo.nodeBodyWidth) + geo.nodeBodyWidth + 5;
      items.push(SharedPointerUtils.makeArrow({ x: fromX, y: 75 }, { x: toX, y: 75 }, undefined, '--node-section-secondary', 2));
    }

    items.push(SharedPointerUtils.makeLabel(-2, 70, 'head', 'start', 'head-label'));
    const hasCustomHead = step.customPointers?.some(p => p.type === 'head' && p.fromId === 'head' && p.toId === 'floating');
    if (!hasCustomHead && n > 0) items.push(SharedPointerUtils.makeArrow({ x: 45, y: 65 }, { x: 78, y: 65 }, undefined, '--accent-success', 2));

    if (n > 0) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const lx = lastX + geo.nodeBodyWidth + 30;
      const tx = lastX + geo.nodeBodyWidth + 5;
      items.push(SharedPointerUtils.makeLabel(lx, 70, 'TAIL', 'start', 'tail-label'));
      items.push(SharedPointerUtils.makeArrow({ x: lastX + geo.nodeBodyWidth + 25, y: 65 }, { x: tx - 2, y: 65 }, undefined, '--accent-secondary', 2));
    }

    if (n >= 2) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const firstX = SharedPointerUtils.getNodeX(0, geo.nodeBodyWidth);
      const sx = lastX + geo.nodeBodyWidth * 0.9;
      const ex = firstX + geo.nodeBodyWidth * 0.1;
      items.push(SharedPointerUtils.makeArrow({ x: sx, y: 40 }, { x: ex, y: 38 }, [{ x: sx, y: 0 }, { x: ex, y: 0 }], '--node-section-primary', 2));
      items.push(SharedPointerUtils.makeArrow({ x: ex, y: 95 }, { x: sx, y: 95 }, [{ x: ex, y: 130 }, { x: sx, y: 130 }], '--node-section-secondary', 2));
    }

    if (step.customPointers) {
      for (const cp of step.customPointers) {
        const nodeTopY = 40;
        const nodeCenterY = nodeTopY + geo.nodeBodyHeight / 2;
        const hasFloating = cp.fromId === 'floating' || cp.toId === 'floating';
        const getAnchor = (id: string, isFrom: boolean): Point => {
          if (id === 'floating') {
            const fx = geo.getFloatingNodeX();
            if (cp.type === 'next') {
              if (isFrom) return { x: fx + geo.nodeBodyWidth, y: geo.floatingNodeCenterY };
              return { x: fx + geo.nodeBodyWidth * 0.3, y: geo.floatingNodeCenterY };
            }
            const x = isFrom ? fx + geo.nodeBodyWidth * 0.15 : fx + geo.nodeBodyWidth * 0.85;
            return { x, y: geo.floatingNodeTopY };
          }
          let idx: number;
          if (id === 'head') idx = 0;
          else if (id === 'tail') idx = geo.displayArray.length - 1;
          else idx = parseInt(id, 10);
          if (isNaN(idx)) return { x: 0, y: 0 };
          const nodeX = SharedPointerUtils.getNodeX(idx, geo.nodeBodyWidth);
          if (cp.type === 'next') {
            if (!isFrom) return { x: nodeX + geo.nodeBodyWidth * 0.5, y: nodeCenterY };
            return { x: nodeX + geo.nodeBodyWidth * 0.85, y: nodeCenterY };
          }
          const x = isFrom ? nodeX + geo.nodeBodyWidth * 0.15 : nodeX + geo.nodeBodyWidth * 0.85;
          return { x, y: nodeTopY };
        };
        let from = getAnchor(cp.fromId, true);
        let to = getAnchor(cp.toId, false);
        if (cp.fromId === 'floating' && cp.type === 'next') {
          to = { x: to.x - 40, y: 40 + geo.nodeBodyHeight };
        }
        let controlPoints: Point[] | undefined;
        if (cp.type === 'head' && cp.fromId === 'head' && cp.toId === 'floating') {
          from = { x: 45, y: nodeCenterY };
          controlPoints = [{ x: from.x, y: nodeCenterY + 90 }];
        } else if (cp.type === 'deprecated-head' && cp.fromId === 'head' && cp.toId === '0') {
          controlPoints = [];
        } else if (cp.fromId === 'floating' && cp.type === 'next') {
          const routeY = geo.floatingNodeTopY - 12;
          controlPoints = [
            { x: from.x + 25, y: from.y },
            { x: from.x + 25, y: routeY },
            { x: to.x, y: routeY },
          ];
        } else if (cp.toId === 'floating' && cp.type === 'next') {
          const routeY = geo.floatingNodeTopY - 12;
          const midX = (from.x + to.x) / 2;
          controlPoints = [
            { x: from.x, y: routeY },
            { x: midX, y: routeY },
            { x: midX, y: geo.floatingNodeTopY + 10 },
          ];
        } else {
          let routeY: number;
          if (hasFloating) {
            routeY = geo.floatingNodeTopY - 12;
          } else if (cp.type === 'next') {
            routeY = geo.nodeBodyHeight + 45;
          } else if (cp.type === 'prev') {
            routeY = 25;
          } else {
            routeY = 25;
          }
          controlPoints = [{ x: from.x, y: routeY }, { x: to.x, y: routeY }];
        }
        const isSuccess = cp.type === 'head';
        const isDeprecated = cp.type === 'deprecated-head';
        const headColor = isSuccess ? '--accent-success' : '--accent-warning';
        const bodyWidth = isSuccess ? 2.5 : (isDeprecated ? 1.5 : (cp.isHighlighted ? 2.5 : 1.5));
        const dashPattern = isDeprecated ? '5,4' : (cp.isHighlighted ? '6,4' : undefined);
        items.push(SharedPointerUtils.makeArrow(from, to, controlPoints, headColor, bodyWidth, dashPattern, cp.isHighlighted));
      }
    }

    let tempIdx: number | null = null;
    if (step.tempPointerIndex != null && step.tempPointerIndex >= 0) tempIdx = step.tempPointerIndex;
    else if (step.highlightedIndices?.length > 0) tempIdx = step.highlightedIndices[0];
    if (tempIdx !== null) {
      const cx = SharedPointerUtils.getNodeX(tempIdx, geo.nodeBodyWidth) + geo.nodeBodyWidth / 2;
      items.push(SharedPointerUtils.makeLabel(cx, -8, 'temp', 'middle', 'temp-label'));
      items.push(SharedPointerUtils.makeArrow({ x: cx, y: -5 }, { x: cx, y: 25 }, undefined, '--accent-warning', 2));
    }

    if (step.floatingNodeLabel) {
      const fx = geo.getFloatingNodeX();
      items.push(SharedPointerUtils.makeLabel(fx - 45, geo.floatingNodeCenterY + 3, step.floatingNodeLabel, 'end', 'floating-node-label'));
      items.push(SharedPointerUtils.makeArrow({ x: fx - 40, y: geo.floatingNodeCenterY }, { x: fx - 3, y: geo.floatingNodeCenterY }, undefined, '--accent-warning', 2));
      const hasFloatingNext = step.customPointers?.some(p => p.fromId === 'floating' && p.type === 'next');
      if (!hasFloatingNext) {
        items.push(SharedPointerUtils.makeArrow({ x: fx + geo.nodeBodyWidth, y: geo.floatingNodeCenterY }, { x: fx + geo.nodeBodyWidth + 45, y: geo.floatingNodeCenterY }, undefined, '--accent-warning', 2));
        items.push(SharedPointerUtils.makeLabel(fx + geo.nodeBodyWidth + 55, geo.floatingNodeCenterY + 7.5, 'Null', 'start', 'null-label'));
      }
    }

    return items;
  }
}
