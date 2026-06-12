import { Injectable } from '@angular/core';
import { PointerItem, PointerGeoContext, Point } from './shared-pointer-types';
import { SharedPointerUtils } from './shared-pointer-utils';
import { VisualizationStep } from '../../../../shared/models/visualization-step.model';

@Injectable({ providedIn: 'root' })
export class NormalPointerService {
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

    items.push(SharedPointerUtils.makeLabel(-2, 70, 'head', 'start', 'head-label'));
    if (n > 0) {
      items.push(SharedPointerUtils.makeArrow({ x: 45, y: 65 }, { x: 78, y: 65 }, undefined, '--accent-success', 2));
    }

    if (n > 0) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const sx = lastX + geo.nodeBodyWidth;
      items.push(SharedPointerUtils.makeArrow({ x: sx, y: nodeCenterY }, { x: sx + 45, y: nodeCenterY }, undefined, '--accent-primary', 2));
      items.push(SharedPointerUtils.makeLabel(sx + 60, nodeCenterY + 7.5, 'Null', 'start', 'null-label'));
    }

    return items;
  }

  private handleInsertHead(step: VisualizationStep, geo: PointerGeoContext): PointerItem[] {
    const items: PointerItem[] = [];

    // Vertical center of nodes
    const nodeCenterY = 40 + geo.nodeBodyHeight / 2;
    // Number of nodes currently displayed
    const n = geo.displayArray.length;

    // 1. Forward arrows: connect each node i → i+1 (except when a custom pointer overrides)
    for (let i = 0; i < n - 1; i++) {
      if (step.customPointers?.some(p => p.fromId === String(i) && (p.type === 'next' || p.type === 'deprecated-next'))) continue;
      const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth) + geo.nodeBodyWidth;
      const toX = SharedPointerUtils.getNodeX(i + 1, geo.nodeBodyWidth) - 5;
      items.push(SharedPointerUtils.makeArrow({ x: fromX, y: nodeCenterY }, { x: toX, y: nodeCenterY }, undefined, '--node-section-primary', 2));
    }

    items.push(SharedPointerUtils.makeLabel(-2, 70, 'head', 'start', 'head-label'));
    // 3. Head arrow: from label toward first node — suppressed when backend sends head→floating
    const hasCustomHead = step.customPointers?.some(p => p.type === 'head' && p.fromId === 'head' && p.toId === 'floating');
    if (!hasCustomHead && n > 0) {
      items.push(SharedPointerUtils.makeArrow({ x: 45, y: 65 }, { x: 78, y: 65 }, undefined, '--accent-success', 2));
    }

    // 4. Null-end marker: arrow + "Null" text after the last node
    if (n > 0) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const sx = lastX + geo.nodeBodyWidth;
      items.push(SharedPointerUtils.makeArrow({ x: sx, y: nodeCenterY }, { x: sx + 45, y: nodeCenterY }, undefined, '--accent-primary', 2));
      items.push(SharedPointerUtils.makeLabel(sx + 60, nodeCenterY + 7.5, 'Null', 'start', 'null-label'));
    }

    if (step.customPointers) {
      for (const cp of step.customPointers) {
        const nodeTopY = 40;
        const nodeCenterY = nodeTopY + geo.nodeBodyHeight / 2;
        const involvesFloatingNode = cp.fromId === 'floating' || cp.toId === 'floating';

        // Build the (x,y) coordinate for one end of the custom arrow
        // 'isFrom' = true  → compute the source endpoint (where the arrow starts)
        // 'isFrom' = false → compute the target endpoint (where the arrow points to)
        const getPointerEndpoint = (nodeId: string, isFrom: boolean): Point => {
          if (nodeId === 'floating') {
            const fx = geo.getFloatingNodeX();
            // 'next' pointer: right side of the floating node at center height
            if (cp.type === 'next') {
              if (isFrom) return { x: fx + geo.nodeBodyWidth, y: geo.floatingNodeCenterY };
              return { x: fx + geo.nodeBodyWidth * 0.3, y: geo.floatingNodeCenterY };
            }
            // Other pointer types: top edge of the floating node
            const x = isFrom ? fx + geo.nodeBodyWidth * 0.15 : fx + geo.nodeBodyWidth * 0.85;
            return { x, y: geo.floatingNodeTopY };
          }
          // Resolve a regular node by its ID ('head' → index 0, 'tail' → last, or direct index)
          let resolvedIndex: number;
          if (nodeId === 'head') resolvedIndex = 0;
          else if (nodeId === 'tail') resolvedIndex = geo.displayArray.length - 1;
          else resolvedIndex = parseInt(nodeId, 10);
          if (isNaN(resolvedIndex)) return { x: 0, y: 0 };
          const nodeLeftX = SharedPointerUtils.getNodeX(resolvedIndex, geo.nodeBodyWidth);
          // 'next' pointers: right portion of the node (source) or center of node (target)
          if (cp.type === 'next') {
            if (!isFrom) return { x: nodeLeftX + geo.nodeBodyWidth * 0.5, y: nodeCenterY };
            return { x: nodeLeftX + geo.nodeBodyWidth * 0.85, y: nodeCenterY };
          }
          // Other pointer types: left portion (source) or right portion (target), both at top
          const x = isFrom ? nodeLeftX + geo.nodeBodyWidth * 0.15 : nodeLeftX + geo.nodeBodyWidth * 0.85;
          return { x, y: nodeTopY };
        };

        let arrowStart = getPointerEndpoint(cp.fromId, true);
        let arrowEnd = getPointerEndpoint(cp.toId, false);

        // When the arrow leaves the floating node's right side, dip its endpoint below the floating node
        if (cp.fromId === 'floating' && cp.type === 'next') {
          arrowEnd = { x: arrowEnd.x - 40, y: 40 + geo.nodeBodyHeight };
        }

        // Decide the intermediate control points that shape the arrow's path
        let controlPoints: Point[] | undefined;

        if (cp.type === 'head' && cp.fromId === 'head' && cp.toId === 'floating') {
          // 'head → floating': a long curved arc that drops below the list and rises back up
          arrowStart = { x: 45, y: nodeCenterY };
          arrowEnd = { x: geo.getFloatingNodeX(), y: nodeCenterY + 85 };
          controlPoints = [{ x: arrowStart.x, y: nodeCenterY + 85 }];
        } else if (cp.type === 'deprecated-head' && cp.fromId === 'head' && cp.toId === '0') {
          // 'deprecated-head → 0': dashed line from head label area to first node
          arrowStart = { x: 45, y: nodeCenterY };
          arrowEnd = { x: SharedPointerUtils.getNodeX(0, geo.nodeBodyWidth), y: nodeCenterY };
          controlPoints = [];
        } else if (cp.fromId === 'floating' && cp.type === 'next') {
          // 'floating → nodeIndex': arrows bends to route above the floating then down to the target
          const bendY = geo.floatingNodeTopY - 12;
          controlPoints = [
            { x: arrowStart.x + 25, y: arrowStart.y },
            { x: arrowStart.x + 25, y: bendY },
            { x: arrowEnd.x, y: bendY },
          ];
        } else if (cp.toId === 'floating' && cp.type === 'next') {
          // 'nodeIndex → floating': arrow routes above the floating node then drops into its top
          const bendY = geo.floatingNodeTopY - 12;
          const midpointX = (arrowStart.x + arrowEnd.x) / 2;
          controlPoints = [
            { x: arrowStart.x, y: bendY },
            { x: midpointX, y: bendY },
            { x: midpointX, y: geo.floatingNodeTopY + 10 },
          ];
        } else {
          // Generic case: route above the list or below depending on pointer type
          let bendY: number;
          if (involvesFloatingNode) {
            bendY = geo.floatingNodeTopY - 12;
          } else if (cp.type === 'next') {
            bendY = geo.nodeBodyHeight + 45;
          } else if (cp.type === 'prev') {
            bendY = 25;
          } else {
            bendY = 25;
          }
          controlPoints = [{ x: arrowStart.x, y: bendY }, { x: arrowEnd.x, y: bendY }];
        }

        // Style the arrow: green/success for head pointers, yellow/warning for others
        const isSuccess = cp.type === 'head';
        const isDeprecated = cp.type === 'deprecated-head';
        const strokeColor = isSuccess ? '--accent-success' : '--accent-warning';
        const strokeWidth = isSuccess ? 2.5 : (isDeprecated ? 1.5 : (cp.isHighlighted ? 2.5 : 1.5));
        const dashPattern = isDeprecated ? '5,4' : (cp.isHighlighted ? '6,4' : undefined);
        items.push(SharedPointerUtils.makeArrow(arrowStart, arrowEnd, controlPoints, strokeColor, strokeWidth, dashPattern, cp.isHighlighted));
      }
    }

    // 6. Temp pointer: points to the node the traversal is currently visiting
    let tempNodeIndex: number | null = null;
    if (step.tempPointerIndex != null && step.tempPointerIndex >= 0) tempNodeIndex = step.tempPointerIndex;
    else if (step.highlightedIndices?.length > 0) tempNodeIndex = step.highlightedIndices[0];
    if (tempNodeIndex !== null) {
      const nodeCenterX = SharedPointerUtils.getNodeX(tempNodeIndex, geo.nodeBodyWidth) + geo.nodeBodyWidth / 2;
      items.push(SharedPointerUtils.makeLabel(nodeCenterX, -8, 'temp', 'middle', 'temp-label'));
      items.push(SharedPointerUtils.makeArrow({ x: nodeCenterX, y: -5 }, { x: nodeCenterX, y: 25 }, undefined, '--accent-warning', 2));
    }

    // 7. Floating node: label + arrow pointing to it + null-end on its right (unless linked via custom pointer)
    if (step.floatingNodeLabel) {
      const fx = geo.getFloatingNodeX();
      items.push(SharedPointerUtils.makeLabel(fx - 40, geo.floatingNodeCenterY + 3, step.floatingNodeLabel, 'end', 'floating-node-label'));
      items.push(SharedPointerUtils.makeArrow({ x: fx - 35, y: geo.floatingNodeCenterY }, { x: fx - 3, y: geo.floatingNodeCenterY }, undefined, '--accent-warning', 2));
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

    items.push(SharedPointerUtils.makeLabel(-2, 70, 'head', 'start', 'head-label'));
    const hasCustomHead = step.customPointers?.some(p => p.type === 'head' && p.fromId === 'head' && p.toId === 'floating');
    if (!hasCustomHead && n > 0) {
      items.push(SharedPointerUtils.makeArrow({ x: 45, y: 65 }, { x: 78, y: 65 }, undefined, '--accent-success', 2));
    }

    const hasTailNext = step.customPointers?.some(p => p.fromId === String(n - 1) && p.toId === 'floating' && p.type === 'next');
    if (n > 0 && !hasTailNext) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const sx = lastX + geo.nodeBodyWidth;
      items.push(SharedPointerUtils.makeArrow({ x: sx, y: nodeCenterY }, { x: sx + 45, y: nodeCenterY }, undefined, '--accent-primary', 2));
      items.push(SharedPointerUtils.makeLabel(sx + 60, nodeCenterY + 7.5, 'Null', 'start', 'null-label'));
    }

    if (step.customPointers) {
      for (const cp of step.customPointers) {
        const nodeTopY = 40;
        const nodeCenterY = nodeTopY + geo.nodeBodyHeight / 2;
        if (cp.fromId === String(n - 1) && cp.toId === 'floating' && cp.type === 'next') {
          const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
          const fx = geo.getFloatingNodeX();
          const sx = lastX + geo.nodeBodyWidth;
          items.push(SharedPointerUtils.makeArrow(
            { x: sx, y: nodeCenterY }, 
            { x: fx + 25, y: geo.floatingNodeCenterY - 25 }, 
            [
              { x: sx + 25, y: nodeCenterY },
              { x: sx + 25, y: geo.floatingNodeTopY - 25 },
              { x: fx + 25, y: geo.floatingNodeTopY - 25 },
            ], 
            '--node-section-primary', 
            2, 
            undefined, 
            false)
          );
          continue;
        }
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
      items.push(SharedPointerUtils.makeLabel(cx, 12, 'temp', 'middle', 'temp-label'));
      items.push(SharedPointerUtils.makeArrow({ x: cx, y: 15 }, { x: cx, y: 40 }, undefined, '--accent-warning', 2));
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

    items.push(SharedPointerUtils.makeLabel(-2, 70, 'head', 'start', 'head-label'));
    const hasCustomHead = step.customPointers?.some(p => p.type === 'head' && p.fromId === 'head' && p.toId === 'floating');
    if (!hasCustomHead && n > 0) {
      items.push(SharedPointerUtils.makeArrow({ x: 45, y: 65 }, { x: 78, y: 65 }, undefined, '--accent-success', 2));
    }

    if (n > 0) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const sx = lastX + geo.nodeBodyWidth;
      items.push(SharedPointerUtils.makeArrow({ x: sx, y: nodeCenterY }, { x: sx + 45, y: nodeCenterY }, undefined, '--accent-primary', 2));
      items.push(SharedPointerUtils.makeLabel(sx + 60, nodeCenterY + 7.5, 'Null', 'start', 'null-label'));
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
          from = { x: from.x, y: nodeCenterY };
          to = { x: to.x - 40, y: geo.floatingNodeTopY + 5 };
          const routeY = geo.floatingNodeTopY + 5;
          controlPoints = [
            { x: from.x + 40, y: nodeCenterY },
            { x: from.x + 40, y: routeY },
            // { x: to.x, y: geo.floatingNodeTopY + 5 },
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
      items.push(SharedPointerUtils.makeLabel(cx, 4, 'temp', 'middle', 'temp-label'));
      items.push(SharedPointerUtils.makeArrow({ x: cx, y: 6 }, { x: cx, y: 35 }, undefined, '--accent-warning', 2));
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

    const hasDeprecatedHead = step.customPointers?.some(p => p.type === 'deprecated-head' && p.fromId === 'head');
    for (let i = 0; i < n - 1; i++) {
      if (step.customPointers?.some(p => p.fromId === String(i) && p.type === 'next')) continue;
      if (hasDeprecatedHead && i === 0) continue;
      const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth) + geo.nodeBodyWidth;
      const toX = SharedPointerUtils.getNodeX(i + 1, geo.nodeBodyWidth) - 5;
      items.push(SharedPointerUtils.makeArrow({ x: fromX, y: nodeCenterY }, { x: toX, y: nodeCenterY }, undefined, '--node-section-primary', 2));
    }

    if (hasDeprecatedHead && n > 1) {
      const fromX = SharedPointerUtils.getNodeX(0, geo.nodeBodyWidth) + geo.nodeBodyWidth;
      const toX = SharedPointerUtils.getNodeX(1, geo.nodeBodyWidth) - 5;
      items.push(SharedPointerUtils.makeArrow({ x: fromX, y: nodeCenterY }, { x: toX, y: nodeCenterY }, undefined, '--accent-danger', 1.5, '5,4', false));
    }

    items.push(SharedPointerUtils.makeLabel(-2, 70, 'head', 'start', 'head-label'));
    const hasCustomHead = step.customPointers?.some(p =>
      (p.type === 'head' && p.fromId === 'head' && p.toId === 'floating') ||
      (p.type === 'deprecated-head' && p.fromId === 'head' && p.toId === '0') ||
      (p.fromId === 'head' && p.type === 'next')
    );
    if (!hasCustomHead && n > 0) {
      items.push(SharedPointerUtils.makeArrow({ x: 45, y: 65 }, { x: 78, y: 65 }, undefined, '--accent-success', 2));
    }

    if (n > 0) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const sx = lastX + geo.nodeBodyWidth;
      items.push(SharedPointerUtils.makeArrow({ x: sx, y: nodeCenterY }, { x: sx + 45, y: nodeCenterY }, undefined, '--accent-primary', 2));
      items.push(SharedPointerUtils.makeLabel(sx + 60, nodeCenterY + 7.5, 'Null', 'start', 'null-label'));
    }

    if (step.customPointers) {
      for (const cp of step.customPointers) {
        const nodeTopY = 40;
        const nodeCenterY = nodeTopY + geo.nodeBodyHeight / 2;
        if (cp.type === 'deprecated-head' && cp.fromId === 'head' && cp.toId === '0') {
          items.push(SharedPointerUtils.makeArrow(
            { x: 45, y: nodeCenterY },
            { x: SharedPointerUtils.getNodeX(0, geo.nodeBodyWidth) - 5, y: nodeCenterY },
            undefined, '--accent-danger', 1.5, '5,4', false
          ));
          continue;
        }
        if (cp.fromId === 'head' && cp.type === 'next') {
          const node1X = SharedPointerUtils.getNodeX(parseInt(cp.toId, 10), geo.nodeBodyWidth);
          const bendY = 40 + geo.nodeBodyHeight + 25;
          const touchY = 40 + geo.nodeBodyHeight - 3;
          items.push(SharedPointerUtils.makeArrow(
            { x: 40, y: nodeCenterY },
            { x: node1X, y: touchY },
            [
              { x: 40, y: bendY },
              { x: node1X - 50, y: bendY },
              { x: node1X - 50, y: touchY },
            ],
            '--accent-success', 2.5, undefined, false
          ));
          continue;
        }
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
      items.push(SharedPointerUtils.makeLabel(cx, 4, 'temp', 'middle', 'temp-label'));
      items.push(SharedPointerUtils.makeArrow({ x: cx, y: 6 }, { x: cx, y: 35 }, undefined, '--accent-warning', 2));
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

    items.push(SharedPointerUtils.makeLabel(-2, 70, 'head', 'start', 'head-label'));
    const hasCustomHead = step.customPointers?.some(p => p.type === 'head' && p.fromId === 'head' && p.toId === 'floating');
    if (!hasCustomHead && n > 0) {
      items.push(SharedPointerUtils.makeArrow({ x: 45, y: 65 }, { x: 78, y: 65 }, undefined, '--accent-success', 2));
    }

    if (n > 0) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const sx = lastX + geo.nodeBodyWidth;
      items.push(SharedPointerUtils.makeArrow({ x: sx, y: nodeCenterY }, { x: sx + 45, y: nodeCenterY }, undefined, '--accent-primary', 2));
      items.push(SharedPointerUtils.makeLabel(sx + 55, nodeCenterY + 7.5, 'Null', 'start', 'null-label'));
    }

    if (step.customPointers) {
      for (const cp of step.customPointers) {
        const nodeTopY = 40;
        const nodeCenterY = nodeTopY + geo.nodeBodyHeight / 2;
        if (cp.toId === 'null' && cp.type === 'next') {
          const idx = parseInt(cp.fromId, 10);
          const fromX = SharedPointerUtils.getNodeX(idx, geo.nodeBodyWidth) + geo.nodeBodyWidth;
          const toX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
          items.push(SharedPointerUtils.makeArrow({ x: fromX, y: nodeCenterY }, 
            { x: toX, y: nodeCenterY }, 
            undefined, 
            '--accent-danger', 
            1.5, 
            '5,4', 
            false)
          );
          items.push(
            SharedPointerUtils.makeArrow(
              { x: fromX, y: nodeCenterY },
              { x: toX + geo.nodeBodyWidth / 2, y: nodeCenterY + 70 },
              [
                { x: fromX + 20, y: nodeCenterY },
                { x: fromX + 20, y: nodeCenterY + 70 },
              ],
              '--accent-primary',
              2,
              undefined,
              false,
            ),
          );
          items.push(
            SharedPointerUtils.makeLabel(
              toX + geo.nodeBodyWidth / 2 + 10,
              nodeCenterY + 75,
              'Null',
              'start',
              'null-label',
            ),
          );
          continue;
        }
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
      if (step.customPointers?.some(p => p.fromId === String(i) && (p.type === 'next' || p.type === 'deprecated-next'))) continue;
      const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth) + geo.nodeBodyWidth;
      const toX = SharedPointerUtils.getNodeX(i + 1, geo.nodeBodyWidth) - 5;
      items.push(SharedPointerUtils.makeArrow({ x: fromX, y: nodeCenterY }, { x: toX, y: nodeCenterY }, undefined, '--node-section-primary', 2));
    }

    items.push(SharedPointerUtils.makeLabel(-2, 70, 'head', 'start', 'head-label'));
    const hasCustomHead = step.customPointers?.some(p => p.type === 'head' && p.fromId === 'head' && p.toId === 'floating');
    if (!hasCustomHead && n > 0) {
      items.push(SharedPointerUtils.makeArrow({ x: 45, y: 65 }, { x: 78, y: 65 }, undefined, '--accent-success', 2));
    }

    if (n > 0) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const sx = lastX + geo.nodeBodyWidth;
      items.push(SharedPointerUtils.makeArrow({ x: sx, y: nodeCenterY }, { x: sx + 45, y: nodeCenterY }, undefined, '--accent-primary', 2));
      items.push(SharedPointerUtils.makeLabel(sx + 60, nodeCenterY + 7.5, 'Null', 'start', 'null-label'));
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
          if (cp.type === 'deprecated-next') {
            if (!isFrom) return { x: nodeX, y: nodeCenterY };
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
        } else if (cp.type === 'deprecated-next') {
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
            routeY = geo.nodeBodyHeight + 80;
            from = { x: from.x, y: nodeCenterY + 25 };
            to = { x: to.x - geo.nodeBodyWidth / 4, y: to.y + 25 };
          } else if (cp.type === 'prev') {
            routeY = 25;
          } else {
            routeY = 25;
          }
          controlPoints = [{ x: from.x, y: routeY }, { x: to.x, y: routeY }];
        }
        const isSuccess = cp.type === 'head';
        const isDeprecated = cp.type === 'deprecated-head' || cp.type === 'deprecated-next';
        let headColor: string;
        if (cp.type === 'deprecated-next') {
          headColor = '--accent-danger';
        } else {
          headColor = isSuccess ? '--accent-success' : '--accent-warning';
        }
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
      items.push(SharedPointerUtils.makeArrow({ x: cx, y: -5 }, { x: cx, y: 38 }, undefined, '--accent-warning', 2));
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

    items.push(SharedPointerUtils.makeLabel(-2, 70, 'head', 'start', 'head-label'));
    const hasCustomHead = step.customPointers?.some(p => p.type === 'head' && p.fromId === 'head' && p.toId === 'floating');
    if (!hasCustomHead && n > 0) {
      items.push(SharedPointerUtils.makeArrow({ x: 45, y: 65 }, { x: 78, y: 65 }, undefined, '--accent-success', 2));
    }

    if (n > 0) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const sx = lastX + geo.nodeBodyWidth;
      items.push(SharedPointerUtils.makeArrow({ x: sx, y: nodeCenterY }, { x: sx + 45, y: nodeCenterY }, undefined, '--accent-primary', 2));
      items.push(SharedPointerUtils.makeLabel(sx + 60, nodeCenterY + 7.5, 'Null', 'start', 'null-label'));
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
      items.push(SharedPointerUtils.makeArrow({ x: cx, y: -5 }, { x: cx, y: 35 }, undefined, '--accent-warning', 2));
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

    items.push(SharedPointerUtils.makeLabel(-2, 70, 'head', 'start', 'head-label'));
    const hasCustomHead = step.customPointers?.some(p => p.type === 'head' && p.fromId === 'head' && p.toId === 'floating');
    if (!hasCustomHead && n > 0) {
      items.push(SharedPointerUtils.makeArrow({ x: 45, y: 65 }, { x: 78, y: 65 }, undefined, '--accent-success', 2));
    }

    if (n > 0) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const sx = lastX + geo.nodeBodyWidth;
      items.push(SharedPointerUtils.makeArrow({ x: sx, y: nodeCenterY }, { x: sx + 45, y: nodeCenterY }, undefined, '--accent-primary', 2));
      items.push(SharedPointerUtils.makeLabel(sx + 60, nodeCenterY + 7.5, 'Null', 'start', 'null-label'));
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
      items.push(SharedPointerUtils.makeArrow({ x: cx, y: -5 }, { x: cx, y: 35 }, undefined, '--accent-warning', 2));
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

    items.push(SharedPointerUtils.makeLabel(-2, 70, 'head', 'start', 'head-label'));
    const hasCustomHead = step.customPointers?.some(p => p.type === 'head' && p.fromId === 'head' && p.toId === 'floating');
    if (!hasCustomHead && n > 0) {
      items.push(SharedPointerUtils.makeArrow({ x: 45, y: 65 }, { x: 78, y: 65 }, undefined, '--accent-success', 2));
    }

    if (n > 0) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const sx = lastX + geo.nodeBodyWidth;
      items.push(SharedPointerUtils.makeArrow({ x: sx, y: nodeCenterY }, { x: sx + 45, y: nodeCenterY }, undefined, '--accent-primary', 2));
      items.push(SharedPointerUtils.makeLabel(sx + 60, nodeCenterY + 7.5, 'Null', 'start', 'null-label'));
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

    items.push(SharedPointerUtils.makeLabel(-2, 70, 'head', 'start', 'head-label'));
    const hasCustomHead = step.customPointers?.some(p => p.type === 'head' && p.fromId === 'head' && p.toId === 'floating');
    if (!hasCustomHead && n > 0) {
      items.push(SharedPointerUtils.makeArrow({ x: 45, y: 65 }, { x: 78, y: 65 }, undefined, '--accent-success', 2));
    }

    if (n > 0) {
      const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
      const sx = lastX + geo.nodeBodyWidth;
      items.push(SharedPointerUtils.makeArrow({ x: sx, y: nodeCenterY }, { x: sx + 45, y: nodeCenterY }, undefined, '--accent-primary', 2));
      items.push(SharedPointerUtils.makeLabel(sx + 60, nodeCenterY + 7.5, 'Null', 'start', 'null-label'));
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
