import { useEffect, useState } from 'react';
import { useCatalog, useSystem } from './hooks/useSystems';
import { useHashRoute } from './hooks/useHashRoute';
import SystemSwitcher from './components/SystemSwitcher';
import SystemCanvas from './components/SystemCanvas';
import Sidebar from './components/Sidebar';

function Message({ children }) {
  return <div className="flex flex-1 items-center justify-center p-8 text-sm text-slate-400">{children}</div>;
}

export default function App() {
  const catalog = useCatalog();
  const [route, navigate] = useHashRoute();
  const [activeStep, setActiveStep] = useState(null);

  const available = catalog.data?.systems.filter((s) => s.file) ?? [];
  const entry = available.find((s) => s.id === route) ?? available[0];
  const system = useSystem(entry?.file);

  useEffect(() => setActiveStep(null), [entry?.id]);

  return (
    <div className="flex h-dvh flex-col bg-slate-950 text-slate-100">
      <header className="flex items-center justify-between gap-4 border-b border-slate-800 px-4 py-3">
        <h1 className="shrink-0 text-sm font-semibold tracking-tight whitespace-nowrap sm:text-base">
          How Systems Work
        </h1>
        {catalog.data && entry && (
          <SystemSwitcher systems={catalog.data.systems} value={entry.id} onChange={navigate} />
        )}
      </header>

      {catalog.error || system.error ? (
        <Message>Could not load system data: {(catalog.error || system.error).message}</Message>
      ) : !system.data || system.loading ? (
        <Message>Loading…</Message>
      ) : (
        <main className="flex min-h-0 flex-1 flex-col md:flex-row">
          <div className="min-h-0 flex-1">
            <SystemCanvas key={system.data.id} system={system.data} activeStep={activeStep} />
          </div>
          <Sidebar system={system.data} activeStep={activeStep} onStepChange={setActiveStep} />
        </main>
      )}
    </div>
  );
}
