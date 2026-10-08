// Portrait phones can't fit a left-to-right graph, so we mirror it across the
// diagonal: columns become rows. Handles rotate with it (right ↔ bottom, left ↔ top)
// so edges still leave and enter the same logical side.
const ROTATE = { t: 'l', l: 't', r: 'b', b: 'r' };

// Authored spacing assumes 300px-wide full nodes; compact mobile nodes are ~150x64.
const ROW_SCALE = 0.42; // original x (380px columns) → vertical spacing
const COL_SCALE = 0.75; // original y (240/480px rows) → horizontal spacing

export function toMobileLayout(system) {
  return {
    nodes: system.nodes.map((n) => ({
      ...n,
      position: { x: n.position.y * COL_SCALE, y: n.position.x * ROW_SCALE },
      data: { ...n.data, compact: true },
    })),
    edges: system.edges.map((e) => ({
      ...e,
      sourceHandle: ROTATE[e.sourceHandle],
      targetHandle: ROTATE[e.targetHandle],
    })),
  };
}
