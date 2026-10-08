import { LAYERS } from '../lib/layers';

export function Legend({ flows }) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Legend</h3>
      <ul className="space-y-1.5 text-xs text-slate-300">
        {Object.entries(flows).map(([key, flow]) => (
          <li key={key} className="flex items-center gap-2">
            <span className="h-0.5 w-6 rounded" style={{ background: flow.color }} />
            {flow.label}
          </li>
        ))}
      </ul>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {Object.entries(LAYERS).map(([key, layer]) => (
          <li key={key} className={`rounded px-1.5 py-0.5 text-[11px] ${layer.chip}`}>
            {layer.label}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Sidebar({ system, activeStep, onStepChange }) {
  return (
    <aside className="flex w-80 flex-col gap-5 overflow-y-auto border-l border-slate-800 bg-slate-950 p-4">
      <section>
        <h2 className="text-base font-semibold text-slate-100">{system.title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-400">{system.summary}</p>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Walkthrough</h3>
          {activeStep != null && (
            <button type="button" onClick={() => onStepChange(null)} className="text-xs text-sky-400 hover:text-sky-300">
              Show all
            </button>
          )}
        </div>
        <ol className="space-y-1">
          {system.walkthrough.map((w) => {
            const active = activeStep === w.step;
            return (
              <li key={w.step}>
                <button
                  type="button"
                  onClick={() => onStepChange(active ? null : w.step)}
                  className={`w-full rounded-lg p-2 text-left transition-colors ${
                    active ? 'bg-sky-500/15 ring-1 ring-sky-500/40' : 'hover:bg-slate-900'
                  }`}
                >
                  <div className="flex gap-2 text-sm font-medium text-slate-200">
                    <span className="text-sky-400">{w.step}.</span>
                    {w.title}
                  </div>
                  {active && <p className="mt-1 pl-5 text-xs leading-relaxed text-slate-400">{w.text}</p>}
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      <Legend flows={system.flows} />
    </aside>
  );
}
