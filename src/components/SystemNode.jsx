import { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ChevronDown, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { LAYERS, CRITICALITY } from '../lib/layers';

// Every side gets one handle. The canvas runs in ConnectionMode.Loose, so an edge
// can attach to any side and the JSON picks sides via sourceHandle/targetHandle.
const SIDES = [
  { id: 't', position: Position.Top },
  { id: 'r', position: Position.Right },
  { id: 'b', position: Position.Bottom },
  { id: 'l', position: Position.Left },
];

function IoList({ title, items, expanded }) {
  return (
    <div>
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">{title}</div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.name} className="rounded bg-slate-950/60 px-2 py-1">
            <div className="text-[11px] text-slate-400">{item.name}</div>
            <code className={`block font-mono text-[11px] leading-snug text-slate-200 ${expanded ? '' : 'line-clamp-1'}`}>
              {item.type}
            </code>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SystemNode({ data, selected }) {
  const [expanded, setExpanded] = useState(false);
  const layer = LAYERS[data.layer];
  const criticality = CRITICALITY[data.criticality];
  const Icon = layer.icon;

  return (
    <div
      className={`w-[300px] rounded-xl border-2 bg-slate-900/95 text-left shadow-xl backdrop-blur transition-opacity duration-200 ${layer.accent} ${
        selected ? 'ring-2 ring-white/40' : ''
      } ${data.dimmed ? 'opacity-25' : 'opacity-100'}`}
    >
      {SIDES.map((side) => (
        <Handle key={side.id} id={side.id} type="source" position={side.position} className="!h-2 !w-2 !border-0 !bg-slate-500" />
      ))}

      {/* Header: layer icon, title, criticality badge */}
      <header className="flex items-start gap-2 border-b border-slate-800 p-3">
        <div className={`rounded-lg p-1.5 ${layer.chip}`}>
          <Icon size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{layer.label}</div>
          <div className="text-sm font-semibold leading-tight text-slate-100">{data.label}</div>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${criticality.className}`}>
          {criticality.label}
        </span>
      </header>

      <div className="space-y-2 p-3">
        <div className="flex flex-wrap gap-1">
          {data.tech.map((t) => (
            <span key={t} className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">
              {t}
            </span>
          ))}
        </div>
        <IoList title="In" items={data.io.input} expanded={expanded} />
        <IoList title="Out" items={data.io.output} expanded={expanded} />
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
          <section>
            <h4 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Responsibilities</h4>
            <ul className="space-y-1">
              {data.responsibilities.map((r) => (
                <li key={r} className="flex gap-1.5 text-xs leading-snug text-slate-300">
                  <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-emerald-400" />
                  {r}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h4 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Failure modes</h4>
            <ul className="space-y-2">
              {data.failureModes.map((f) => (
                <li key={f.scenario} className="rounded-lg border border-red-500/20 bg-red-500/5 p-2 text-xs leading-snug">
                  <div className="flex gap-1.5 font-medium text-red-200">
                    <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                    {f.scenario}
                  </div>
                  <p className="mt-1 text-slate-400">
                    <span className="text-slate-500">Impact: </span>
                    {f.impact}
                  </p>
                  <p className="mt-0.5 text-slate-300">
                    <span className="text-slate-500">Mitigation: </span>
                    {f.mitigation}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}

export default memo(SystemNode);
