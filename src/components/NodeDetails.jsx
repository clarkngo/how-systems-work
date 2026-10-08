import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { LAYERS, CRITICALITY } from '../lib/layers';

const sectionTitle = 'mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500';

export function NodeHeader({ data, size = 'md' }) {
  const layer = LAYERS[data.layer];
  const criticality = CRITICALITY[data.criticality];
  const Icon = layer.icon;

  return (
    <div className="flex items-start gap-2">
      <div className={`rounded-lg p-1.5 ${layer.chip}`}>
        <Icon size={size === 'lg' ? 18 : 16} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{layer.label}</div>
        <div className={`font-semibold leading-tight text-slate-100 ${size === 'lg' ? 'text-base' : 'text-sm'}`}>
          {data.label}
        </div>
      </div>
      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${criticality.className}`}>
        {criticality.label}
      </span>
    </div>
  );
}

export function TechChips({ tech }) {
  return (
    <div className="flex flex-wrap gap-1">
      {tech.map((t) => (
        <span key={t} className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">
          {t}
        </span>
      ))}
    </div>
  );
}

export function IoList({ title, items, clamp = false }) {
  return (
    <div>
      <div className={sectionTitle}>{title}</div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.name} className="rounded bg-slate-950/60 px-2 py-1">
            <div className="text-[11px] text-slate-400">{item.name}</div>
            <code className={`block font-mono text-[11px] leading-snug break-words text-slate-200 ${clamp ? 'line-clamp-1' : ''}`}>
              {item.type}
            </code>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Responsibilities({ items }) {
  return (
    <section>
      <h4 className={sectionTitle}>Responsibilities</h4>
      <ul className="space-y-1">
        {items.map((r) => (
          <li key={r} className="flex gap-1.5 text-xs leading-snug text-slate-300">
            <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-emerald-400" />
            {r}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function FailureModes({ items }) {
  return (
    <section>
      <h4 className={sectionTitle}>Failure modes</h4>
      <ul className="space-y-2">
        {items.map((f) => (
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
  );
}

// Everything about a node, for places with room to show it all (sheet, list view).
export function NodeDetailsFull({ data }) {
  return (
    <div className="space-y-3">
      <TechChips tech={data.tech} />
      <IoList title="In" items={data.io.input} />
      <IoList title="Out" items={data.io.output} />
      <Responsibilities items={data.responsibilities} />
      <FailureModes items={data.failureModes} />
    </div>
  );
}
