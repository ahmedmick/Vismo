export interface CustomPointer {
  fromId: string;
  toId: string;
  type: 'next' | 'prev' | 'head' | 'deprecated-head' | 'deprecated-next';
  isHighlighted: boolean;
}
