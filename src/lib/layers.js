import { Monitor, Network, Cpu, Database, Cloud } from 'lucide-react';

// Class strings are written out in full so Tailwind can find them at build time.
export const LAYERS = {
  client: { label: 'Client UI', icon: Monitor, accent: 'border-sky-400/60', chip: 'bg-sky-400/15 text-sky-300' },
  gateway: { label: 'Gateway', icon: Network, accent: 'border-amber-400/60', chip: 'bg-amber-400/15 text-amber-300' },
  processing: { label: 'Processing Engine', icon: Cpu, accent: 'border-violet-400/60', chip: 'bg-violet-400/15 text-violet-300' },
  storage: { label: 'Storage / DB', icon: Database, accent: 'border-emerald-400/60', chip: 'bg-emerald-400/15 text-emerald-300' },
  external: { label: 'External API', icon: Cloud, accent: 'border-rose-400/60', chip: 'bg-rose-400/15 text-rose-300' },
};

// What the header badge means: how the system behaves when this node is down.
export const CRITICALITY = {
  critical: { label: 'Critical path', className: 'bg-red-500/15 text-red-300 ring-red-500/30' },
  degradable: { label: 'Degradable', className: 'bg-amber-500/15 text-amber-300 ring-amber-500/30' },
  async: { label: 'Async', className: 'bg-slate-500/20 text-slate-300 ring-slate-500/30' },
};

export const HANDLE_IDS = ['t', 'r', 'b', 'l'];
