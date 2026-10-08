import { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ChevronDown } from 'lucide-react';
import { LAYERS, CRITICALITY } from '../lib/layers';
import { NodeHeader, TechChips, IoList, Responsibilities, FailureModes } from './NodeDetails';

// Every side gets one handle. The canvas runs in ConnectionMode.Loose, so an edge
// can attach to any side and the JSON picks sides via sourceHandle/targetHandle.
const SIDES = [
  { id: 't', position: Position.Top },
  { id: 'r', position: Position.Right },
  { id: 'b', position: Position.Bottom },
  { id: 'l', position: Position.Left },
];

const Handles = () =>
  SIDES.map((side) => (
    <Handle key={side.id} id={side.id} type="source" position={side.position} className="!h-2 !w-2 !border-0 !bg-slate-500" />
  ));

// Mobile: title and status only. Tapping opens the full details in a bottom sheet.
function CompactNode({ data, selected }) {
  const layer = LAYERS[data.layer];
  const Icon = layer.icon;

  return (
    <div
      className={`flex w-[150px] items-center gap-1.5 rounded-lg border-2 bg-slate-900 p-2 shadow-lg transition-opacity duration-200 ${layer.accent} ${
        selected ? 'ring-2 ring-white/50' : ''
      } ${data.dimmed ? 'opacity-25' : 'opacity-100'}`}
    >
      <Handles />
      <div className={`shrink-0 rounded p-1 ${layer.chip}`}>
        <Icon size={14} />
      </div>
      <div className="min-w-0 flex-1 text-[11px] leading-tight font-semibold text-slate-100">{data.label}</div>
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${CRITICALITY[data.criticality].dot}`}
        title={CRITICALITY[data.criticality].label}
      />
    </div>
  );
}

function FullNode({ data, selected }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`w-[300px] rounded-xl border-2 bg-slate-900/95 text-left shadow-xl backdrop-blur transition-opacity duration-200 ${
        LAYERS[data.layer].accent
      } ${selected ? 'ring-2 ring-white/40' : ''} ${data.dimmed ? 'opacity-25' : 'opacity-100'}`}
    >
      <Handles />

      <header className="border-b border-slate-800 p-3">
        <NodeHeader data={data} />
      </header>

      <div className="space-y-2 p-3">
        <TechChips tech={data.tech} />
        <IoList title="In" items={data.io.input} clamp={!expanded} />
        <IoList title="Out" items={data.io.output} clamp={!expanded} />
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="nodrag flex w-full items-center justify-between border-t border-slate-800 px-3 py-2 text-xs text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
        aria-expanded={expanded}
      >
        <span>
          {expanded ? 'Hide' : 'Show'} internals · {data.failureModes.length} failure modes
        </span>
        <ChevronDown size={14} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Drawer: nodrag/nowheel so text can be selected and scrolled without panning the canvas */}
      {expanded && (
        <div className="nodrag nowheel max-h-80 cursor-auto space-y-3 overflow-y-auto border-t border-slate-800 p-3 select-text">
          <Responsibilities items={data.responsibilities} />
          <FailureModes items={data.failureModes} />
        </div>
      )}
    </div>
  );
}

function SystemNode(props) {
  return props.data.compact ? <CompactNode {...props} /> : <FullNode {...props} />;
}

export default memo(SystemNode);
