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

const nodeTypes = { systemNode: SystemNode };
const CIRCLED = ['⓪', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨'];

// Visual styling is derived from edge.data.flow so the JSON stays purely semantic.
function styleEdge(edge, flows, activeStep) {
  const { flow, payload, steps = [], bidirectional } = edge.data;
  const color = flows[flow].color;
  const active = activeStep == null || steps.includes(activeStep);
  const marker = { type: MarkerType.ArrowClosed, color, width: 18, height: 18 };

  return {
    ...edge,
    type: 'smoothstep',
    animated: flow !== 'ingest' && active,
    label: `${steps.map((s) => CIRCLED[s]).join('')} ${payload}`.trim(),
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

export default function SystemCanvas({ system, activeStep }) {
  // Local state so users can drag nodes; the parent remounts this per system via `key`.
  const [nodes, , onNodesChange] = useNodesState(system.nodes);

  const edges = useMemo(
    () => system.edges.map((e) => styleEdge(e, system.flows, activeStep)),
    [system, activeStep],
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
      nodeTypes={nodeTypes}
      connectionMode={ConnectionMode.Loose}
      nodesConnectable={false}
      fitView
      fitViewOptions={{ padding: 0.15 }}
      minZoom={0.2}
      colorMode="dark"
      proOptions={{ hideAttribution: true }}
    >
      <Background gap={24} color="#1e293b" />
      <Controls showInteractive={false} />
      <MiniMap pannable zoomable nodeColor="#334155" bgColor="#020617" maskColor="rgba(15,23,42,0.6)" style={{ width: 160, height: 100 }} className="!hidden md:!block" />
    </ReactFlow>
  );
}
