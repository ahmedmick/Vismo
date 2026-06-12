export interface PointerConfig {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  pathType: 'straight' | 'routed';
  controlPoints?: { x: number; y: number }[];
  bodyColor: string;
  headColor: string;
  bodyWidth: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  dashPattern?: string;
  headStyle: 'triangle';
  label?: string;
}
