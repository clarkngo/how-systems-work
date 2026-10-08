import { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ConnectionMode,
  MarkerType,
  useNodesState,
} from '@xyflow/react';
import SystemNode from './SystemNode';
import { toMobileLayout } from '../lib/mobileLayout';

const nodeTypes = { systemNode: SystemNode };
const CIRCLED = ['⓪', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨'];

// Visual styling is derived from edge.data.flow so the JSON stays purely semantic.
function styleEdge(edge, flows, activeStep, compact) {
  const { flow, payload, steps = [], bidirectional } = edge.data;
  const { color, animated = true } = flows[flow];
  const active = activeStep == null || steps.includes(activeStep);
  const marker = { type: MarkerType.ArrowClosed, color, width: 18, height: 18 };
  const stepLabel = steps.map((s) => CIRCLED[s]).join('');
  // On phones, payload text only appears for the selected step; otherwise just the step number.
  const showPayload = !compact || (activeStep != null && active);

  return {
    ...edge,
    type: 'smoothstep',
    animated: animated && active,
    label: (showPayload ? `${stepLabel} ${payload}` : stepLabel).trim() || undefined,
    markerEnd: marker,
    markerStart: bidirectional ? marker : undefined,
    style: { stroke: color, strokeWidth: active ? 2 : 1, opacity: active ? 1 : 0.15 },
    labelStyle: { fill: '#e2e8f0', fontSize: 11, fontFamily: 'ui-monospace, monospace', opacity: active ? 1 : 0.3 },
    labelBgStyle: { fill: '#0f172a', fillOpacity: active ? 0.9 : 0.3 },
    labelBgPadding: [6, 3],
    labelBgBorderRadius: 4,
    zIndex: active ? 1 : 0,
  };
}

export default function SystemCanvas({ system, activeStep, compact = false, onNodeSelect }) {
  const layout = useMemo(() => (compact ? toMobileLayout(system) : system), [system, compact]);

  // Local state so users can drag nodes; the parent remounts this per system/layout via `key`.
  const [nodes, , onNodesChange] = useNodesState(layout.nodes);

  const edges = useMemo(
    () => layout.edges.map((e) => styleEdge(e, system.flows, activeStep, compact)),
    [layout, system.flows, activeStep, compact],
  );

  const displayNodes = useMemo(() => {
    if (activeStep == null) return nodes;
    const involved = new Set(
      system.edges.filter((e) => e.data.steps?.includes(activeStep)).flatMap((e) => [e.source, e.target]),
    );
    return nodes.map((n) => ({ ...n, data: { ...n.data, dimmed: !involved.has(n.id) } }));
  }, [nodes, system.edges, activeStep]);

  return (
    <ReactFlow
      nodes={displayNodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onNodeClick={onNodeSelect ? (_, node) => onNodeSelect(node.id) : undefined}
      nodeTypes={nodeTypes}
      connectionMode={ConnectionMode.Loose}
      nodesConnectable={false}
      nodesDraggable={!compact}
      fitView
      fitViewOptions={{ padding: compact ? 0.14 : 0.15 }}
      minZoom={0.2}
      colorMode="dark"
      proOptions={{ hideAttribution: true }}
    >
      <Background gap={24} color="#1e293b" />
      <Controls showInteractive={false} showZoom={!compact} />
      {!compact && (
        <MiniMap
          pannable
          zoomable
          nodeColor="#334155"
          bgColor="#020617"
          maskColor="rgba(15,23,42,0.6)"
          style={{ width: 160, height: 100 }}
        />
      )}
    </ReactFlow>
  );
}
