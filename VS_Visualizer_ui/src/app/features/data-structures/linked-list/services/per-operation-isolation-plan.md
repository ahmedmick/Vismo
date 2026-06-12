# True Per-Operation Per-Type Handler Isolation Plan

## Goal
Replace `buildWithCustom`/`buildBase` with 40 fully self-contained handlers (10 operations × 4 types). Every handler explicitly constructs all its own `PointerItem[]` via `makeArrow`/`makeLabel` — no delegation to multi-item shared generators.

---

## Step 1 — Strip `SharedPointerUtils`

**Remove** (~220 lines):
- `getNextArrows`, `getPrevArrows`
- `getHeadLabel`, `getCircularArc`, `getPrevCircularArc`
- `getNullEndArrow`, `getNullLabel`
- `getTempPointer`, `getFloatingNodeLabel`
- `nodeTopY` (inline as `40`)

**Keep** (~70 lines):
- `getNodeX(index, nodeBodyWidth)` — coordinate math
- `makeArrow(from, to, controlPoints, headColor, bodyWidth, dashPattern?, highlighted?, transform?)` — single arrow constructor
- `makeLabel(x, y, text, textAnchor?, labelClass?)` — single label constructor
- `makeMarkerKey(headColor)` — marker ID generation
- `routeCustomPointer(pointer, ...)` — external custom-pointer routing

---

## Step 2 — Remove shared methods from all 4 services

Delete from `NormalPointerService` (and the 3 subclass overrides):
- `buildWithCustom`, `buildBase`, `defaultPointers`
- `noStepItems`, `getEndMarker`, `getPrevEndMarker`, `getTailLabel`

---

## Step 3 — Each handler's internal structure (40 handlers)

Every handler individually produces ALL pointer items for that one operation in that one type.

### Template (normal-type handler):

```typescript
private handleXxx(step: VisualizationStep, geo: PointerGeoContext): PointerItem[] {
  const items: PointerItem[] = [];
  const nodeCenterY = 40 + geo.nodeBodyHeight / 2;
  const n = geo.displayArray.length;

  // ---- 1. Next arrows ----
  for (let i = 0; i < n - 1; i++) {
    const hasCustom = step.customPointers?.some(p => p.fromId === String(i) && p.type === 'next');
    if (!hasCustom) {
      const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth) + geo.nodeBodyWidth;
      const toX = SharedPointerUtils.getNodeX(i + 1, geo.nodeBodyWidth) - 5;
      items.push(SharedPointerUtils.makeArrow(
        { x: fromX, y: nodeCenterY }, { x: toX, y: nodeCenterY },
        undefined, '--node-section-primary', 2,
      ));
    }
  }

  // ---- 2. Head label + green arrow ----
  items.push(SharedPointerUtils.makeLabel(-2, 70, 'head', 'start', 'head-label'));
  const hasCustomHead = step.customPointers?.some(
    p => p.type === 'head' && p.fromId === 'head' && p.toId === 'floating'
  );
  if (!hasCustomHead && n > 0) {
    items.push(SharedPointerUtils.makeArrow(
      { x: 45, y: 65 }, { x: 78, y: 65 },
      undefined, '--accent-success', 2,
    ));
  }

  // ---- 3. End marker (per-type, see Step 4) ----
  // ... per-type rendering here ...

  // ---- 4. Custom pointers ----
  if (step.customPointers) {
    for (const cp of step.customPointers) {
      const arrow = SharedPointerUtils.routeCustomPointer(
        cp, geo.nodeBodyWidth, geo.nodeBodyHeight, geo.displayArray,
        geo.getFloatingNodeX, geo.floatingNodeTopY, geo.floatingNodeCenterY,
      );
      if (arrow) items.push(arrow);
    }
  }

  // ---- 5. Temp pointer ----
  let tempIdx: number | null = null;
  if (step.tempPointerIndex != null && step.tempPointerIndex >= 0) {
    tempIdx = step.tempPointerIndex;
  } else if (step.highlightedIndices?.length > 0) {
    tempIdx = step.highlightedIndices[0];
  }
  if (tempIdx !== null) {
    const cx = SharedPointerUtils.getNodeX(tempIdx, geo.nodeBodyWidth) + geo.nodeBodyWidth / 2;
    items.push(SharedPointerUtils.makeLabel(cx, -8, 'temp', 'middle', 'temp-label'));
    items.push(SharedPointerUtils.makeArrow(
      { x: cx, y: -5 }, { x: cx, y: 25 },
      undefined, '--accent-warning', 2,
    ));
  }

  // ---- 6. Floating node label ----
  if (step.floatingNodeLabel) {
    const fx = geo.getFloatingNodeX();
    items.push(SharedPointerUtils.makeLabel(fx - 22, geo.floatingNodeCenterY + 3, step.floatingNodeLabel, 'end'));
    items.push(SharedPointerUtils.makeArrow(
      { x: fx - 18, y: geo.floatingNodeCenterY }, { x: fx - 3, y: geo.floatingNodeCenterY },
      undefined, '--accent-warning', 2,
    ));
  }

  return items;
}
```

---

## Step 4 — Per-type section-3 differences

### Normal — Null right
```typescript
if (n > 0) {
  const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
  const sx = lastX + geo.nodeBodyWidth;
  const sy = nodeCenterY;
  items.push(SharedPointerUtils.makeArrow(
    { x: sx, y: sy }, { x: sx + 45, y: sy },
    undefined, '--accent-primary', 2,
  ));
  items.push(SharedPointerUtils.makeLabel(sx + 60, sy + 7.5, 'Null', 'start', 'null-label'));
}
```

### Circular — Arc last→head
```typescript
if (n >= 2) {
  const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
  const firstX = SharedPointerUtils.getNodeX(0, geo.nodeBodyWidth);
  const sx = lastX + geo.nodeBodyWidth * 0.8;
  const ex = firstX + geo.nodeBodyWidth * 0.8;
  items.push(SharedPointerUtils.makeArrow(
    { x: sx, y: 40 }, { x: ex, y: 38 },
    [{ x: sx, y: 0 }, { x: ex, y: 0 }],
    '--node-section-primary', 2,
  ));
}
```

### Doubly — Null down + tail label
```typescript
// Next null down
if (n > 0) {
  const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
  const sy = nodeCenterY + 40;
  const sx = lastX + geo.nodeBodyWidth * 0.9;
  items.push(SharedPointerUtils.makeArrow(
    { x: sx, y: sy }, { x: sx, y: sy + 35 },
    undefined, '--accent-primary', 2,
  ));
  items.push(SharedPointerUtils.makeLabel(sx - 10, sy + 37, 'Null', 'end', 'null-label'));
}
// Prev null down
if (n > 0) {
  const firstX = SharedPointerUtils.getNodeX(0, geo.nodeBodyWidth);
  const sy = nodeCenterY + 40;
  const sx = firstX + geo.nodeBodyWidth * 0.1;
  items.push(SharedPointerUtils.makeArrow(
    { x: sx, y: sy }, { x: sx, y: sy + 35 },
    undefined, '--accent-secondary', 2,
  ));
  items.push(SharedPointerUtils.makeLabel(sx - 10, sy + 37, 'Null', 'end', 'null-label'));
}
// Tail label
if (n > 0) {
  const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
  const lx = lastX + geo.nodeBodyWidth + 30;
  const tx = lastX + geo.nodeBodyWidth + 5;
  items.push(SharedPointerUtils.makeLabel(lx, 70, 'TAIL', 'start', 'tail-label'));
  items.push(SharedPointerUtils.makeArrow(
    { x: lastX + geo.nodeBodyWidth + 25, y: 65 }, { x: tx - 2, y: 65 },
    undefined, '--accent-secondary', 2,
  ));
}
// Prev arrows (in section 1, before custom pointers)
for (let i = 1; i < n; i++) {
  const hasCustom = step.customPointers?.some(p => p.fromId === String(i) && p.type === 'prev');
  if (!hasCustom) {
    const fromX = SharedPointerUtils.getNodeX(i, geo.nodeBodyWidth);
    const toX = SharedPointerUtils.getNodeX(i - 1, geo.nodeBodyWidth) + geo.nodeBodyWidth + 5;
    items.push(SharedPointerUtils.makeArrow(
      { x: fromX, y: 75 }, { x: toX, y: 75 },
      undefined, '--node-section-secondary', 2,
    ));
  }
}
```

### Doubly-Circular — Arcs + tail label
```typescript
if (n >= 2) {
  const lastX = SharedPointerUtils.getNodeX(n - 1, geo.nodeBodyWidth);
  const firstX = SharedPointerUtils.getNodeX(0, geo.nodeBodyWidth);
  // Next arc
  items.push(SharedPointerUtils.makeArrow(
    { x: lastX + geo.nodeBodyWidth * 0.9, y: 40 }, { x: firstX + geo.nodeBodyWidth * 0.1, y: 38 },
    [{ x: lastX + geo.nodeBodyWidth * 0.9, y: 0 }, { x: firstX + geo.nodeBodyWidth * 0.1, y: 0 }],
    '--node-section-primary', 2,
  ));
  // Prev arc
  items.push(SharedPointerUtils.makeArrow(
    { x: firstX + geo.nodeBodyWidth * 0.1, y: 95 }, { x: lastX + geo.nodeBodyWidth * 0.9, y: 95 },
    [{ x: firstX + geo.nodeBodyWidth * 0.1, y: 130 }, { x: lastX + geo.nodeBodyWidth * 0.9, y: 130 }],
    '--node-section-secondary', 2,
  ));
}
// Tail label same as Doubly
// Prev arrows loop same as Doubly
```

---

## Step 5 — `noStepItems` per type

When step is null (preview/generate state), render the static resting state. Same pattern but without sections 4/5/6 and without custom-pointer conditional skips in section 1.

| Type | Sections |
|---|---|
| Normal | next arrows + head label + null-right end |
| Circular | next arrows + head label + circular arc |
| Doubly | next arrows + prev arrows + head label + tail label + null-down (both ends) |
| Doubly-Circular | next arrows + prev arrows + head label + tail label + both arcs |

---

## Step 6 — File size estimate

| File | Current | New |
|---|---|---|
| `shared-pointer-utils.ts` | ~340 lines | ~70 lines |
| `normal-pointer.service.ts` | ~121 lines | ~500 lines |
| `circular-pointer.service.ts` | ~50 lines | ~450 lines |
| `doubly-pointer.service.ts` | ~90 lines | ~550 lines |
| `doubly-circular-pointer.service.ts` | ~80 lines | ~550 lines |
| **Total** | ~680 lines | ~2,120 lines |

---

## What does NOT change
- `shared-pointer-types.ts` — `PointerArrow`, `PointerLabel`, `PointerItem`, `PointerGeoContext`
- Visualizer templates (already isolated via single `@for` loop)
- `routeCustomPointer` routing logic inside `SharedPointerUtils`
- Backend
- Shell component
