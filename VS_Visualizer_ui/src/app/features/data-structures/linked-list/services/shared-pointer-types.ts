import { VisualizationStep } from '../../../../shared/models/visualization-step.model';

export interface Point {
  x: number;
  y: number;
}

export interface PointerArrow {
  kind: 'arrow';
  trackKey: string;
  d: string;
  stroke: string;
  strokeWidth: number;
  dasharray?: string;
  marker?: string;
  markerColor?: string;
  transform?: string;
  highlighted?: boolean;
}

export interface PointerLabel {
  kind: 'label';
  trackKey: string;
  x: number;
  y: number;
  text: string;
  textAnchor?: string;
  labelClass?: string;
}

export type PointerItem = PointerArrow | PointerLabel;

export interface MarkerDef {
  id: string;
  color: string;
}

export interface PointerGeoContext {
  nodeBodyWidth: number;
  nodeBodyHeight: number;
  displayArray: (number | string)[];
  getFloatingNodeX: () => number;
  floatingNodeTopY: number;
  floatingNodeCenterY: number;
  step: VisualizationStep | null;
}
