import { useEffect, useState } from 'react';
import { X, ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react';
import SystemCanvas from './SystemCanvas';
import { Legend } from './Sidebar';
import { NodeHeader, NodeDetailsFull } from './NodeDetails';

// Incoming and outgoing edges for one node, with the peer node's label.
function connectionsFor(system, nodeId) {
  const label = (id) => system.nodes.find((n) => n.id === id).data.label;
  const toItem = (e, peer, dir) => ({ id: e.id, dir, peer: label(peer), payload: e.data.payload, color: system.flows[e.data.flow].color });
  return [
    ...system.edges.filter((e) => e.target === nodeId).map((e) => toItem(e, e.source, 'in')),
    ...system.edges.filter((e) => e.source === nodeId).map((e) => toItem(e, e.target, 'out')),
  ];
}

function Connections({ system, nodeId }) {
  return (
    <ul className="space-y-1">
      {connectionsFor(system, nodeId).map((c) => {
        const Arrow = c.dir === 'in' ? ArrowLeft : ArrowRight;
        return (
          <li key={c.id} className="flex items-start gap-1.5 text-xs leading-snug">
            <Arrow size={12} className="mt-0.5 shrink-0" style={{ color: c.color }} />
            <span className="text-slate-300">
              {c.dir === 'in' ? 'from' : 'to'} <span className="font-medium text-slate-100">{c.peer}</span>
              <span className="block font-mono text-[11px] text-slate-500">{c.payload}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function NodeSheet({ system, nodeId, onClose }) {
  const node = system.nodes.find((n) => n.id === nodeId);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal="true" aria-label={node.data.label}>
      <button type="button" aria-label="Close details" className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative max-h-[80dvh] overflow-y-auto overscroll-contain rounded-t-2xl border-t border-slate-700 bg-slate-900 px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-700" />
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <NodeHeader data={node.data} size="lg" />
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="-mr-1 rounded-lg p-1 text-slate-400 hover:bg-slate-800">
            <X size={20} />
          </button>
        </div>
        <div className="mt-3 space-y-3">
          <Connections system={system} nodeId={nodeId} />
          <NodeDetailsFull data={node.data} />
        </div>
      </div>
    </div>
  );
}

function StepBar({ system, activeStep, onStepChange }) {
  const step = system.walkthrough.find((w) => w.step === activeStep);
  const chip = (active) =>
    `shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${active ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`;

  return (
    <div className="border-t border-slate-800 bg-slate-950 pb-[env(safe-area-inset-bottom)]">
      <div className="px-4 pt-3 text-xs leading-relaxed">
        {step ? (
          <>
            <div className="font-semibold text-slate-100">
              {step.step}. {step.title}
            </div>
            <p className="mt-0.5 text-slate-400">{step.text}</p>
          </>
        ) : (
          <p className="text-slate-500">Tap a step to trace it, or tap a component for details.</p>
        )}
      </div>
      <div className="flex gap-1.5 overflow-x-auto px-4 py-3">
        <button type="button" className={chip(activeStep == null)} onClick={() => onStepChange(null)}>
          All
        </button>
        {system.walkthrough.map((w) => (
          <button
            key={w.step}
            type="button"
            className={chip(activeStep === w.step)}
            onClick={() => onStepChange(activeStep === w.step ? null : w.step)}
            aria-label={`Step ${w.step}: ${w.title}`}
          >
            {w.step}
          </button>
        ))}
      </div>
    </div>
  );
}

function ComponentList({ system }) {
  return (
    <div className="h-full space-y-3 overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <section>
        <h2 className="text-base font-semibold text-slate-100">{system.title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-400">{system.summary}</p>
      </section>
      {system.nodes.map((n) => (
        <details key={n.id} className="group rounded-xl border border-slate-800 bg-slate-900">
          <summary className="flex cursor-pointer list-none items-start gap-2 p-3 [&::-webkit-details-marker]:hidden">
            <div className="min-w-0 flex-1">
              <NodeHeader data={n.data} />
            </div>
            <ChevronDown size={16} className="mt-1 shrink-0 text-slate-500 transition-transform group-open:rotate-180" />
          </summary>
          <div className="space-y-3 border-t border-slate-800 p-3">
            <Connections system={system} nodeId={n.id} />
            <NodeDetailsFull data={n.data} />
          </div>
        </details>
      ))}
      <Legend flows={system.flows} />
    </div>
  );
}

export default function MobileView({ system, activeStep, onStepChange }) {
  const [tab, setTab] = useState('diagram');
  const [selected, setSelected] = useState(null);
  const tabClass = (t) =>
    `flex-1 rounded-md py-1.5 text-sm font-medium ${tab === t ? 'bg-slate-700 text-slate-100' : 'text-slate-400'}`;

  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <div className="flex gap-1 border-b border-slate-800 p-2" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'diagram'} className={tabClass('diagram')} onClick={() => setTab('diagram')}>
          Diagram
        </button>
        <button type="button" role="tab" aria-selected={tab === 'list'} className={tabClass('list')} onClick={() => setTab('list')}>
          Components
        </button>
      </div>

      {tab === 'diagram' ? (
        <>
          <div className="min-h-0 flex-1">
            <SystemCanvas key={system.id} system={system} activeStep={activeStep} compact onNodeSelect={setSelected} />
          </div>
          <StepBar system={system} activeStep={activeStep} onStepChange={onStepChange} />
        </>
      ) : (
        <div className="min-h-0 flex-1">
          <ComponentList system={system} />
        </div>
      )}

      {selected && <NodeSheet system={system} nodeId={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}
