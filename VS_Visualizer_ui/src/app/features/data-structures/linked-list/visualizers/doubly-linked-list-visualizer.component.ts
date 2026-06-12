import { Component, Input, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkedListLayoutService } from '../services/linked-list-layout.service';
import { DoublyPointerService } from '../services/doubly-pointer.service';
import { LinkedListType } from '../services/linked-list-layout.service';
import { PointerItem, PointerGeoContext } from '../services/shared-pointer-types';

@Component({
  selector: 'app-doubly-linked-list-visualizer',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <svg
      class="linked-list-svg"
      [attr.width]="layout.getLinkedListWidth(displayArray, nodeBodyWidth)"
      [attr.height]="svgHeight"
    >
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="var(--node-section-primary)" />
        </marker>
        <marker id="arrowhead-prev" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="var(--node-section-secondary)" />
        </marker>
        <marker id="null-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent-primary)" />
        </marker>
        <marker id="arrowhead-highlight" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent-warning)" />
        </marker>
        @for (m of uniqueMarkers(); track m.id) {
          <marker [attr.id]="m.id" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" [attr.fill]="m.color" />
          </marker>
        }
      </defs>

      <!-- All pointers rendered from handler -->
      @for (item of getPointerItems(); track item.trackKey) {
        @if (item.kind === 'arrow') {
          <path
            [attr.d]="item.d"
            fill="none"
            [attr.stroke]="item.stroke"
            [attr.stroke-width]="item.strokeWidth"
            [attr.stroke-dasharray]="item.dasharray ?? ''"
            [attr.marker-end]="item.marker ? 'url(#' + item.marker + ')' : null"
            [attr.transform]="item.transform ?? null"
            class="link-arrow"
            [class.highlighted]="item.highlighted"
          />
        }
        @if (item.kind === 'label') {
          <text
            [attr.x]="item.x"
            [attr.y]="item.y"
            [attr.text-anchor]="item.textAnchor ?? 'start'"
            class="pointer-label"
            [class.head-label]="item.labelClass === 'head-label'"
            [class.temp-label]="item.labelClass === 'temp-label'"
            [class.null-label]="item.labelClass?.startsWith('null-label')"
            [class.floating-node-label]="item.labelClass === 'floating-node-label'"
            [class.tail-label]="item.labelClass === 'tail-label'"
          >{{ item.text }}</text>
        }
      }

      <!-- Draw nodes -->
      @for (value of displayArray; track $index) {
        <g class="node-group" [class.node-highlighted]="layout.isHighlighted($index)">
          <rect
            [attr.x]="layout.getNodeX($index, nodeBodyWidth)"
            [attr.y]="nodeTopY"
            [attr.width]="nodeBodyWidth"
            [attr.height]="nodeBodyHeight"
            rx="8"
            class="node-rect"
            [class.highlighted]="layout.isHighlighted($index)"
          />
          <rect
            [attr.x]="layout.getNodeX($index, nodeBodyWidth)"
            [attr.y]="nodeTopY"
            [attr.width]="nodeBodyWidth * 0.2"
            [attr.height]="nodeBodyHeight"
            rx="8"
            class="node-prev-section"
            [class.highlighted]="layout.isHighlighted($index)"
          />
          <circle
            [attr.cx]="layout.getNodeX($index, nodeBodyWidth) + (nodeBodyWidth * 0.2) / 2"
            [attr.cy]="nodeCenterY"
            r="4"
            class="pointer-dot prev-dot"
            [class.highlighted]="layout.isHighlighted($index)"
          />
          <rect
            [attr.x]="layout.getNodeX($index, nodeBodyWidth) + nodeBodyWidth * 0.2"
            [attr.y]="nodeTopY"
            [attr.width]="nodeBodyWidth * 0.6"
            [attr.height]="nodeBodyHeight"
            rx="8"
            class="node-data-section"
            [class.highlighted]="layout.isHighlighted($index)"
          />
          <text
            [attr.x]="layout.getNodeX($index, nodeBodyWidth) + nodeBodyWidth * 0.2 + (nodeBodyWidth * 0.6) / 2"
            [attr.y]="nodeCenterY"
            class="node-value"
            [class.highlighted]="layout.isHighlighted($index)"
          >{{ value }}</text>
          <rect
            [attr.x]="layout.getNodeX($index, nodeBodyWidth) + nodeBodyWidth * 0.8"
            [attr.y]="nodeTopY"
            [attr.width]="nodeBodyWidth * 0.2"
            [attr.height]="nodeBodyHeight"
            rx="8"
            class="node-next-section"
            [class.highlighted]="layout.isHighlighted($index)"
          />
          <circle
            [attr.cx]="layout.getNodeX($index, nodeBodyWidth) + nodeBodyWidth * 0.8 + (nodeBodyWidth * 0.2) / 2"
            [attr.cy]="nodeCenterY"
            r="4"
            class="pointer-dot"
            [class.highlighted]="layout.isHighlighted($index)"
          />
          <text
            [attr.x]="layout.getNodeX($index, nodeBodyWidth) + nodeBodyWidth / 2"
            [attr.y]="nodeTopY + nodeBodyHeight + 15"
            class="index-label"
          >[{{ $index }}]</text>
        </g>
      }

      <!-- Floating Node -->
      @if (currentStep?.floatingNodeValue !== undefined && currentStep?.floatingNodeValue !== null) {
        <g class="node-group floating-node" [attr.transform]="floatingNodeTransform">
          <rect
            [attr.x]="getFloatingNodeX()"
            [attr.y]="floatingNodeTopY"
            [attr.width]="nodeBodyWidth"
            [attr.height]="nodeBodyHeight"
            rx="8"
            class="node-rect highlighted"
          />
          <rect
            [attr.x]="getFloatingNodeX()"
            [attr.y]="floatingNodeTopY"
            [attr.width]="nodeBodyWidth * 0.2"
            [attr.height]="nodeBodyHeight"
            rx="8"
            class="node-prev-section highlighted"
          />
          <circle
            [attr.cx]="getFloatingNodeX() + (nodeBodyWidth * 0.2) / 2"
            [attr.cy]="floatingNodeCenterY"
            r="4"
            class="pointer-dot prev-dot highlighted"
          />
          <rect
            [attr.x]="getFloatingNodeX() + nodeBodyWidth * 0.2"
            [attr.y]="floatingNodeTopY"
            [attr.width]="nodeBodyWidth * 0.6"
            [attr.height]="nodeBodyHeight"
            rx="8"
            class="node-data-section highlighted"
          />
          <text
            [attr.x]="getFloatingNodeX() + nodeBodyWidth * 0.2 + (nodeBodyWidth * 0.6) / 2"
            [attr.y]="floatingNodeCenterY"
            class="node-value highlighted"
          >{{ currentStep!.floatingNodeValue }}</text>
          <rect
            [attr.x]="getFloatingNodeX() + nodeBodyWidth * 0.8"
            [attr.y]="floatingNodeTopY"
            [attr.width]="nodeBodyWidth * 0.2"
            [attr.height]="nodeBodyHeight"
            rx="8"
            class="node-next-section highlighted"
          />
          <circle
            [attr.cx]="getFloatingNodeX() + nodeBodyWidth * 0.8 + (nodeBodyWidth * 0.2) / 2"
            [attr.cy]="floatingNodeCenterY"
            r="4"
            class="pointer-dot highlighted"
          />
          @if (layout.showFloatingNullArrow(currentStep)) {
            <line
              [attr.x1]="getFloatingNodeX() + nodeBodyWidth"
              [attr.y1]="floatingNodeCenterY"
              [attr.x2]="getFloatingNodeX() + nodeBodyWidth + 25"
              [attr.y2]="floatingNodeCenterY"
              stroke="var(--accent-warning)"
              stroke-width="2"
            />
            <polygon
              [attr.points]="(getFloatingNodeX() + nodeBodyWidth + 20) + ',' + (floatingNodeCenterY - 5) + ' ' + (getFloatingNodeX() + nodeBodyWidth + 30) + ',' + floatingNodeCenterY + ' ' + (getFloatingNodeX() + nodeBodyWidth + 20) + ',' + (floatingNodeCenterY + 5)"
              fill="var(--accent-warning)"
            />
            <text
              [attr.x]="getFloatingNodeX() + nodeBodyWidth + 35"
              [attr.y]="floatingNodeCenterY"
              class="null-label floating-null-label"
            >NULL</text>
          }
        </g>
      }
    </svg>
  `,
})
export class DoublyLinkedListVisualizerComponent {
  @Input({ required: true }) displayArray: (number | string)[] = [];
  @Input({ required: true }) operation: string = '';
  @Input({ required: true }) listType: LinkedListType = 'doubly';

  layout = inject(LinkedListLayoutService);
  pointerService = inject(DoublyPointerService);

  get nodeBodyWidth(): number {
    return this.layout.getNodeBodyWidth(this.displayArray);
  }

  get nodeBodyHeight(): number {
    return this.layout.getNodeBodyHeight(this.displayArray);
  }

  get nodeTopY(): number {
    return 40;
  }

  get nodeCenterY(): number {
    return this.nodeTopY + this.nodeBodyHeight / 2;
  }

  get currentStep(): any {
    return this.layout.getCurrentStep();
  }

  get floatingNodeYOffset(): number {
    return this.layout.getFloatingNodeYOffset(this.currentStep, this.operation);
  }

  get floatingNodeTransform(): string {
    return this.floatingNodeYOffset > 0 ? `translate(0, ${this.floatingNodeYOffset})` : '';
  }

  get floatingNodeTopY(): number {
    return 130;
  }

  get floatingNodeCenterY(): number {
    return this.floatingNodeTopY + this.nodeBodyHeight / 2;
  }

  get svgHeight(): number {
    return this.currentStep?.floatingNodeValue !== undefined && this.currentStep?.floatingNodeValue !== null
      ? 210 + this.floatingNodeYOffset
      : 180;
  }

  getFloatingNodeX(): number {
    const tempIdx = this.layout.getTempPointerIndex();
    if (tempIdx !== null && tempIdx >= 0) {
      return this.layout.getNodeX(tempIdx, this.nodeBodyWidth);
    }
    return this.layout.getNodeX(0, this.nodeBodyWidth);
  }

  private getGeo(): PointerGeoContext {
    return {
      nodeBodyWidth: this.nodeBodyWidth,
      nodeBodyHeight: this.nodeBodyHeight,
      displayArray: this.displayArray,
      getFloatingNodeX: () => this.getFloatingNodeX(),
      floatingNodeTopY: this.floatingNodeTopY,
      floatingNodeCenterY: this.floatingNodeCenterY,
      step: this.currentStep,
    };
  }

  getPointerItems(): PointerItem[] {
    return this.pointerService.getPointersForStep(this.operation, this.currentStep, this.getGeo());
  }

  uniqueMarkers(): { id: string; color: string }[] {
    const seen = new Set<string>();
    const items = this.getPointerItems();
    const result: { id: string; color: string }[] = [];
    for (const item of items) {
      if (item.kind === 'arrow' && item.marker && !seen.has(item.marker) && item.markerColor) {
        seen.add(item.marker);
        result.push({ id: item.marker, color: item.markerColor });
      }
    }
    return result;
  }
}
