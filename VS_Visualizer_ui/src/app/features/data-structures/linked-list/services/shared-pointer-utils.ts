import { Point, PointerArrow, PointerLabel } from './shared-pointer-types';
import { CustomPointer } from '../../../../shared/models/custom-pointer.model';

export class SharedPointerUtils {
  static nodeSpacing = 60;

  static getNodeX(index: number, nodeBodyWidth: number): number {
    return 80 + index * (nodeBodyWidth + this.nodeSpacing);
  }

  static makeMarkerKey(headColor: string): string {
    const clean = headColor.replace(/var\(|--|\)/g, '');
    return `marker-${clean}-triangle`;
  }

  static makeArrow(
    from: Point, to: Point,
    controlPoints: Point[] | undefined,
    headColor: string,
    bodyWidth: number,
    dashPattern?: string,
    highlighted?: boolean,
    transform?: string,
  ): PointerArrow {
    let d: string;
    if (controlPoints && controlPoints.length > 0) {
      d = `M ${from.x} ${from.y}`;
      for (const cp of controlPoints) {
        d += ` L ${cp.x} ${cp.y}`;
      }
      d += ` L ${to.x} ${to.y}`;
    } else {
      d = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
    }
    return {
      kind: 'arrow',
      trackKey: `arr-${from.x}-${from.y}-${to.x}-${to.y}`,
      d,
      stroke: `var(${headColor})`,
      strokeWidth: bodyWidth,
      dasharray: dashPattern,
      marker: this.makeMarkerKey(headColor),
      markerColor: `var(${headColor})`,
      transform,
      highlighted: highlighted ?? false,
    };
  }

  static makeLabel(
    x: number, y: number, text: string,
    textAnchor?: string, labelClass?: string,
  ): PointerLabel {
    return { kind: 'label', trackKey: `lbl-${text}-${labelClass ?? ''}`, x, y, text, textAnchor, labelClass };
  }

  static routeCustomPointer(
    pointer: CustomPointer,
    nodeBodyWidth: number,
    nodeBodyHeight: number,
    displayArray: (number | string)[],
    getFloatingNodeX: () => number,
    floatingNodeTopY: number,
    floatingNodeCenterY: number,
  ): PointerArrow | null {
    const nodeTopY = 40;
    const nodeCenterY = nodeTopY + nodeBodyHeight / 2;
    const hasFloating = pointer.fromId === 'floating' || pointer.toId === 'floating';

    const getAnchor = (id: string, isFrom: boolean): Point => {
      if (id === 'floating') {
        const fx = getFloatingNodeX();
        if (pointer.type === 'next') {
          if (isFrom) return { x: fx + nodeBodyWidth, y: floatingNodeCenterY };
          return { x: fx + nodeBodyWidth * 0.3, y: floatingNodeCenterY };
        }
        const x = isFrom ? fx + nodeBodyWidth * 0.15 : fx + nodeBodyWidth * 0.85;
        return { x, y: floatingNodeTopY };
      }
      let idx: number;
      if (id === 'head') idx = 0;
      else if (id === 'tail') idx = displayArray.length - 1;
      else idx = parseInt(id, 10);
      if (isNaN(idx)) return { x: 0, y: 0 };

      const nodeX = this.getNodeX(idx, nodeBodyWidth);
      if (pointer.type === 'next') {
        if (!isFrom) {
          return { x: nodeX + nodeBodyWidth * 0.5, y: nodeCenterY };
        }
        return { x: nodeX + nodeBodyWidth * 0.85, y: nodeCenterY };
      }
      const x = isFrom ? nodeX + nodeBodyWidth * 0.15 : nodeX + nodeBodyWidth * 0.85;
      return { x, y: nodeTopY };
    };

    let from = getAnchor(pointer.fromId, true);
    let to = getAnchor(pointer.toId, false);

    if (pointer.fromId === 'floating' && pointer.type === 'next') {
      to = { x: to.x - 40, y: 40 + nodeBodyHeight };
    }

    let controlPoints: Point[] | undefined;

    if (pointer.type === 'head' && pointer.fromId === 'head' && pointer.toId === 'floating') {
      from = { x: 45, y: nodeCenterY };
      controlPoints = [{ x: from.x, y: nodeCenterY + 90 }];
    } else if (pointer.type === 'deprecated-head' && pointer.fromId === 'head' && pointer.toId === '0') {
      controlPoints = [];
    } else if (pointer.fromId === 'floating' && pointer.type === 'next') {
      const routeY = floatingNodeTopY - 12;
      controlPoints = [
        { x: from.x + 25, y: from.y },
        { x: from.x + 25, y: routeY },
        { x: to.x, y: routeY },
      ];
    } else if (pointer.toId === 'floating' && pointer.type === 'next') {
      const routeY = floatingNodeTopY - 12;
      const midX = (from.x + to.x) / 2;
      controlPoints = [
        { x: from.x, y: routeY },
        { x: midX, y: routeY },
        { x: midX, y: floatingNodeTopY + 10 },
      ];
    } else {
      let routeY: number;
      if (hasFloating) {
        routeY = floatingNodeTopY - 12;
      } else if (pointer.type === 'next') {
        routeY = nodeBodyHeight + 45;
      } else if (pointer.type === 'prev') {
        routeY = 25;
      } else {
        routeY = 25;
      }
      controlPoints = [{ x: from.x, y: routeY }, { x: to.x, y: routeY }];
    }

    const isSuccess = pointer.type === 'head';
    const isDeprecated = pointer.type === 'deprecated-head';
    const headColor = isSuccess ? '--accent-success' : '--accent-warning';
    const bodyWidth = isSuccess ? 2.5 : (isDeprecated ? 1.5 : (pointer.isHighlighted ? 2.5 : 1.5));
    const dashPattern = isDeprecated ? '5,4' : (pointer.isHighlighted ? '6,4' : undefined);

    return this.makeArrow(from, to, controlPoints, headColor, bodyWidth, dashPattern, pointer.isHighlighted);
  }
}
